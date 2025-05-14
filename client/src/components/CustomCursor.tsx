import React, { useState, useEffect } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  
  useEffect(() => {
    // Check if it's a mobile device - don't show custom cursor on mobile
    const checkDevice = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
      setIsMobile(isMobileDevice);
      
      // If it's not a mobile device, hide the default cursor
      if (!isMobileDevice) {
        document.documentElement.style.cursor = 'none';
      }
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    // Only add other event listeners if not on mobile
    if (!isMobile) {
      const updateCursorPosition = (e: MouseEvent) => {
        setPosition({ x: e.clientX, y: e.clientY });
        
        // Only show cursor after first mouse movement
        if (!isVisible) {
          setIsVisible(true);
        }
      };
      
      const updateCursorType = () => {
        // Check if the cursor is over a clickable element
        const element = document.elementFromPoint(position.x, position.y);
        
        // Elements that should trigger the pointer effect
        const clickableElements = ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'];
        const isClickable = !!element && (
          clickableElements.includes(element.tagName) ||
          window.getComputedStyle(element).cursor === 'pointer' ||
          (element as HTMLElement).onclick != null ||
          element?.closest('button, a, [role="button"]') != null
        );
        
        setIsPointer(isClickable);
      };
      
      const handleMouseDown = () => {
        setIsClicked(true);
      };
      
      const handleMouseUp = () => {
        setIsClicked(false);
      };
      
      const handleMouseLeave = () => {
        setIsVisible(false);
      };
      
      // Add event listeners
      document.addEventListener('mousemove', updateCursorPosition);
      document.addEventListener('mousemove', updateCursorType);
      document.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('mouseleave', handleMouseLeave);
      
      // Cleanup
      return () => {
        document.removeEventListener('mousemove', updateCursorPosition);
        document.removeEventListener('mousemove', updateCursorType);
        document.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('mouseleave', handleMouseLeave);
        
        // Restore default cursor
        document.documentElement.style.cursor = 'auto';
        window.removeEventListener('resize', checkDevice);
      };
    } else {
      return () => {
        window.removeEventListener('resize', checkDevice);
      };
    }
  }, [isVisible, position.x, position.y, isMobile]);

  // Don't render anything on mobile
  if (isMobile) return null;
  
  return (
    <>
      {/* Outer cursor (follows with delay) */}
      <div 
        className={`
          fixed pointer-events-none z-50
          rounded-full mix-blend-difference
          transition-opacity duration-300
          ${isVisible ? 'opacity-100' : 'opacity-0'}
        `}
        style={{
          width: isPointer ? '60px' : '40px',
          height: isPointer ? '60px' : '40px',
          backgroundColor: isClicked ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.3)',
          transform: `translate(${position.x - (isPointer ? 30 : 20)}px, ${position.y - (isPointer ? 30 : 20)}px)`,
          transition: 'width 0.3s, height 0.3s, background-color 0.3s, transform 0.2s cubic-bezier(0.23, 1, 0.32, 1)'
        }}
      />
      
      {/* Inner cursor (exact position) */}
      <div 
        className={`
          fixed pointer-events-none z-50
          bg-white rounded-full mix-blend-difference
          transition-opacity duration-300
          ${isVisible ? 'opacity-100' : 'opacity-0'}
        `}
        style={{
          width: isClicked ? '12px' : '8px',
          height: isClicked ? '12px' : '8px',
          transform: `translate(${position.x - (isClicked ? 6 : 4)}px, ${position.y - (isClicked ? 6 : 4)}px)`,
          transition: 'width 0.2s, height 0.2s, transform 0.1s cubic-bezier(0.23, 1, 0.32, 1)'
        }}
      />
      
      {/* Trail effect */}
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="fixed w-1 h-1 bg-blue-500 rounded-full pointer-events-none z-40 opacity-70"
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
            transition: `transform 0.${index + 1}s cubic-bezier(0.23, 1, 0.32, 1)`,
            opacity: 0.7 - (index * 0.2)
          }}
        />
      ))}
    </>
  );
};

export default CustomCursor; 