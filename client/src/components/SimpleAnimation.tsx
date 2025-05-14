import React, { useState, useEffect } from 'react';

const SimpleAnimation: React.FC = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    // Start animation
    const interval = setInterval(() => {
      setIsAnimating(prev => !prev);
    }, 1500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">CSS Animation Example</h2>
      <div className="flex gap-4 p-4">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className={`
              w-12 h-12 bg-blue-500 rounded-full
              transition-all duration-1000 ease-in-out
              ${isAnimating ? 'transform translate-y-8 scale-150 bg-purple-500' : ''}
            `}
            style={{ transitionDelay: `${i * 100}ms` }}
          />
        ))}
      </div>
    </div>
  );
};

export default SimpleAnimation; 