import React, { useState, useEffect, useRef } from 'react';

interface CountUpProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

const CountUpAnimation: React.FC<CountUpProps> = ({ 
  end, 
  duration = 2000, 
  prefix = '', 
  suffix = '' 
}) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);
  const startTimeRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isMobile = useRef<boolean>(window.innerWidth < 768);

  useEffect(() => {
    // Shorter duration on mobile for better performance
    const actualDuration = isMobile.current ? Math.min(duration, 1500) : duration;
    
    const startAnimation = () => {
      // Easing function for smooth counting
      const easeOutQuad = (t: number): number => t * (2 - t);
      
      const animate = (timestamp: number) => {
        if (!startTimeRef.current) {
          startTimeRef.current = timestamp;
        }
        
        const progress = Math.min((timestamp - startTimeRef.current) / actualDuration, 1);
        const easedProgress = easeOutQuad(progress);
        
        setCount(Math.floor(easedProgress * end));
        
        if (progress < 1) {
          frameRef.current = requestAnimationFrame(animate);
        }
      };
      
      frameRef.current = requestAnimationFrame(animate);
    };

    // Check if element is in viewport
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          startAnimation();
          // Once animation started, disconnect observer
          observerRef.current?.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observerRef.current.observe(countRef.current);
    }

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      observerRef.current?.disconnect();
    };
  }, [end, duration]);

  // Format number with commas for thousands
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <span ref={countRef} className="whitespace-nowrap">
      {prefix}{formatNumber(count)}{suffix}
    </span>
  );
};

export default CountUpAnimation; 