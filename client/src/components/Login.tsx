import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as Logo } from '../assets/images/logo.svg';
import '../styles/login-animations.css';

declare global {
  interface Window {
    AniJS: any;
  }
}

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [animationLoaded, setAnimationLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Check for mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Add scroll reveal
  useEffect(() => {
    const handleScroll = () => {
      const scrollElements = document.querySelectorAll('.reveal-on-scroll');
      
      scrollElements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementPosition < windowHeight - 100) {
          element.classList.add('revealed');
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    // Trigger once on load
    setTimeout(handleScroll, 300);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
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

    // Add smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';

    // Cleanup
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // In a real app, this would be an API call to your backend
      console.log('Login attempt with:', { email, password });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, let's hardcode admin credentials
      if (email === 'admin@example.com' && password === 'admin123') {
        localStorage.setItem('user', JSON.stringify({ role: 'admin', email }));
        window.location.href = '/dashboard';
        return;
      }
      
      // Check for teacher credentials in localStorage
      const storedTeachers = localStorage.getItem('teachers');
      if (storedTeachers) {
        const teachers = JSON.parse(storedTeachers);
        const teacher = teachers.find((t: any) => 
          t.email === email && t.password === password && t.status === 'active'
        );
        
        if (teacher) {
          localStorage.setItem('user', JSON.stringify({ 
            role: 'teacher', 
            email: teacher.email,
            name: teacher.name
          }));
          window.location.href = '/teacher-dashboard';
          return;
        }
      }
      
      setError('Invalid email or password');
    } catch (err) {
      setError('Failed to login. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 overflow-x-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center">
          <Link to="/" className="flex items-center">
            <Logo className="h-8 w-8 sm:h-10 sm:w-10" />
            <div className="ml-2 sm:ml-2.5 flex flex-col">
              <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-gray-900 leading-none">
                <span className="text-blue-600">Class</span><span className="text-orange-500">entry</span>
              </h1>
              <span className="text-xs text-gray-500 tracking-wide">Education Management</span>
            </div>
          </Link>
        </div>
      </header>
      
      <div className="flex items-center justify-center pt-6 sm:pt-10 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-md w-full">
          <div 
            className="login-card bg-white rounded-lg sm:rounded-lg shadow-lg overflow-hidden border border-gray-200 reveal-on-scroll"
            data-anijs={animationLoaded ? "if: load, on: window, do: pulse animated, after: $removeClass animated" : ""}
          >
            <div 
              className="login-header bg-blue-600 p-5 sm:p-6 text-center"
              data-anijs={animationLoaded ? "if: load, on: window, do: fadeInDown animated" : ""}
            >
              <h2 className="text-xl sm:text-2xl font-bold text-white">Login</h2>
              <p className="mt-1 text-sm sm:text-base text-blue-100">Access your dashboard</p>
            </div>
            
            <div 
              className="login-body p-5 sm:p-8"
              data-anijs={animationLoaded ? "if: load, on: window, do: fadeIn animated, after: removeAnim" : ""}
            >
              {error && (
                <div 
                  className="mb-5 sm:mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shake-animation"
                >
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} ref={formRef}>
                <div 
                  className="mb-5 sm:mb-6 form-group"
                  data-anijs={animationLoaded ? "if: load, on: window, do: fadeInLeft animated, after: removeAnim" : ""}
                >
                  <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="input-field shadow appearance-none border rounded-lg w-full py-2.5 sm:py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div 
                  className="mb-5 sm:mb-6 form-group"
                  data-anijs={animationLoaded ? "if: load, on: window, do: fadeInRight animated, after: removeAnim" : ""}
                >
                  <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className="input-field shadow appearance-none border rounded-lg w-full py-2.5 sm:py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 cursor-pointer"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                          <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                
                <div
                  data-anijs={animationLoaded ? "if: load, on: window, do: fadeInUp animated, after: removeAnim" : ""}
                >
                  <button
                    type="submit"
                    className="login-button w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm sm:text-base py-2.5 sm:py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-sm transition-all"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Logging in...
                      </div>
                    ) : 'Login'}
                  </button>
                </div>
                
                <div 
                  className="mt-5 sm:mt-6 reveal-on-scroll"
                  data-anijs={animationLoaded ? "if: load, on: window, do: fadeIn animated, after: removeAnim" : ""}
                >
                  <div className="text-center text-xs sm:text-sm text-gray-600 bg-gray-50 p-2.5 sm:p-3 rounded-md border border-gray-200">
                    <p className="font-medium mb-1 sm:mb-2">Demo Logins:</p>
                    <p className="mb-1">
                      <span className="font-bold">Admin:</span> admin@example.com / admin123
                    </p>
                    <p>
                      <span className="font-bold">Teacher:</span> rajesh@example.com / teacher123
                    </p>
                  </div>
                </div>
              </form>
              
              <div 
                className="mt-6 sm:mt-8 text-center"
                data-anijs={animationLoaded ? "if: load, on: window, do: fadeIn animated, after: removeAnim" : ""}
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
          </div>
          
          <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-600">
            <p>© 2023 <span className="text-blue-600">Class</span><span className="text-orange-500">entry</span> Management System. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 