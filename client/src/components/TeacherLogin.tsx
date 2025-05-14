import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as Logo } from '../assets/images/logo.svg';
import '../styles/login-animations.css';
import { authAPI } from '../services/api';

declare global {
  interface Window {
    AniJS: any;
  }
}

const TeacherLogin: React.FC = () => {
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

  // Handle scroll animations
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
      // Use the teacherLogin API method instead of hardcoded credentials
      const response = await authAPI.teacherLogin(email, password);
      
      if (response.data && response.data.teacher) {
        localStorage.setItem('user', JSON.stringify({ 
          role: 'teacher', 
          email: response.data.teacher.email,
          name: response.data.teacher.name || email.split('@')[0],
          id: response.data.teacher.id,
          token: response.data.token
        }));
        window.location.href = '/teacher/dashboard';
        return;
      } else {
        setError('Invalid response from server');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.response && err.response.status === 401) {
        setError('Invalid email or password');
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Failed to login. Please try again.');
      }
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
      
      <div className="flex items-center justify-center pt-6 sm:pt-10 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-md w-full">
          <div 
            className="login-card bg-white rounded-lg sm:rounded-xl shadow-lg sm:shadow-xl overflow-hidden reveal-on-scroll"
            data-anijs={animationLoaded ? "if: load, on: window, do: pulse animated, after: $removeClass animated" : ""}
          >
            <div 
              className="login-header bg-gradient-to-r from-green-600 to-emerald-600 p-5 sm:p-6 text-center"
              data-anijs={animationLoaded ? "if: load, on: window, do: fadeInDown animated" : ""}
            >
              <h2 className="text-xl sm:text-2xl font-bold text-white">Teacher Login</h2>
              <p className="mt-1 text-sm sm:text-base text-green-100">Access your teaching portal</p>
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
                    className="input-field shadow appearance-none border rounded-lg w-full py-2.5 sm:py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="teacher@example.com"
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
                      className="input-field shadow appearance-none border rounded-lg w-full py-2.5 sm:py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-10"
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
                    className="login-button relative inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 overflow-hidden font-bold text-white text-sm sm:text-base rounded-md shadow-md group bg-green-600 hover:bg-green-700 transition-all duration-300 w-full"
                    disabled={isLoading}
                  >
                    <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                    <span className="relative">
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Logging in...
                        </div>
                      ) : 'Login'}
                    </span>
                  </button>
                </div>

                <div className="mt-4 text-center">
                  <Link 
                    to="/forgot-password" 
                    className="text-green-600 hover:text-green-700 text-sm"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </form>
              
              <div 
                className="mt-6 sm:mt-8 text-center"
                data-anijs={animationLoaded ? "if: load, on: window, do: fadeIn animated, after: removeAnim" : ""}
              >
                <Link 
                  to="/login" 
                  className="inline-flex items-center text-green-600 hover:text-green-800 transition-colors back-button text-sm sm:text-base"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Back to Login Selection
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherLogin;