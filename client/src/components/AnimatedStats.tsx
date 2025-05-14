import React, { useEffect, useRef } from 'react';
import '../styles/animations.css';
import CountUpAnimation from './CountUpAnimation';

declare global {
  interface Window {
    AniJS: any;
  }
}

interface StatItemProps {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
}

const StatItem: React.FC<StatItemProps> = ({ value, label, prefix = '', suffix = '' }) => {
  return (
    <div className="stat-item flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <h3 
        className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-1 sm:mb-2"
        data-anijs="if: scroll, on: window, do: fadeInUp animated, before: scrollReveal"
      >
        <CountUpAnimation end={value} prefix={prefix} suffix={suffix} />
      </h3>
      <p className="text-xs sm:text-sm md:text-base text-gray-600 text-center">{label}</p>
    </div>
  );
};

const AnimatedStats: React.FC = () => {
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamically load AniJS from CDN
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/anijs/0.9.3/anijs-min.js';
    script.async = true;
    script.onload = () => {
      // Initialize AniJS
      if (window.AniJS) {
        window.AniJS.run();
        
        // Helper function for scroll reveal
        window.AniJS.createHelper('scrollReveal', function(_e: Event, animationContext: { eventTarget: HTMLElement }) {
          const element = animationContext.eventTarget;
          
          // Check if element is already in viewport
          const rect = element.getBoundingClientRect();
          const isInViewport = rect.top <= window.innerHeight && rect.bottom >= 0;
          
          if (isInViewport) {
            return true;
          }
          
          return false;
        });
      }
    };
    document.body.appendChild(script);

    // Cleanup
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <section ref={statsRef} className="stats-section py-10 sm:py-16 bg-gradient-to-r from-gray-50 to-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-gray-800">Our Impact</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          <StatItem value={10000} suffix="+" label="Students Managed" />
          <StatItem value={25000000} prefix="₹" suffix="+" label="Fees Collected" />
          <StatItem value={100} suffix="+" label="Schools & Institutes" />
          <StatItem value={1000000} suffix="+" label="Attendance Tracked" />
        </div>
      </div>
    </section>
  );
};

export default AnimatedStats; 