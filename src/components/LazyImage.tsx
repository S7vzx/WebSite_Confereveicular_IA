import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  placeholder?: React.ReactNode;
  onLoad?: () => void;
  eager?: boolean;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className,
  fallback,
  placeholder,
  onLoad,
  eager = false
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(eager);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (eager) return;

    const element = containerRef.current;
    if (!element || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [eager, isInView]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
  };

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      {/* Placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0">
          {placeholder || (
            <div className="w-full h-full bg-gradient-to-br from-muted/40 to-muted/60 animate-pulse" />
          )}
        </div>
      )}

      {/* Actual Image */}
      {isInView && !hasError && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-500",
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading={eager ? 'eager' : 'lazy'}
        />
      )}

      {/* Fallback */}
      {hasError && fallback && (
        <img
          src={fallback}
          alt={alt}
          className="w-full h-full object-cover"
          onLoad={handleLoad}
        />
      )}
    </div>
  );
};

export default LazyImage;