// Performance utilities
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

export const preloadCriticalImages = async () => {
  const criticalImages = [
    '/uploads/fd5932e4-78b9-4795-af60-28883b4d0463.png', // Hero car
    '/uploads/f5472cd0-a719-4870-a846-6a0f274a9336.png', // Hero person
  ];

  try {
    await Promise.all(criticalImages.map(preloadImage));
  } catch (error) {
    console.warn('Failed to preload some critical images:', error);
  }
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T => {
  let timeout: ReturnType<typeof setTimeout>;
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  }) as T;
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): T => {
  let inThrottle: boolean;
  return ((...args: any[]) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  }) as T;
};

// Browser capabilities detection
export const getBrowserCapabilities = () => {
  const canvas = document.createElement('canvas');
  return {
    webp: canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0,
    webgl: !!(window as any).WebGLRenderingContext && !!canvas.getContext('webgl'),
    intersection: 'IntersectionObserver' in window,
    passiveListeners: (() => {
      let supportsPassive = false;
      try {
        const opts = Object.defineProperty({}, 'passive', {
          get() {
            supportsPassive = true;
            return false;
          }
        });
        window.addEventListener('testPassive', () => {}, opts);
        window.removeEventListener('testPassive', () => {}, opts);
      } catch (e) {}
      return supportsPassive;
    })()
  };
};