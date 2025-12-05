import { memo } from 'react';
import { cn } from '@/lib/utils';
import { useImageCache } from '@/hooks/useImageCache';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  placeholder?: React.ReactNode;
  onLoad?: () => void;
  eager?: boolean;
  quality?: number;
  webp?: boolean;
}

const OptimizedImage = memo<OptimizedImageProps>(({
  src,
  alt,
  className,
  fallback,
  placeholder,
  onLoad,
  eager = false,
  quality = 85,
  webp = true
}) => {
  const { src: optimizedSrc, isLoading, error, placeholder: generatedPlaceholder } = useImageCache(src, {
    quality,
    format: webp ? 'webp' : 'auto',
    priority: eager ? 'high' : 'medium'
  });

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Placeholder */}
      {isLoading && (
        <div className="absolute inset-0">
          {placeholder || (
            <img 
              src={generatedPlaceholder} 
              alt="" 
              className="w-full h-full object-cover opacity-50" 
            />
          )}
        </div>
      )}

      {/* Optimized Image */}
      {optimizedSrc && !error && (
        <img
          src={optimizedSrc}
          alt={alt}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            isLoading ? 'opacity-0' : 'opacity-100'
          )}
          onLoad={() => onLoad?.()}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
        />
      )}

      {/* Error fallback */}
      {error && (
        <div className="w-full h-full bg-muted/20 flex items-center justify-center">
          <div className="text-muted-foreground text-sm">Imagem não encontrada</div>
        </div>
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;