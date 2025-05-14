import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ReactComponent as Logo } from '../assets/images/logo.svg';

const Pricing: React.FC = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  // Page transition variants
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 50
    },
    in: {
      opacity: 1,
      y: 0
    },
    exit: {
      opacity: 0,
      y: -50
    }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5
  };

  // Plan price calculation
  const getPrice = (basePrice: number) => {
    return billingPeriod === 'yearly' ? Math.floor(basePrice * 0.8) : basePrice;
  };

  // Handle toggle change
  const toggleBillingPeriod = () => {
    setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header - Same as Home component */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
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
              <Link to="/pricing" className="text-blue-600 font-medium transition-colors border-b-2 border-blue-600 pb-1">Pricing</Link>
              <Link to="/contact" className="text-gray-800 hover:text-blue-600 font-medium transition-colors">Contact</Link>
              <motion.div 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link to="/login" className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2 rounded-md text-white font-medium shadow-sm hover:shadow-md transition-all">
                  Login
                </Link>
              </motion.div>
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link 
                  to="/login" 
                  className="mr-3 inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-md shadow-sm"
                >
                  Login
                </Link>
              </motion.div>
              <button className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with Animation */}
      <motion.div
        initial="initial"
        animate="in"
        exit="exit"
        variants={pageVariants}
        transition={pageTransition}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6"
          >
            Simple, Transparent Pricing
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="max-w-3xl mx-auto text-xl text-gray-600"
          >
            Choose the perfect plan for your institute's size and needs.
          </motion.p>
        </div>

        {/* Billing Toggle */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex justify-center mb-16"
        >
          <div className="bg-white rounded-lg shadow-md p-2 inline-flex items-center">
            <span className={`px-4 py-2 rounded-md font-medium ${billingPeriod === 'monthly' ? 'bg-blue-100 text-blue-800' : 'text-gray-600'}`}>
              Monthly
            </span>
            <button 
              onClick={toggleBillingPeriod}
              className="mx-3 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-gray-200"
              role="switch"
              aria-checked={billingPeriod === 'yearly'}
            >
              <span 
                aria-hidden="true" 
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${billingPeriod === 'yearly' ? 'translate-x-5' : 'translate-x-0'}`}
              />
            </button>
            <span className={`px-4 py-2 rounded-md font-medium ${billingPeriod === 'yearly' ? 'bg-blue-100 text-blue-800' : 'text-gray-600'}`}>
              Yearly
            </span>
            {billingPeriod === 'yearly' && (
              <span className="ml-3 bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                Save 20%
              </span>
            )}
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            whileHover={{ y: -10 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Basic</h3>
              <div className="flex items-baseline">
                <span className="text-4xl font-extrabold text-gray-900">₹{getPrice(999)}</span>
                <span className="ml-1 text-xl font-semibold text-gray-500">/{billingPeriod === 'monthly' ? 'mo' : 'yr'}</span>
              </div>
              <p className="mt-4 text-gray-600">Perfect for small institutes with up to 100 students.</p>

              <ul className="mt-6 space-y-4">
                <PricingFeature text="Up to 100 students" />
                <PricingFeature text="Attendance Management" />
                <PricingFeature text="Basic Fee Management" />
                <PricingFeature text="WhatsApp Notifications" />
                <PricingFeature text="Email Support" />
                <PricingFeature text="1 Admin User" isDisabled />
                <PricingFeature text="Advanced Analytics" isDisabled />
              </ul>
            </div>
            <div className="bg-gray-50 p-6">
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-white text-blue-600 border border-blue-600 px-5 py-3 rounded-md font-medium hover:bg-blue-50 transition-colors"
              >
                Get Started
              </motion.button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            whileHover={{ y: -10 }}
            className="bg-white rounded-xl shadow-xl transform md:scale-105 md:-translate-y-2 overflow-hidden border-2 border-blue-500"
          >
            <div className="bg-blue-500 py-1.5 text-center">
              <span className="text-xs font-semibold uppercase tracking-wide text-white">Most Popular</span>
            </div>
            <div className="p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Professional</h3>
              <div className="flex items-baseline">
                <span className="text-4xl font-extrabold text-gray-900">₹{getPrice(1999)}</span>
                <span className="ml-1 text-xl font-semibold text-gray-500">/{billingPeriod === 'monthly' ? 'mo' : 'yr'}</span>
              </div>
              <p className="mt-4 text-gray-600">For growing institutes with up to 300 students.</p>

              <ul className="mt-6 space-y-4">
                <PricingFeature text="Up to 300 students" />
                <PricingFeature text="Attendance Management" />
                <PricingFeature text="Advanced Fee Management" />
                <PricingFeature text="WhatsApp Notifications" />
                <PricingFeature text="Priority Email Support" />
                <PricingFeature text="5 Admin Users" />
                <PricingFeature text="Basic Analytics" />
              </ul>
            </div>
            <div className="bg-gray-50 p-6">
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-blue-600 text-white px-5 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                Get Started
              </motion.button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            whileHover={{ y: -10 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Enterprise</h3>
              <div className="flex items-baseline">
                <span className="text-4xl font-extrabold text-gray-900">₹{getPrice(3999)}</span>
                <span className="ml-1 text-xl font-semibold text-gray-500">/{billingPeriod === 'monthly' ? 'mo' : 'yr'}</span>
              </div>
              <p className="mt-4 text-gray-600">For large institutes with unlimited students.</p>

              <ul className="mt-6 space-y-4">
                <PricingFeature text="Unlimited students" />
                <PricingFeature text="Advanced Attendance Management" />
                <PricingFeature text="Advanced Fee Management" />
                <PricingFeature text="WhatsApp & SMS Notifications" />
                <PricingFeature text="24/7 Priority Support" />
                <PricingFeature text="Unlimited Admin Users" />
                <PricingFeature text="Advanced Analytics & Reporting" />
              </ul>
            </div>
            <div className="bg-gray-50 p-6">
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-white text-blue-600 border border-blue-600 px-5 py-3 rounded-md font-medium hover:bg-blue-50 transition-colors"
              >
                Get Started
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* FAQs Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="mt-24"
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I change my plan later?</h3>
              <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes to your plan will take effect immediately.</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Is there a free trial?</h3>
              <p className="text-gray-600">Yes, we offer a 14-day free trial for all plans. No credit card required to start your trial.</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Do you offer any discounts?</h3>
              <p className="text-gray-600">We offer a 20% discount for annual billing and special rates for educational NGOs and government schools.</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What payment methods do you accept?</h3>
              <p className="text-gray-600">We accept all major credit cards, debit cards, net banking, UPI, and annual invoicing for Enterprise plans.</p>
            </div>
          </div>
        </motion.div>

        {/* Custom Plan CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-xl p-8 sm:p-10 text-center text-white"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Need a custom plan?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-3xl mx-auto">
            Contact our sales team to create a plan that perfectly fits your institute's specific requirements.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Link to="/contact" className="bg-white text-blue-600 px-8 py-3 rounded-md font-medium shadow-lg hover:shadow-xl transition-all duration-300">
              Contact Sales
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 sm:py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mt-6 pt-6 sm:mt-8 sm:pt-8 border-t border-gray-700 text-center text-gray-300 text-sm sm:text-base">
            <p>© 2023 <span className="text-blue-300">Class</span><span className="text-orange-300">entry</span> Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface PricingFeatureProps {
  text: string;
  isDisabled?: boolean;
}

const PricingFeature: React.FC<PricingFeatureProps> = ({ text, isDisabled = false }) => {
  return (
    <li className="flex items-start">
      <div className="flex-shrink-0">
        {isDisabled ? (
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )}
      </div>
      <p className={`ml-3 text-sm ${isDisabled ? 'text-gray-400 line-through' : 'text-gray-600'}`}>
        {text}
      </p>
    </li>
  );
};

export default Pricing; 