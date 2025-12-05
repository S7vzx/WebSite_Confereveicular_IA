// Advanced Image Optimization System
interface ImageFormat {
  extension: string;
  mimeType: string;
  quality: number;
  supported: boolean;
}

interface OptimizationOptions {
  quality?: number;
  format?: 'webp' | 'avif' | 'auto';
  sizes?: string;
  priority?: 'high' | 'medium' | 'low';
  placeholder?: 'blur' | 'color' | 'none';
  progressive?: boolean;
}

interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  size: number;
  aspectRatio: number;
  dominant_color?: string;
}

class ImageOptimizer {
  private formatCache = new Map<string, ImageFormat>();
  private metadataCache = new Map<string, ImageMetadata>();
  private supportedFormats: ImageFormat[] = [];
  private connectionType: string = 'unknown';

  constructor() {
    this.detectFormatSupport();
    this.detectConnectionType();
    this.setupNetworkListener();
  }

  private async detectFormatSupport() {
    const formats = [
      { extension: 'avif', mimeType: 'image/avif', quality: 50 },
      { extension: 'webp', mimeType: 'image/webp', quality: 85 },
      { extension: 'jpg', mimeType: 'image/jpeg', quality: 85 },
      { extension: 'png', mimeType: 'image/png', quality: 100 }
    ];

    for (const format of formats) {
      const supported = await this.testFormatSupport(format.mimeType);
      this.supportedFormats.push({ ...format, supported });
      this.formatCache.set(format.extension, { ...format, supported });
    }
  }

  private testFormatSupport(mimeType: string): Promise<boolean> {
    return new Promise(resolve => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      
      try {
        const dataUrl = canvas.toDataURL(mimeType);
        resolve(dataUrl.startsWith(`data:${mimeType}`));
      } catch {
        resolve(false);
      }
    });
  }

  private detectConnectionType() {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      this.connectionType = connection?.effectiveType || 'unknown';
    }
  }

  private setupNetworkListener() {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      connection?.addEventListener('change', () => {
        this.connectionType = connection.effectiveType;
      });
    }
  }

  getBestFormat(originalFormat: string = 'jpg'): ImageFormat {
    // Return best supported format based on browser capabilities
    const avif = this.formatCache.get('avif');
    const webp = this.formatCache.get('webp');
    const fallback = this.formatCache.get(originalFormat) || this.formatCache.get('jpg')!;

    if (avif?.supported) return avif;
    if (webp?.supported) return webp;
    return fallback;
  }

  generateOptimizedSrc(
    originalSrc: string,
    options: OptimizationOptions = {}
  ): string {
    const {
      quality = this.getOptimalQuality(),
      format = 'auto',
      priority = 'medium'
    } = options;

    // For uploads, apply query parameters
    if (originalSrc.includes('uploads')) {
      const url = new URL(originalSrc, window.location.origin);
      
      if (format === 'auto') {
        const bestFormat = this.getBestFormat();
        if (bestFormat.extension !== 'jpg' && bestFormat.extension !== 'png') {
          url.searchParams.set('format', bestFormat.extension);
        }
      } else {
        url.searchParams.set('format', format);
      }
      
      url.searchParams.set('quality', quality.toString());
      
      if (priority === 'high') {
        url.searchParams.set('priority', 'high');
      }
      
      return url.toString();
    }

    return originalSrc;
  }

  generateSrcSet(
    originalSrc: string,
    sizes: number[] = [320, 640, 960, 1280, 1920],
    options: OptimizationOptions = {}
  ): string {
    return sizes
      .map(size => {
        const optimizedSrc = this.generateOptimizedSrc(originalSrc, {
          ...options,
          quality: this.getQualityForSize(size)
        });
        
        if (originalSrc.includes('uploads')) {
          const url = new URL(optimizedSrc);
          url.searchParams.set('w', size.toString());
          return `${url.toString()} ${size}w`;
        }
        
        return `${optimizedSrc} ${size}w`;
      })
      .join(', ');
  }

  private getOptimalQuality(): number {
    switch (this.connectionType) {
      case 'slow-2g':
      case '2g':
        return 60;
      case '3g':
        return 75;
      case '4g':
      default:
        return 85;
    }
  }

  private getQualityForSize(size: number): number {
    const baseQuality = this.getOptimalQuality();
    
    // Reduce quality for larger images to save bandwidth
    if (size > 1280) return Math.max(baseQuality - 10, 60);
    if (size > 960) return Math.max(baseQuality - 5, 65);
    return baseQuality;
  }

  async getImageMetadata(src: string): Promise<ImageMetadata | null> {
    if (this.metadataCache.has(src)) {
      return this.metadataCache.get(src)!;
    }

    try {
      const metadata = await this.extractImageMetadata(src);
      this.metadataCache.set(src, metadata);
      return metadata;
    } catch (error) {
      console.warn('Failed to get image metadata:', error);
      return null;
    }
  }

  private extractImageMetadata(src: string): Promise<ImageMetadata> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = img.width;
        canvas.height = img.height;
        
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          
          // Get dominant color
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const dominantColor = this.getDominantColor(imageData.data);
          
          resolve({
            width: img.width,
            height: img.height,
            format: this.getImageFormat(src),
            size: this.estimateImageSize(img.width, img.height),
            aspectRatio: img.width / img.height,
            dominant_color: dominantColor
          });
        } else {
          resolve({
            width: img.width,
            height: img.height,
            format: this.getImageFormat(src),
            size: this.estimateImageSize(img.width, img.height),
            aspectRatio: img.width / img.height
          });
        }
      };
      
      img.onerror = reject;
      img.crossOrigin = 'anonymous';
      img.src = src;
    });
  }

  private getDominantColor(imageData: Uint8ClampedArray): string {
    const colorMap = new Map<string, number>();
    
    // Sample every 10th pixel for performance
    for (let i = 0; i < imageData.length; i += 40) {
      const r = imageData[i];
      const g = imageData[i + 1];
      const b = imageData[i + 2];
      const alpha = imageData[i + 3];
      
      if (alpha > 128) { // Only consider non-transparent pixels
        const color = `rgb(${r},${g},${b})`;
        colorMap.set(color, (colorMap.get(color) || 0) + 1);
      }
    }
    
    let dominantColor = 'rgb(128,128,128)';
    let maxCount = 0;
    
    for (const [color, count] of colorMap) {
      if (count > maxCount) {
        maxCount = count;
        dominantColor = color;
      }
    }
    
    return dominantColor;
  }

  private getImageFormat(src: string): string {
    const extension = src.split('.').pop()?.toLowerCase();
    return extension || 'unknown';
  }

  private estimateImageSize(width: number, height: number): number {
    // Rough estimation based on dimensions (in bytes)
    return width * height * 3; // RGB bytes
  }

  async preloadImage(src: string, options: OptimizationOptions = {}): Promise<void> {
    const optimizedSrc = this.generateOptimizedSrc(src, options);
    
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = optimizedSrc;
      
      if (options.sizes) {
        link.setAttribute('imagesizes', options.sizes);
      }
      
      const srcset = this.generateSrcSet(src, undefined, options);
      if (srcset) {
        link.setAttribute('imagesrcset', srcset);
      }
      
      link.onload = () => resolve();
      link.onerror = reject;
      
      document.head.appendChild(link);
      
      // Clean up after load
      setTimeout(() => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      }, 1000);
    });
  }

  generatePlaceholder(
    metadata: ImageMetadata | null,
    type: 'blur' | 'color' | 'gradient' = 'blur'
  ): string {
    if (!metadata) {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZjNmNGY2Ii8+Cjwvc3ZnPgo=';
    }

    switch (type) {
      case 'color':
        return this.generateColorPlaceholder(metadata.dominant_color || '#f3f4f6');
      case 'gradient':
        return this.generateGradientPlaceholder(metadata.dominant_color || '#f3f4f6');
      case 'blur':
      default:
        return this.generateBlurPlaceholder(metadata);
    }
  }

  private generateColorPlaceholder(color: string): string {
    const svg = `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="10" height="10" fill="${color}"/>
    </svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  private generateGradientPlaceholder(color: string): string {
    const lighterColor = this.lightenColor(color, 20);
    const svg = `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${lighterColor};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="10" height="10" fill="url(#grad)"/>
    </svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  private generateBlurPlaceholder(metadata: ImageMetadata): string {
    const { width, height, dominant_color } = metadata;
    const aspectRatio = width / height;
    const svgWidth = Math.min(20, width);
    const svgHeight = svgWidth / aspectRatio;
    
    const svg = `<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="${svgWidth}" height="${svgHeight}" fill="${dominant_color || '#f3f4f6'}"/>
      <filter id="blur" x="0" y="0">
        <feGaussianBlur in="SourceGraphic" stdDeviation="1"/>
      </filter>
    </svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  private lightenColor(color: string, percent: number): string {
    // Simple color lightening
    const match = color.match(/rgb\((\d+),(\d+),(\d+)\)/);
    if (!match) return color;
    
    const [, r, g, b] = match.map(Number);
    const newR = Math.min(255, r + (255 - r) * percent / 100);
    const newG = Math.min(255, g + (255 - g) * percent / 100);
    const newB = Math.min(255, b + (255 - b) * percent / 100);
    
    return `rgb(${Math.round(newR)},${Math.round(newG)},${Math.round(newB)})`;
  }

  // Critical images for the vehicle consultation site
  static getCriticalImages(): string[] {
    return [
      '/uploads/fd5932e4-78b9-4795-af60-28883b4d0463.png', // Hero car
      '/uploads/f5472cd0-a719-4870-a846-6a0f274a9336.png', // Hero person
    ];
  }

  static getConsultationImages(): string[] {
    return [
      'consulta-placa.webp',
      'consulta-chassi.webp',
      'consulta-renavam.webp',
      'consulta-crv.webp',
      'consulta-crlv-moderna.webp',
      'consulta-debitos.webp',
      'consulta-multas.webp',
      'consulta-gravame.webp',
      'consulta-renainf.webp',
      'consulta-renajud.webp',
      'consulta-sinistro.webp',
      'consulta-leilao.webp',
      'roubo-furto.webp',
      'historico-proprietario.webp',
      'consulta-proprietario.webp',
      'emitir-crlv.webp',
      'comunicacao-venda.webp'
    ];
  }
}

// Create global instance
const imageOptimizer = new ImageOptimizer();

export default imageOptimizer;
export { ImageOptimizer, type OptimizationOptions, type ImageMetadata };