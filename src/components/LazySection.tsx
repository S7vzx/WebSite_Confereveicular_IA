import { Suspense, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useScrollVelocity } from '@/hooks/useScrollVelocity';

interface LazySectionProps {
  children: React.ReactNode;
  className?: string;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
}

const LazySection: React.FC<LazySectionProps> = ({
  children,
  className,
  fallback,
  threshold = 0.3,
  rootMargin = '200px'
}) => {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { isScrollingFast, velocity, direction } = useScrollVelocity(3);

  useEffect(() => {
    const element = ref.current;
    if (!element || isLoaded) return;

    // Ajusta configurações baseado na velocidade do scroll
    const dynamicThreshold = isScrollingFast ? 0.1 : threshold;
    const dynamicRootMargin = isScrollingFast 
      ? `${Math.min(800, 200 + velocity * 50)}px` 
      : rootMargin;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          setIsLoaded(true);
          observer.unobserve(element);
        }
      },
      {
        threshold: dynamicThreshold,
        rootMargin: dynamicRootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, isLoaded, isScrollingFast, velocity]);

  return (
    <div ref={ref} className={cn("min-h-[200px]", className)}>
      <div className={cn(
        "transition-opacity duration-300",
        isScrollingFast && direction === 'down' 
          ? "transition-duration-150" 
          : "transition-duration-500",
        isInView ? "opacity-100" : "opacity-0"
      )}>
        {isInView ? (
          <Suspense fallback={fallback || <SectionSkeleton velocity={velocity} />}>
            {children}
          </Suspense>
        ) : (
          fallback || <SectionSkeleton velocity={velocity} />
        )}
      </div>
    </div>
  );
};

const SectionSkeleton = ({ velocity = 0 }: { velocity?: number }) => (
  <div className="w-full py-20">
    <div className="container mx-auto px-4">
      {/* Header skeleton */}
      <div className="text-center mb-16">
        <div className="h-12 bg-muted/30 rounded-lg w-96 mx-auto mb-4">
          <div 
            className={cn(
              "h-full bg-gradient-to-r from-muted/40 via-muted/60 to-muted/40 rounded-lg bg-[length:200%_100%]",
              velocity > 5 ? "animate-[shimmer_1s_ease-in-out_infinite]" : "animate-shimmer"
            )} 
          />
        </div>
        <div className="h-6 bg-muted/20 rounded w-2/3 mx-auto">
          <div 
            className={cn(
              "h-full bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30 rounded bg-[length:200%_100%]",
              velocity > 5 ? "animate-[shimmer_1s_ease-in-out_infinite]" : "animate-shimmer"
            )} 
          />
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(velocity > 8 ? 2 : 3)].map((_, i) => (
          <div key={i} className="h-64 bg-muted/20 rounded-xl overflow-hidden">
            <div 
              className={cn(
                "h-full bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30 bg-[length:200%_100%]",
                velocity > 5 ? "animate-[shimmer_1s_ease-in-out_infinite]" : "animate-shimmer"
              )} 
            />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default LazySection;