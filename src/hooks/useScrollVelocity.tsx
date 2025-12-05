import { useEffect, useRef, useState } from 'react';

interface ScrollVelocityData {
  velocity: number;
  isScrollingFast: boolean;
  direction: 'up' | 'down' | 'idle';
}

export const useScrollVelocity = (threshold: number = 5): ScrollVelocityData => {
  const [scrollData, setScrollData] = useState<ScrollVelocityData>({
    velocity: 0,
    isScrollingFast: false,
    direction: 'idle'
  });

  const lastScrollY = useRef(0);
  const lastTime = useRef(Date.now());
  const velocityRef = useRef(0);

  useEffect(() => {
    let ticking = false;

    const updateScrollVelocity = () => {
      const currentTime = Date.now();
      const currentScrollY = window.scrollY;
      
      const deltaTime = currentTime - lastTime.current;
      const deltaY = currentScrollY - lastScrollY.current;
      
      if (deltaTime > 0) {
        const velocity = Math.abs(deltaY / deltaTime);
        velocityRef.current = velocity;
        
        setScrollData({
          velocity,
          isScrollingFast: velocity > threshold,
          direction: deltaY > 0 ? 'down' : deltaY < 0 ? 'up' : 'idle'
        });
      }

      lastScrollY.current = currentScrollY;
      lastTime.current = currentTime;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollVelocity);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);

  return scrollData;
};