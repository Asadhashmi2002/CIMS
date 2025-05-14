import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as Logo } from '../assets/images/logo.svg';
import '../styles/login-animations.css';

declare global {
  interface Window {
    AniJS: any;
  }
}

const LoginSelector: React.FC = () => {
  const [animationLoaded, setAnimationLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    // Dynamically load AniJS from CDN
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/anijs/0.9.3/anijs-min.js';
    script.async = true;
    script.onload = () => {
      // Initialize AniJS
      if (window.AniJS) {
        window.AniJS.run();
        setAnimationLoaded(true);
      }
    };
    document.body.appendChild(script);

    // Add smooth scrolling for all elements
    document.documentElement.style.scrollBehavior = 'smooth';

    // Cleanup
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 overflow-x-hidden">
      {/* Header - Fixed on mobile for better navigation */}
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center">
          <Link to="/" className="flex items-center">
            <Logo className="h-8 w-8 sm:h-10 sm:w-10" />
            <h1 className="ml-2 sm:ml-3 text-lg sm:text-xl font-semibold tracking-tight text-gray-900">
              <span className="text-blue-600">Class</span><span className="text-orange-500">entry</span>
            </h1>
          </Link>
        </div>
      </header>
      
      <div
        ref={containerRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-8 sm:pb-12 text-center"
        data-anijs={animationLoaded ? "if: load, on: window, do: fadeIn animated" : ""}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Choose Login Type</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Select your role to access the appropriate dashboard</p>
        
        <div 
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto"
          data-anijs={animationLoaded ? "if: load, on: window, do: fadeIn animated" : ""}
        >
          <div 
            className="login-card bg-white rounded-lg sm:rounded-xl shadow-lg sm:shadow-xl overflow-hidden"
            data-anijs={animationLoaded ? "if: load, on: window, do: fadeInLeft animated" : ""}
          >
            <div className="login-header bg-gradient-to-r from-blue-600 to-indigo-600 p-4 sm:p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-full mb-3 sm:mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Admin</h2>
              <p className="text-blue-100 mt-1 text-sm sm:text-base">
                Manage everything related to the institute
              </p>
            </div>
            
            <div className="p-4 sm:p-6">
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Manage teachers and students
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Handle fee collection
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Generate reports
                </li>
              </ul>
              
              <div className="login-button-container">
                <Link 
                  to="/admin/login" 
                  className="login-button relative inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 overflow-hidden font-bold text-white text-sm sm:text-base rounded-md shadow-md group bg-blue-600 hover:bg-blue-700 transition-all duration-300 w-full text-center"
                >
                  <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                  <span className="relative">Login as Admin</span>
                </Link>
              </div>
            </div>
          </div>
          
          <div 
            className="login-card bg-white rounded-lg sm:rounded-xl shadow-lg sm:shadow-xl overflow-hidden"
            data-anijs={animationLoaded ? "if: load, on: window, do: fadeInRight animated" : ""}
          >
            <div className="login-header bg-gradient-to-r from-green-600 to-emerald-600 p-4 sm:p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-full mb-3 sm:mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Teacher</h2>
              <p className="text-green-100 mt-1 text-sm sm:text-base">
                Manage your classes and student attendance
              </p>
            </div>
            
            <div className="p-4 sm:p-6">
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Take attendance for your batches
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Send automated absence notifications
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  View student information
                </li>
              </ul>
              
              <div className="login-button-container">
                <Link 
                  to="/teacher/login" 
                  className="login-button relative inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 overflow-hidden font-bold text-white text-sm sm:text-base rounded-md shadow-md group bg-green-600 hover:bg-green-700 transition-all duration-300 w-full text-center"
                >
                  <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                  <span className="relative">Login as Teacher</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div 
        className="text-center pb-6 sm:pb-8 mt-2 sm:mt-4"
        data-anijs={animationLoaded ? "if: load, on: window, do: fadeIn animated" : ""}
      >
        <Link 
          to="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors back-button text-sm sm:text-base"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default LoginSelector; 