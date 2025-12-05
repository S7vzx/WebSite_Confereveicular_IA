// Service Worker Registration with intelligent updates
import { Workbox } from 'workbox-window';

interface SWRegistrationOptions {
  onReady?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onOffline?: () => void;
  onOnline?: () => void;
  enablePrecaching?: boolean;
  enableBackgroundSync?: boolean;
}

class ServiceWorkerManager {
  private wb: Workbox | null = null;
  private registration: ServiceWorkerRegistration | null = null;
  private updateCheckInterval: NodeJS.Timeout | null = null;

  async register(options: SWRegistrationOptions = {}) {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Workers not supported');
      return null;
    }

    try {
      this.wb = new Workbox('/sw.js');
      
      // Handle service worker events
      this.setupEventListeners(options);
      
      // Register service worker
      this.registration = await this.wb.register();
      
      // Setup update checking
      this.setupUpdateChecking();
      
      // Setup network status monitoring
      this.setupNetworkMonitoring(options);
      
      // Enable background sync if requested
      if (options.enableBackgroundSync) {
        this.enableBackgroundSync();
      }
      
      options.onReady?.(this.registration);
      
      return this.registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }

  private setupEventListeners(options: SWRegistrationOptions) {
    if (!this.wb) return;

    this.wb.addEventListener('installed', event => {
      if (event.isUpdate) {
        this.showUpdateAvailable();
        options.onUpdate?.(this.registration!);
      }
    });

    this.wb.addEventListener('waiting', () => {
      this.showUpdateAvailable();
    });

    this.wb.addEventListener('controlling', () => {
      window.location.reload();
    });

    this.wb.addEventListener('activated', event => {
      if (event.isUpdate) {
        this.showUpdateComplete();
      }
    });
  }

  private setupUpdateChecking() {
    // Check for updates every 30 minutes
    this.updateCheckInterval = setInterval(() => {
      this.checkForUpdates();
    }, 30 * 60 * 1000);

    // Check on visibility change
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.checkForUpdates();
      }
    });
  }

  private setupNetworkMonitoring(options: SWRegistrationOptions) {
    const updateOnlineStatus = () => {
      if (navigator.onLine) {
        options.onOnline?.();
        this.syncOfflineData();
      } else {
        options.onOffline?.();
      }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
  }

  private enableBackgroundSync() {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then(registration => {
        return (registration as any).sync.register('background-sync');
      }).catch(error => {
        console.warn('Background sync registration failed:', error);
      });
    }
  }

  async checkForUpdates() {
    if (!this.wb) return;

    try {
      await this.wb.update();
    } catch (error) {
      console.warn('Update check failed:', error);
    }
  }

  async skipWaiting() {
    if (!this.wb) return;

    try {
      await this.wb.messageSkipWaiting();
    } catch (error) {
      console.error('Skip waiting failed:', error);
    }
  }

  private showUpdateAvailable() {
    // Create update notification
    const notification = document.createElement('div');
    notification.className = 'sw-update-notification';
    notification.innerHTML = `
      <div class="bg-primary text-primary-foreground p-4 rounded-lg shadow-lg fixed bottom-4 right-4 z-50 max-w-sm">
        <p class="font-medium mb-2">Nova versão disponível!</p>
        <p class="text-sm mb-3">Uma nova versão da aplicação está pronta.</p>
        <div class="flex gap-2">
          <button class="bg-background text-foreground px-3 py-1 rounded text-sm" onclick="this.closest('.sw-update-notification').remove()">
            Mais tarde
          </button>
          <button class="bg-accent text-accent-foreground px-3 py-1 rounded text-sm" onclick="window.swManager.skipWaiting()">
            Atualizar agora
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 10 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 10000);
  }

  private showUpdateComplete() {
    const notification = document.createElement('div');
    notification.className = 'sw-update-complete';
    notification.innerHTML = `
      <div class="bg-success text-success-foreground p-3 rounded-lg shadow-lg fixed bottom-4 right-4 z-50">
        <p class="font-medium">✓ Aplicação atualizada com sucesso!</p>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  private async syncOfflineData() {
    if ('serviceWorker' in navigator && this.registration) {
      try {
        await (this.registration as any).sync.register('background-sync');
      } catch (error) {
        console.warn('Background sync failed:', error);
      }
    }
  }

  async getCacheStats() {
    if (!this.registration) return null;

    try {
      const messageChannel = new MessageChannel();
      
      return new Promise((resolve) => {
        messageChannel.port1.onmessage = (event) => {
          resolve(event.data);
        };
        
        this.registration!.active?.postMessage(
          { type: 'GET_CACHE_STATS' },
          [messageChannel.port2]
        );
      });
    } catch (error) {
      console.error('Failed to get cache stats:', error);
      return null;
    }
  }

  async clearCache(cacheName?: string) {
    try {
      if (cacheName) {
        await caches.delete(cacheName);
      } else {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }

  unregister() {
    if (this.updateCheckInterval) {
      clearInterval(this.updateCheckInterval);
    }

    if (this.registration) {
      return this.registration.unregister();
    }
    
    return Promise.resolve(false);
  }
}

// Create global instance
const swManager = new ServiceWorkerManager();

// Export for global access
(window as any).swManager = swManager;

export default swManager;
export { ServiceWorkerManager };