import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

// Detect if device is mobile
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
};

export const useScrollReveal = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const el = ref.current;
    if (!el || isVisible) return;

    // Respect reduced motion to avoid flicker
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setIsVisible(true);
      return;
    }

    // Mobile-specific configuration for better scroll detection
    const mobileConfig = {
      threshold: 0.01,
      rootMargin: '50px 0px 50px 0px',
    };

    const desktopConfig = {
      threshold: 0.05,
      rootMargin: '50px 0px 50px 0px',
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      {
        ...(isMobile ? mobileConfig : desktopConfig),
        ...options,
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [isMobile, isVisible]);

  return { ref, isVisible };
};

// Component wrapper for easy use
interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({ 
  children, 
  className = "", 
  delay = 0 
}) => {
  const { ref, isVisible } = useScrollReveal();

  const combinedClassName = [
    "transition-all duration-700 ease-out",
    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      ref={ref}
      className={combinedClassName}
      style={{ 
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};