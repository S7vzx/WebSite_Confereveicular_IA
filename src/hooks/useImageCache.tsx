import { useEffect, useState, useCallback, useRef } from 'react';
import imageOptimizer, { ImageOptimizer, type OptimizationOptions, type ImageMetadata } from '@/utils/imageOptimization';

interface ImageCacheOptions extends OptimizationOptions {
  preload?: boolean;
  cache?: boolean;
  maxCacheSize?: number;
  maxCacheAge?: number;
}

interface CachedImage {
  src: string;
  blob: Blob;
  metadata: ImageMetadata;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
}

interface ImageCacheHook {
  src: string | null;
  isLoading: boolean;
  error: Error | null;
  metadata: ImageMetadata | null;
  placeholder: string;
  preloadNext: (urls: string[]) => Promise<void>;
  clearCache: () => void;
  getCacheStats: () => {
    size: number;
    entries: number;
    hitRatio: number;
  };
}

class ImageCacheManager {
  private cache = new Map<string, CachedImage>();
  private maxSize: number;
  private maxAge: number;
  private hits = 0;
  private misses = 0;
  private dbName = 'ImageCache';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  constructor(maxSize = 50 * 1024 * 1024, maxAge = 7 * 24 * 60 * 60 * 1000) { // 50MB, 7 days
    this.maxSize = maxSize;
    this.maxAge = maxAge;
    this.initDB();
    this.startCleanupTimer();
  }

  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        this.loadCacheFromDB();
        resolve();
      };

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('images')) {
          const store = db.createObjectStore('images', { keyPath: 'src' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('lastAccessed', 'lastAccessed', { unique: false });
        }
      };
    });
  }

  private async loadCacheFromDB(): Promise<void> {
    if (!this.db) return;

    try {
      const transaction = this.db.transaction(['images'], 'readonly');
      const store = transaction.objectStore('images');
      const request = store.getAll();

      request.onsuccess = () => {
        const images = request.result as CachedImage[];
        const now = Date.now();

        images.forEach(image => {
          // Only load recent images
          if (now - image.timestamp < this.maxAge) {
            this.cache.set(image.src, image);
          }
        });

        this.cleanupExpiredEntries();
      };
    } catch (error) {
      console.warn('Failed to load cache from IndexedDB:', error);
    }
  }

  private async saveToDB(cachedImage: CachedImage): Promise<void> {
    if (!this.db) return;

    try {
      const transaction = this.db.transaction(['images'], 'readwrite');
      const store = transaction.objectStore('images');
      await store.put(cachedImage);
    } catch (error) {
      console.warn('Failed to save to IndexedDB:', error);
    }
  }

  private startCleanupTimer(): void {
    // Cleanup every 10 minutes
    setInterval(() => {
      this.cleanupExpiredEntries();
    }, 10 * 60 * 1000);
  }

  private cleanupExpiredEntries(): void {
    const now = Date.now();
    const entriesToDelete: string[] = [];
    let totalSize = 0;

    // Calculate total size and find expired entries
    for (const [src, image] of this.cache) {
      if (now - image.timestamp > this.maxAge) {
        entriesToDelete.push(src);
      } else {
        totalSize += image.blob.size;
      }
    }

    // Remove expired entries
    entriesToDelete.forEach(src => {
      this.cache.delete(src);
      this.removeFromDB(src);
    });

    // If still over size limit, remove least recently used
    if (totalSize > this.maxSize) {
      const sortedEntries = Array.from(this.cache.entries())
        .sort(([, a], [, b]) => a.lastAccessed - b.lastAccessed);

      while (totalSize > this.maxSize && sortedEntries.length > 0) {
        const [src, image] = sortedEntries.shift()!;
        totalSize -= image.blob.size;
        this.cache.delete(src);
        this.removeFromDB(src);
      }
    }
  }

  private async removeFromDB(src: string): Promise<void> {
    if (!this.db) return;

    try {
      const transaction = this.db.transaction(['images'], 'readwrite');
      const store = transaction.objectStore('images');
      await store.delete(src);
    } catch (error) {
      console.warn('Failed to remove from IndexedDB:', error);
    }
  }

  async get(src: string, options: ImageCacheOptions = {}): Promise<string> {
    const optimizedSrc = imageOptimizer.generateOptimizedSrc(src, options);

    // Check memory cache first
    const cached = this.cache.get(optimizedSrc);
    if (cached) {
      cached.lastAccessed = Date.now();
      cached.accessCount++;
      this.hits++;
      return URL.createObjectURL(cached.blob);
    }

    this.misses++;

    // Fetch and cache the image
    try {
      const response = await fetch(optimizedSrc);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const blob = await response.blob();
      const metadata = await imageOptimizer.getImageMetadata(optimizedSrc);

      const cachedImage: CachedImage = {
        src: optimizedSrc,
        blob,
        metadata: metadata!,
        timestamp: Date.now(),
        accessCount: 1,
        lastAccessed: Date.now()
      };

      this.cache.set(optimizedSrc, cachedImage);
      await this.saveToDB(cachedImage);

      // Trigger cleanup if needed
      if (this.cache.size % 10 === 0) {
        setTimeout(() => this.cleanupExpiredEntries(), 0);
      }

      return URL.createObjectURL(blob);
    } catch (error) {
      console.warn('Failed to cache image:', optimizedSrc, error);
      return optimizedSrc; // Fallback to original URL
    }
  }

  async preload(urls: string[], options: ImageCacheOptions = {}): Promise<void> {
    const promises = urls.map(async (url) => {
      try {
        await this.get(url, { ...options, preload: true });
      } catch (error) {
        console.warn('Failed to preload image:', url, error);
      }
    });

    await Promise.allSettled(promises);
  }

  clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;

    if (this.db) {
      const transaction = this.db.transaction(['images'], 'readwrite');
      const store = transaction.objectStore('images');
      store.clear();
    }
  }

  getStats() {
    const totalRequests = this.hits + this.misses;
    return {
      size: Array.from(this.cache.values()).reduce((sum, img) => sum + img.blob.size, 0),
      entries: this.cache.size,
      hitRatio: totalRequests > 0 ? this.hits / totalRequests : 0
    };
  }
}

// Global cache manager instance
const cacheManager = new ImageCacheManager();

export const useImageCache = (
  src: string,
  options: ImageCacheOptions = {}
): ImageCacheHook => {
  const [cachedSrc, setCachedSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [placeholder, setPlaceholder] = useState<string>('');
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadImage = useCallback(async () => {
    if (!src) {
      setIsLoading(false);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setIsLoading(true);
    setError(null);

    try {
      // Get image metadata for placeholder
      const imageMetadata = await imageOptimizer.getImageMetadata(src);
      if (imageMetadata) {
        setMetadata(imageMetadata);
        const placeholderSrc = imageOptimizer.generatePlaceholder(
          imageMetadata,
          (options.placeholder as 'blur' | 'color' | 'gradient') || 'blur'
        );
        setPlaceholder(placeholderSrc);
      }

      // Get cached or fetch image
      const cachedImageSrc = await cacheManager.get(src, options);
      
      if (!abortControllerRef.current?.signal.aborted) {
        setCachedSrc(cachedImageSrc);
        setIsLoading(false);
      }
    } catch (err) {
      if (!abortControllerRef.current?.signal.aborted) {
        setError(err as Error);
        setIsLoading(false);
        setCachedSrc(src); // Fallback to original
      }
    }
  }, [src, options]);

  useEffect(() => {
    loadImage();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadImage]);

  const preloadNext = useCallback(async (urls: string[]) => {
    await cacheManager.preload(urls, options);
  }, [options]);

  const clearCache = useCallback(() => {
    cacheManager.clear();
  }, []);

  const getCacheStats = useCallback(() => {
    return cacheManager.getStats();
  }, []);

  return {
    src: cachedSrc,
    isLoading,
    error,
    metadata,
    placeholder,
    preloadNext,
    clearCache,
    getCacheStats
  };
};

// Hook for preloading critical images
export const useCriticalImagePreload = () => {
  const [isPreloaded, setIsPreloaded] = useState(false);

  useEffect(() => {
    const preloadCritical = async () => {
      try {
        const criticalImages = ImageOptimizer.getCriticalImages();
        await cacheManager.preload(criticalImages, { priority: 'high' });
        setIsPreloaded(true);
      } catch (error) {
        console.warn('Failed to preload critical images:', error);
      }
    };

    preloadCritical();
  }, []);

  return isPreloaded;
};

// Hook for viewport-based preloading
export const useViewportPreload = (threshold = 0.5) => {
  const [preloadQueue, setPreloadQueue] = useState<string[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const src = img.dataset.preloadSrc;
            if (src && !preloadQueue.includes(src)) {
              setPreloadQueue(prev => [...prev, src]);
            }
          }
        });
      },
      { threshold }
    );

    return () => {
      observerRef.current?.disconnect();
    };
  }, [threshold]);

  const addToPreloadQueue = useCallback((element: HTMLElement, src: string) => {
    if (observerRef.current) {
      element.dataset.preloadSrc = src;
      observerRef.current.observe(element);
    }
  }, []);

  useEffect(() => {
    if (preloadQueue.length > 0) {
      cacheManager.preload(preloadQueue.slice(-5)); // Preload last 5 items
    }
  }, [preloadQueue]);

  return { addToPreloadQueue };
};

export default useImageCache;