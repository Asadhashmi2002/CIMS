import React, { useState, useEffect, useRef } from 'react';

const ResponsiveAnimation: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Delay to allow component to mount before animation starts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    // Add scroll animation when items come into view
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    
    // Store the current value of containerRef to use in cleanup
    const currentContainer = containerRef.current;
    
    if (currentContainer) {
      observer.observe(currentContainer);
    }
    
    return () => {
      clearTimeout(timer);
      if (currentContainer) {
        observer.unobserve(currentContainer);
      }
    };
  }, []);
  
  const features = [
    { 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 md:h-14 md:w-14 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      title: "Attendance Tracking",
      description: "Real-time attendance tracking with automated notifications to parents",
      color: "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200",
      textColor: "text-blue-700",
      hoverEffect: "hover:shadow-blue-200 hover:border-blue-300"
    },
    { 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 md:h-14 md:w-14 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Fee Management",
      description: "Streamlined fee collection with detailed payment tracking",
      color: "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200",
      textColor: "text-green-700",
      hoverEffect: "hover:shadow-green-200 hover:border-green-300"
    },
    { 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 md:h-14 md:w-14 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: "Smart Notifications",
      description: "Automated WhatsApp and email alerts for important updates",
      color: "bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200",
      textColor: "text-purple-700",
      hoverEffect: "hover:shadow-purple-200 hover:border-purple-300"
    },
    { 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 md:h-14 md:w-14 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Advanced Analytics",
      description: "Comprehensive reports and insights to optimize performance",
      color: "bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200",
      textColor: "text-orange-700",
      hoverEffect: "hover:shadow-orange-200 hover:border-orange-300"
    }
  ];
  
  return (
    <div ref={containerRef} className="py-4 md:py-8">
      {/* Animated feature grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 px-2">
        {features.map((feature, index) => (
          <div 
            key={index}
            className={`
              relative p-6 md:p-8 rounded-xl border shadow-md
              ${feature.color} ${feature.hoverEffect}
              transition-all duration-500 ease-out
              transform hover:-translate-y-1 hover:shadow-lg
              ${isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-12'
              }
            `}
            style={{ 
              transitionDelay: `${index * 100}ms`,
            }}
          >
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-20 h-20 rounded-bl-xl rounded-tr-xl bg-white/10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 rounded-tl-xl rounded-br-xl bg-white/20"></div>
            
            {/* Feature content */}
            <div className="relative">
              <div className="mb-5 rounded-full w-16 h-16 flex items-center justify-center bg-white/80 shadow-inner">
                {feature.icon}
              </div>
              <h3 className={`text-xl font-bold ${feature.textColor} mb-2`}>{feature.title}</h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
              
              {/* Animated action button */}
              <div className="mt-5">
                <button 
                  className={`
                    flex items-center text-sm font-medium ${feature.textColor} 
                    hover:underline focus:outline-none transition-transform 
                    hover:translate-x-1
                  `}
                >
                  Learn more
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Animated indicators */}
      <div className="flex justify-center items-center mt-8 space-x-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`
              h-2 rounded-full transition-all duration-500 ease-out
              ${isVisible ? 'w-8 bg-blue-500' : 'w-2 bg-gray-300'}
            `}
            style={{ transitionDelay: `${(i * 100) + 500}ms` }}
          />
        ))}
      </div>
    </div>
  );
};

export default ResponsiveAnimation; 