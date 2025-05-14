import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as Logo } from '../assets/images/logo.svg';
import { motion, AnimatePresence } from 'framer-motion';
import FeatureCard from './FeatureCard';
import TestimonialCard from './TestimonialCard';
import SocialIcon from './SocialIcon';
import ResponsiveAnimation from './ResponsiveAnimation';
import AnimatedStats from './AnimatedStats';

const Home: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-blue-100 opacity-30 blur-3xl"></div>
        <div className="absolute bottom-10 right-0 w-80 h-80 rounded-full bg-indigo-100 opacity-40 blur-3xl"></div>
        <div className="absolute top-1/4 right-1/4 w-40 h-40 rounded-full bg-purple-100 opacity-20 blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-56 h-56 rounded-full bg-green-100 opacity-30 blur-3xl"></div>
        
        {/* Animated dots pattern */}
        <div className="hidden lg:block absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-2 h-2 rounded-full bg-blue-500"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `pulse 15s infinite ${i * 0.5}s`,
                opacity: 0.3 + (Math.random() * 0.5)
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        {/* Top Bar - Contact Info */}
        <div className="bg-gray-900 text-white hidden md:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex justify-between text-sm">
              <div>
                <span className="inline-flex items-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  info@class-entry.com
                </span>
                <span className="inline-flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +91 98765 43210
                </span>
              </div>
              <div className="flex space-x-3">
                <a href="#" className="hover:text-blue-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link to="/" className="flex items-center">
                <Logo className="h-9 w-9 sm:h-10 sm:w-10" />
                <div className="ml-2.5 flex flex-col">
                  <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-gray-900 leading-none">
                    <span className="text-blue-600">Class</span><span className="text-orange-500">entry</span>
                  </h1>
                  <span className="text-xs text-gray-500 tracking-wide">Education Management</span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-8 items-center">
                <Link to="/" className="text-gray-800 hover:text-blue-600 font-medium transition-colors">Home</Link>
                <Link to="/about" className="text-gray-800 hover:text-blue-600 font-medium transition-colors">About</Link>
                <Link to="/services" className="text-gray-800 hover:text-blue-600 font-medium transition-colors">Services</Link>
                <Link to="/pricing" className="text-gray-800 hover:text-blue-600 font-medium transition-colors">Pricing</Link>
                <Link to="/contact" className="text-gray-800 hover:text-blue-600 font-medium transition-colors">Contact</Link>
                <Link to="/batches" className="text-gray-800 hover:text-blue-600 font-medium transition-colors">Batch Demo</Link>
                <div>
                  <Link to="/login" className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-md text-white font-medium shadow-sm hover:shadow-md transition-all">
                    Login
                  </Link>
                </div>
              </nav>

              {/* Mobile Menu Button */}
              <div className="flex md:hidden">
                <div>
                  <Link 
                    to="/login" 
                    className="mr-3 inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm"
                  >
                    Login
                  </Link>
                </div>
                <button 
                  onClick={toggleMenu}
                  className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                  aria-expanded={isMenuOpen}
                  aria-controls="mobile-menu"
                >
                  {isMenuOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile menu, show/hide based on menu state */}
        {isMenuOpen && (
          <div 
            id="mobile-menu"
            className="md:hidden bg-white border-t border-gray-100 shadow-lg"
          >
            <div className="px-4 pt-2 pb-3 space-y-1 sm:px-6">
              <Link 
                to="/" 
                className="block py-2 px-3 text-base font-medium text-gray-800 hover:bg-gray-50 hover:text-blue-600 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="block py-2 px-3 text-base font-medium text-gray-800 hover:bg-gray-50 hover:text-blue-600 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/services" 
                className="block py-2 px-3 text-base font-medium text-gray-800 hover:bg-gray-50 hover:text-blue-600 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link 
                to="/pricing" 
                className="block py-2 px-3 text-base font-medium text-gray-800 hover:bg-gray-50 hover:text-blue-600 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link 
                to="/contact" 
                className="block py-2 px-3 text-base font-medium text-gray-800 hover:bg-gray-50 hover:text-blue-600 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link 
                to="/batches" 
                className="block py-2 px-3 text-base font-medium text-gray-800 hover:bg-gray-50 hover:text-blue-600 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Batch Demo
              </Link>
            </div>
            
            {/* Mobile contact info */}
            <div className="pt-2 pb-4 border-t border-gray-100 px-4 sm:px-6">
              <div className="flex flex-col space-y-2 text-sm text-gray-600">
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  info@class-entry.com
                </span>
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +91 98765 43210
                </span>
              </div>
              
              <div className="mt-4 flex space-x-4">
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
      
      {/* Hero Section */}
      <div className="relative bg-transparent border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="md:flex items-center">
            <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Welcome to the Future of 
                <span className="block sm:inline text-gradient bg-gradient-to-r from-blue-600 to-indigo-600 mt-2 sm:mt-0 sm:ml-2">
                  Education Management
                </span>
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl">
                A complete solution for managing your coaching institute with attendance tracking, 
                fee management, and automated notifications.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
                <Link 
                  to="/login" 
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-md shadow-md hover:shadow-lg transform transition-all duration-200 hover:scale-105"
                >
                  Get Started
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
                <a 
                  href="#features" 
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-blue-600 bg-white border border-blue-200 rounded-md shadow-sm hover:bg-blue-50 transform transition-all duration-200"
                >
                  Learn More
                </a>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="absolute -top-4 -right-4 w-full h-full rounded-lg bg-gradient-to-br from-blue-500/10 to-indigo-500/10"></div>
              <img 
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                alt="Education Management" 
                className="relative rounded-lg shadow-xl transform hover:scale-[1.01] transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="py-12 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-200 rounded-full"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-200 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-100 rounded-full blur-3xl"></div>
        </div>
        
        <AnimatedStats />
      </div>
      
      {/* Feature Cards */}
      <div id="features" className="bg-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">Key Features</h3>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
              Discover how our system can transform your educational institution
            </p>
          </div>
          
          <div className="mb-16">
            <ResponsiveAnimation />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <FeatureCard 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 sm:h-14 sm:w-14 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              }
              title="Attendance Tracking" 
              description="Track student attendance with ease and send automatic WhatsApp notifications to parents for absentees."
              hoverColor="hover:bg-blue-50"
              shadowColor="shadow-blue-100"
            />
            <FeatureCard 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 sm:h-14 sm:w-14 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              title="Fee Management" 
              description="Manage student fees, generate receipts, and send payment reminders automatically."
              hoverColor="hover:bg-green-50"
              shadowColor="shadow-green-100"
            />
            <FeatureCard 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 sm:h-14 sm:w-14 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              }
              title="WhatsApp Integration" 
              description="Send automated WhatsApp notifications for attendance, fees, and important announcements."
              hoverColor="hover:bg-purple-50"
              shadowColor="shadow-purple-100"
            />
          </div>
        </div>
      </div>
      
      {/* Testimonial Section */}
      <div className="bg-gray-50 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">What Our Clients Say</h3>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600">
              Testimonials from educational institutions using our system
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <TestimonialCard 
              quote="This system has saved our staff countless hours on attendance and fee tracking."
              author="Priya Sharma"
              role="Director, Excel Academy"
            />
            <TestimonialCard 
              quote="Parents love the instant WhatsApp notifications when their child is absent."
              author="Rajesh Kumar"
              role="Principal, Success Coaching"
              className="hidden md:block"
            />
            <TestimonialCard 
              quote="The fee management system has significantly improved our collections."
              author="Ananya Patel"
              role="Admin, Bright Future Institute"
              className="hidden lg:block"
            />
          </div>
          
          {/* Mobile-only testimonial carousel indicators */}
          <div className="flex justify-center mt-6 space-x-2 md:hidden">
            <span className="h-2 w-2 rounded-full bg-blue-600"></span>
            <span className="h-2 w-2 rounded-full bg-gray-300"></span>
            <span className="h-2 w-2 rounded-full bg-gray-300"></span>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold">Ready to transform your institute?</h3>
            <p className="mt-3 sm:mt-4 text-base sm:text-xl">
              Get started today and see the difference our system can make.
            </p>
          </div>
          
          <div className="mt-6 sm:mt-8 max-w-xs mx-auto">
            <Link 
              to="/login" 
              className="inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-medium text-blue-600 bg-white rounded-md shadow-lg hover:bg-gray-50 transition-all duration-200 w-full sm:w-auto justify-center"
            >
              Get Started
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Logo className="h-8 w-8" />
                <div className="ml-2">
                  <h1 className="text-lg font-semibold">
                    <span className="text-blue-400">Class</span><span className="text-orange-400">entry</span>
                  </h1>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                We provide cutting-edge management solutions for educational institutions to streamline operations.
              </p>
            </div>
            <div className="hidden sm:block">
              <h4 className="text-lg font-bold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Attendance Management</li>
                <li>Fee Collection</li>
                <li>WhatsApp Notifications</li>
                <li>Reports & Analytics</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>info@class-entry.com</li>
                <li>+91 98765 43210</li>
                <li className="hidden sm:block">123 Education Lane, Bangalore</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <SocialIcon name="facebook" />
                <SocialIcon name="twitter" />
                <SocialIcon name="instagram" />
                <SocialIcon name="linkedin" />
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 sm:mt-8 sm:pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            <p>© 2023 <span className="text-blue-400">Class</span><span className="text-orange-400">entry</span> Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// StatCard component for the stats section
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow relative overflow-hidden group">
      {/* Decorative gradient background that appears on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="flex items-center relative">
        <div className="mr-4 bg-gray-50 rounded-full p-3 group-hover:bg-white transition-colors duration-300">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-gradient group-hover:from-blue-700 group-hover:to-indigo-700 transition-all duration-300">{value}</h3>
        </div>
      </div>
    </div>
  );
};

export default Home; 