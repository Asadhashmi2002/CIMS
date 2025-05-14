import React, { useEffect, useRef } from 'react';
// For some reason TypeScript and anime.js don't play well together, so we use require instead
const anime = require('animejs/lib/anime.js');

const AnimationExample: React.FC = () => {
  const animationRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (animationRef.current) {
      anime({
        targets: animationRef.current.querySelectorAll('.element'),
        translateX: [
          { value: 250, duration: 1000, delay: anime.stagger(100) },
          { value: 0, duration: 1000, delay: anime.stagger(100) }
        ],
        translateY: [
          { value: -40, duration: 500, delay: anime.stagger(100) },
          { value: 40, duration: 500, delay: anime.stagger(100) },
          { value: 0, duration: 500, delay: anime.stagger(100) }
        ],
        scaleX: [
          { value: 4, duration: 100, delay: anime.stagger(100), easing: 'easeOutExpo' },
          { value: 1, duration: 900 }
        ],
        scaleY: [
          { value: [1.75, 1], duration: 500 }
        ],
        easing: 'easeOutElastic(1, .8)',
        loop: true
      });
    }
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Anime.js Animation Example</h2>
      <div ref={animationRef} className="flex gap-4 p-4">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className="element w-12 h-12 bg-blue-500 rounded-full"
          />
        ))}
      </div>
    </div>
  );
};

export default AnimationExample; 