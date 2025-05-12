import React from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as Logo } from '../logo.svg';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-4 sm:mb-0">
            <Logo className="h-10 w-10 sm:h-12 sm:w-12 animate-spin-slow" />
            <h1 className="ml-3 text-xl sm:text-2xl font-bold text-gray-800">Classentry</h1>
          </div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto max-w-xs mx-auto sm:mx-0 hidden sm:block"
          >
            <Link 
              to="/login" 
              className="relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-bold text-white rounded-md shadow-md group bg-blue-600 hover:bg-blue-700 transition-all duration-300 w-full text-center"
            >
              <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
              <span className="relative">Login</span>
            </Link>
          </motion.div>
        </div>
      </header>
      
      {/* Hero Section */}
      <motion.div 
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24 text-center"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
          Welcome to the Future of 
          <span className="block sm:inline bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mt-2 sm:mt-0 sm:ml-2">
            Education Management
          </span>
        </h2>
        <p className="mt-6 text-base sm:text-xl text-gray-600 max-w-3xl mx-auto px-4 sm:px-0">
          A complete solution for managing your coaching institute with attendance tracking, 
          fee management, and automated notifications.
        </p>
      </motion.div>
      
      {/* Feature Cards */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
      >
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
      </motion.div>
      
      {/* Testimonial Section */}
      <div className="bg-white py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">Trusted by Leading Institutes</h3>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600">
              Our system helps educational institutions improve efficiency and parent satisfaction
            </p>
          </motion.div>
          
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
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl sm:text-3xl font-bold">Ready to transform your institute?</h3>
            <p className="mt-3 sm:mt-4 text-base sm:text-xl">
              Get started today and see the difference our system can make.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 sm:mt-8 max-w-xs mx-auto"
          >
            <Link 
              to="/login" 
              className="inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-medium text-blue-600 bg-white rounded-md shadow-lg hover:bg-gray-50 transition-all duration-200 w-full sm:w-auto justify-center"
            >
              Get Started
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-bold mb-4">About Us</h4>
              <p className="text-gray-300 text-sm sm:text-base">
                We provide cutting-edge management solutions for educational institutions to streamline operations.
              </p>
            </div>
            <div className="hidden sm:block">
              <h4 className="text-lg font-bold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
                <li>Attendance Management</li>
                <li>Fee Collection</li>
                <li>WhatsApp Notifications</li>
                <li>Reports & Analytics</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
                <li>info@classentry.com</li>
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
          <div className="mt-6 pt-6 sm:mt-8 sm:pt-8 border-t border-gray-700 text-center text-gray-300 text-sm sm:text-base">
            <p>© 2023 Classentry Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  hoverColor: string;
  shadowColor: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, hoverColor, shadowColor }) => {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: {
            duration: 0.6,
          }
        }
      }}
      whileHover={{ y: -10 }}
      className={`bg-white p-6 sm:p-8 rounded-xl shadow-xl ${shadowColor} ${hoverColor} transition-all duration-300 h-full`}
    >
      <div className="flex justify-center mb-4 sm:mb-6">
        {icon}
      </div>
      <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-center">{title}</h3>
      <p className="text-gray-600 text-sm sm:text-base text-center">{description}</p>
    </motion.div>
  );
};

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  className?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, author, role, className = "" }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className={`bg-gray-50 p-5 sm:p-6 rounded-lg shadow ${className}`}
    >
      <svg className="h-8 w-8 sm:h-10 sm:w-10 text-blue-500 mb-3 sm:mb-4" fill="currentColor" viewBox="0 0 32 32">
        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
      </svg>
      <p className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base">{quote}</p>
      <div>
        <p className="font-semibold text-gray-900">{author}</p>
        <p className="text-gray-600 text-xs sm:text-sm">{role}</p>
      </div>
    </motion.div>
  );
};

interface SocialIconProps {
  name: 'facebook' | 'twitter' | 'instagram' | 'linkedin';
}

const SocialIcon: React.FC<SocialIconProps> = ({ name }) => {
  let path;
  
  switch (name) {
    case 'facebook':
      path = (
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
      );
      break;
    case 'twitter':
      path = (
        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
      );
      break;
    case 'instagram':
      path = (
        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M7.5 4h9a3.5 3.5 0 013.5 3.5v9a3.5 3.5 0 01-3.5 3.5h-9A3.5 3.5 0 014 16.5v-9A3.5 3.5 0 017.5 4zm9 0h.01" />
      );
      break;
    case 'linkedin':
      path = (
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z" />
      );
      break;
  }
  
  return (
    <motion.a 
      href="#" 
      whileHover={{ scale: 1.2 }}
      className="text-gray-300 hover:text-white transition-colors"
    >
      <svg
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        viewBox="0 0 24 24"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5 sm:h-6 sm:w-6"
        xmlns="http://www.w3.org/2000/svg"
      >
        {path}
      </svg>
    </motion.a>
  );
};

export default Home; 