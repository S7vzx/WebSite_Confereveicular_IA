// Performance Monitoring System
interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  url?: string;
  metadata?: Record<string, any>;
}

interface WebVitalsData {
  fcp: number | null; // First Contentful Paint
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  ttfb: number | null; // Time to First Byte
}

interface ImageMetrics {
  totalImages: number;
  imagesLoaded: number;
  avgLoadTime: number;
  cacheHitRatio: number;
  failedImages: number;
}

interface NetworkMetrics {
  connectionType: string;
  effectiveType: string;
  downlink: number;
  rtt: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private webVitals: WebVitalsData = {
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null
  };
  private imageMetrics: ImageMetrics = {
    totalImages: 0,
    imagesLoaded: 0,
    avgLoadTime: 0,
    cacheHitRatio: 0,
    failedImages: 0
  };
  private networkMetrics: NetworkMetrics = {
    connectionType: 'unknown',
    effectiveType: 'unknown',
    downlink: 0,
    rtt: 0
  };
  private observers: PerformanceObserver[] = [];
  private startTime = performance.now();

  constructor() {
    this.initWebVitalsTracking();
    this.initResourceTracking();
    this.initNavigationTracking();
    this.initNetworkMonitoring();
    this.setupPeriodicReporting();
  }

  private initWebVitalsTracking() {
    // Track First Contentful Paint
    this.observePerformanceEntry('paint', (entries) => {
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          this.webVitals.fcp = entry.startTime;
          this.recordMetric('FCP', entry.startTime);
        }
      });
    });

    // Track Largest Contentful Paint
    this.observePerformanceEntry('largest-contentful-paint', (entries) => {
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        this.webVitals.lcp = lastEntry.startTime;
        this.recordMetric('LCP', lastEntry.startTime);
      }
    });

    // Track First Input Delay
    this.observePerformanceEntry('first-input', (entries) => {
      const firstInput = entries[0] as any;
      if (firstInput && firstInput.processingStart) {
        const fid = firstInput.processingStart - firstInput.startTime;
        this.webVitals.fid = fid;
        this.recordMetric('FID', fid);
      }
    });

    // Track Cumulative Layout Shift
    let clsValue = 0;
    this.observePerformanceEntry('layout-shift', (entries) => {
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      this.webVitals.cls = clsValue;
      this.recordMetric('CLS', clsValue);
    });

    // Track Time to First Byte
    this.observePerformanceEntry('navigation', (entries) => {
      const navigation = entries[0] as PerformanceNavigationTiming;
      if (navigation) {
        this.webVitals.ttfb = navigation.responseStart - navigation.fetchStart;
        this.recordMetric('TTFB', this.webVitals.ttfb);
      }
    });
  }

  private initResourceTracking() {
    this.observePerformanceEntry('resource', (entries) => {
      entries.forEach((entry: any) => {
        const resourceType = entry.initiatorType;
        const loadTime = entry.responseEnd - entry.startTime;

        this.recordMetric(`${resourceType}_load_time`, loadTime, {
          url: entry.name,
          size: entry.transferSize,
          cached: entry.transferSize === 0
        });

        // Track image specific metrics
        if (resourceType === 'img') {
          this.updateImageMetrics(entry);
        }
      });
    });
  }

  private initNavigationTracking() {
    this.observePerformanceEntry('navigation', (entries) => {
      const navigation = entries[0] as PerformanceNavigationTiming;
      if (navigation) {
        const metrics = {
          dns: navigation.domainLookupEnd - navigation.domainLookupStart,
          tcp: navigation.connectEnd - navigation.connectStart,
          request: navigation.responseStart - navigation.requestStart,
          response: navigation.responseEnd - navigation.responseStart,
          dom: navigation.domContentLoadedEventEnd - navigation.responseEnd,
          load: navigation.loadEventEnd - navigation.loadEventStart
        };

        Object.entries(metrics).forEach(([name, value]) => {
          this.recordMetric(`navigation_${name}`, value);
        });
      }
    });
  }

  private initNetworkMonitoring() {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      this.updateNetworkMetrics(connection);

      connection.addEventListener('change', () => {
        this.updateNetworkMetrics(connection);
      });
    }
  }

  private updateNetworkMetrics(connection: any) {
    this.networkMetrics = {
      connectionType: connection.type || 'unknown',
      effectiveType: connection.effectiveType || 'unknown',
      downlink: connection.downlink || 0,
      rtt: connection.rtt || 0
    };

    this.recordMetric('network_downlink', connection.downlink || 0);
    this.recordMetric('network_rtt', connection.rtt || 0);
  }

  private updateImageMetrics(entry: any) {
    this.imageMetrics.totalImages++;
    
    if (entry.responseEnd > 0) {
      this.imageMetrics.imagesLoaded++;
      const loadTime = entry.responseEnd - entry.startTime;
      this.imageMetrics.avgLoadTime = 
        (this.imageMetrics.avgLoadTime * (this.imageMetrics.imagesLoaded - 1) + loadTime) / 
        this.imageMetrics.imagesLoaded;
    } else {
      this.imageMetrics.failedImages++;
    }

    // Update cache hit ratio
    if (entry.transferSize === 0) {
      this.imageMetrics.cacheHitRatio = 
        (this.imageMetrics.cacheHitRatio * (this.imageMetrics.totalImages - 1) + 1) / 
        this.imageMetrics.totalImages;
    } else {
      this.imageMetrics.cacheHitRatio = 
        (this.imageMetrics.cacheHitRatio * (this.imageMetrics.totalImages - 1)) / 
        this.imageMetrics.totalImages;
    }
  }

  private observePerformanceEntry(
    type: string,
    callback: (entries: PerformanceEntry[]) => void
  ) {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      
      observer.observe({ type, buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn(`Performance observer for ${type} not supported:`, error);
    }
  }

  private recordMetric(name: string, value: number, metadata?: Record<string, any>) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: performance.now(),
      url: window.location.href,
      metadata
    };

    this.metrics.push(metric);

    // Keep only last 1000 metrics
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }
  }

  private setupPeriodicReporting() {
    // Report metrics every 30 seconds
    setInterval(() => {
      this.reportMetrics();
    }, 30000);

    // Report on page unload
    window.addEventListener('beforeunload', () => {
      this.reportMetrics();
    });

    // Report on visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.reportMetrics();
      }
    });
  }

  private reportMetrics() {
    const report = {
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      sessionDuration: performance.now() - this.startTime,
      webVitals: this.webVitals,
      imageMetrics: this.imageMetrics,
      networkMetrics: this.networkMetrics,
      recentMetrics: this.metrics.slice(-50) // Last 50 metrics
    };

    // Send to analytics endpoint (implement based on your analytics service)
    this.sendToAnalytics(report);
    
    // Store locally for development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚀 Performance Report');
      console.table(this.webVitals);
      console.table(this.imageMetrics);
      console.table(this.networkMetrics);
      console.groupEnd();
    }
  }

  private async sendToAnalytics(report: any) {
    try {
      // Replace with your analytics endpoint
      // await fetch('/api/analytics/performance', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(report)
      // });

      // Store in localStorage for now
      const reports = JSON.parse(localStorage.getItem('performanceReports') || '[]');
      reports.push(report);
      
      // Keep only last 10 reports
      if (reports.length > 10) {
        reports.splice(0, reports.length - 10);
      }
      
      localStorage.setItem('performanceReports', JSON.stringify(reports));
    } catch (error) {
      console.warn('Failed to send analytics:', error);
    }
  }

  // Public methods for external use
  startTransaction(name: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const duration = performance.now() - startTime;
      this.recordMetric(`transaction_${name}`, duration);
    };
  }

  trackImageLoad(src: string, cached: boolean = false) {
    const startTime = performance.now();
    
    return () => {
      const loadTime = performance.now() - startTime;
      this.recordMetric('custom_image_load', loadTime, { src, cached });
    };
  }

  trackUserInteraction(action: string, element?: string) {
    this.recordMetric('user_interaction', performance.now(), { action, element });
  }

  getMetrics() {
    return {
      webVitals: this.webVitals,
      imageMetrics: this.imageMetrics,
      networkMetrics: this.networkMetrics,
      recentMetrics: this.metrics.slice(-20)
    };
  }

  getPerformanceScore(): number {
    let score = 100;

    // Deduct points based on Core Web Vitals
    if (this.webVitals.fcp && this.webVitals.fcp > 1800) score -= 15;
    if (this.webVitals.lcp && this.webVitals.lcp > 2500) score -= 20;
    if (this.webVitals.fid && this.webVitals.fid > 100) score -= 15;
    if (this.webVitals.cls && this.webVitals.cls > 0.1) score -= 10;
    if (this.webVitals.ttfb && this.webVitals.ttfb > 600) score -= 10;

    // Deduct points for poor image performance
    if (this.imageMetrics.cacheHitRatio < 0.8) score -= 10;
    if (this.imageMetrics.avgLoadTime > 1000) score -= 10;
    if (this.imageMetrics.failedImages > 0) score -= 5;

    return Math.max(0, Math.round(score));
  }

  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Create global instance
const performanceMonitor = new PerformanceMonitor();

// Export for global access
(window as any).performanceMonitor = performanceMonitor;

export default performanceMonitor;
export { PerformanceMonitor, type PerformanceMetric, type WebVitalsData };
