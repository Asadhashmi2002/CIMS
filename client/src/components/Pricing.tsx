import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as Logo } from '../assets/images/logo.svg';

const Pricing: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header (Same as other pages) */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
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
                <Link to="/pricing" className="text-blue-600 font-medium transition-colors">Pricing</Link>
                <Link to="/contact" className="text-gray-800 hover:text-blue-600 font-medium transition-colors">Contact</Link>
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
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Page Title */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">Transparent Pricing</h1>
            <p className="mt-4 text-lg text-blue-100 max-w-3xl mx-auto">
              Choose the plan that works best for your coaching institute
            </p>
          </div>
        </div>
      </div>
      
      {/* Pricing Toggle */}
      <div className="pt-12 pb-6 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  billingCycle === 'yearly'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Yearly <span className="text-green-500 font-bold">Save 20%</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Pricing Cards */}
      <div className="pb-12 sm:pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900">Starter</h3>
                <p className="text-gray-600 mt-1">For small coaching centers</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-gray-900">
                    {billingCycle === 'monthly' ? '₹2,999' : '₹28,790'}
                  </span>
                  <span className="ml-1 text-xl font-semibold text-gray-500">
                    /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  For up to 100 students
                </p>
                
                <ul className="mt-6 space-y-4">
                  <PricingFeature text="Attendance Management" included />
                  <PricingFeature text="Basic Fee Management" included />
                  <PricingFeature text="SMS Notifications" included />
                  <PricingFeature text="WhatsApp Integration" included={false} />
                  <PricingFeature text="Multi-User Access (3 users)" included />
                  <PricingFeature text="Basic Reports" included />
                  <PricingFeature text="Email Support" included />
                  <PricingFeature text="Exam Management" included={false} />
                  <PricingFeature text="Student Portal" included={false} />
                </ul>
                
                <div className="mt-8">
                  <Link
                    to="/contact"
                    className="w-full inline-flex justify-center py-3 px-4 border border-blue-600 rounded-md shadow-sm text-sm font-medium text-blue-600 hover:text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Pro Plan */}
            <div className="bg-white rounded-lg shadow-md border-2 border-blue-600 overflow-hidden relative">
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 transform translate-x-6 rotate-45">
                Popular
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900">Professional</h3>
                <p className="text-gray-600 mt-1">For growing institutes</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-gray-900">
                    {billingCycle === 'monthly' ? '₹4,999' : '₹47,990'}
                  </span>
                  <span className="ml-1 text-xl font-semibold text-gray-500">
                    /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  For up to 300 students
                </p>
                
                <ul className="mt-6 space-y-4">
                  <PricingFeature text="Attendance Management" included />
                  <PricingFeature text="Advanced Fee Management" included />
                  <PricingFeature text="SMS Notifications" included />
                  <PricingFeature text="WhatsApp Integration" included />
                  <PricingFeature text="Multi-User Access (10 users)" included />
                  <PricingFeature text="Advanced Reports & Analytics" included />
                  <PricingFeature text="Priority Email & Phone Support" included />
                  <PricingFeature text="Exam Management" included />
                  <PricingFeature text="Student Portal" included={false} />
                </ul>
                
                <div className="mt-8">
                  <Link
                    to="/contact"
                    className="w-full inline-flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Enterprise Plan */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900">Enterprise</h3>
                <p className="text-gray-600 mt-1">For large educational networks</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-gray-900">
                    {billingCycle === 'monthly' ? '₹9,999' : '₹95,990'}
                  </span>
                  <span className="ml-1 text-xl font-semibold text-gray-500">
                    /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  For unlimited students
                </p>
                
                <ul className="mt-6 space-y-4">
                  <PricingFeature text="Attendance Management" included />
                  <PricingFeature text="Advanced Fee Management" included />
                  <PricingFeature text="SMS Notifications" included />
                  <PricingFeature text="WhatsApp Integration" included />
                  <PricingFeature text="Unlimited Users" included />
                  <PricingFeature text="Custom Reports & Analytics" included />
                  <PricingFeature text="24/7 Priority Support" included />
                  <PricingFeature text="Exam Management" included />
                  <PricingFeature text="Student Portal" included />
                </ul>
                
                <div className="mt-8">
                  <Link
                    to="/contact"
                    className="w-full inline-flex justify-center py-3 px-4 border border-blue-600 rounded-md shadow-sm text-sm font-medium text-blue-600 hover:text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Contact Sales
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Feature Comparison */}
      <div className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Compare Plans</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              A detailed comparison of what's included in each plan
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Feature
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Starter
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Professional
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <TableRow feature="Student Limit" starter="100" pro="300" enterprise="Unlimited" />
                <TableRow feature="User Accounts" starter="3" pro="10" enterprise="Unlimited" />
                <TableRow feature="Attendance Tracking" starter="Basic" pro="Advanced" enterprise="Advanced" />
                <TableRow feature="Fee Management" starter="Basic" pro="Advanced" enterprise="Advanced" />
                <TableRow feature="SMS Notifications" starter="100/month" pro="500/month" enterprise="Unlimited" />
                <TableRow feature="WhatsApp Integration" starter="❌" pro="✅" enterprise="✅" />
                <TableRow feature="Email Notifications" starter="✅" pro="✅" enterprise="✅" />
                <TableRow feature="Reports & Analytics" starter="Basic" pro="Advanced" enterprise="Custom" />
                <TableRow feature="Exam Management" starter="❌" pro="✅" enterprise="✅" />
                <TableRow feature="Student Portal" starter="❌" pro="❌" enterprise="✅" />
                <TableRow feature="Custom Branding" starter="❌" pro="❌" enterprise="✅" />
                <TableRow feature="API Access" starter="❌" pro="✅" enterprise="✅" />
                <TableRow feature="Data Export" starter="CSV" pro="CSV, Excel" enterprise="CSV, Excel, API" />
                <TableRow feature="Support" starter="Email" pro="Email & Phone" enterprise="24/7 Priority" />
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* FAQs */}
      <div className="py-12 sm:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
            <p className="mt-4 text-lg text-gray-600">
              Got questions? We have answers.
            </p>
          </div>
          
          <div className="space-y-6">
            <FAQ 
              question="Can I change plans later?" 
              answer="Yes, you can upgrade or downgrade your plan at any time. When upgrading, the new pricing will be applied immediately. When downgrading, the new pricing will take effect at the end of your current billing cycle."
            />
            <FAQ 
              question="Is there a free trial available?" 
              answer="Yes, we offer a 14-day free trial for all our plans. No credit card required to start your trial, and you can cancel at any time."
            />
            <FAQ 
              question="How does the billing work?" 
              answer="We offer both monthly and annual billing options. With annual billing, you get a 20% discount compared to monthly billing. We accept credit cards, debit cards, and bank transfers."
            />
            <FAQ 
              question="What happens to my data if I cancel?" 
              answer="Your data remains in our system for 30 days after cancellation, giving you time to export any necessary information. After 30 days, all data is permanently deleted from our servers."
            />
            <FAQ 
              question="Do you offer customization for specific requirements?" 
              answer="Yes, our Enterprise plan includes customization options. Additionally, we offer professional services for custom development to meet specific requirements not covered in our standard plans."
            />
            <FAQ 
              question="Is training included with the subscription?" 
              answer="Basic onboarding is included with all plans. The Professional and Enterprise plans include comprehensive training sessions for your staff. Additional training sessions can be purchased separately if needed."
            />
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold">Still have questions?</h3>
            <p className="mt-3 sm:mt-4 text-base sm:text-xl">
              Our team is ready to help you find the perfect plan for your institute.
            </p>
          </div>
          
          <div className="mt-6 sm:mt-8 max-w-xs mx-auto">
            <Link 
              to="/contact" 
              className="inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-medium text-blue-600 bg-white rounded-md shadow-lg hover:bg-gray-50 transition-all duration-200 w-full sm:w-auto justify-center"
            >
              Contact Us
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Footer (Same as other pages) */}
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
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                  </svg>
                </a>
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

// Pricing Feature Component
interface PricingFeatureProps {
  text: string;
  included: boolean;
}

const PricingFeature: React.FC<PricingFeatureProps> = ({ text, included }) => {
  return (
    <li className="flex items-start">
      <div className="flex-shrink-0">
        {included ? (
          <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        )}
      </div>
      <p className={`ml-3 text-sm ${included ? 'text-gray-700' : 'text-gray-500'}`}>
        {text}
      </p>
    </li>
  );
};

// Table Row Component
interface TableRowProps {
  feature: string;
  starter: string;
  pro: string;
  enterprise: string;
}

const TableRow: React.FC<TableRowProps> = ({ feature, starter, pro, enterprise }) => {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {feature}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
        {starter}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
        {pro}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
        {enterprise}
      </td>
    </tr>
  );
};

// FAQ Component
interface FAQProps {
  question: string;
  answer: string;
}

const FAQ: React.FC<FAQProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border border-gray-200 rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-4 focus:outline-none"
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">{question}</h3>
          <svg
            className={`h-5 w-5 text-gray-500 transform ${isOpen ? 'rotate-180' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </button>
      {isOpen && (
        <div className="p-4 pt-0 border-t border-gray-200">
          <p className="text-gray-600">{answer}</p>
        </div>
      )}
    </div>
  );
};

export default Pricing; 