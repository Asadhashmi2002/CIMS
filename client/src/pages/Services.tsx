import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ReactComponent as Logo } from '../assets/images/logo.svg';

const Services: React.FC = () => {
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

  // Animation for staggered services
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const serviceVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6
      }
    }
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
              <Link to="/services" className="text-blue-600 font-medium transition-colors border-b-2 border-blue-600 pb-1">Services</Link>
              <Link to="/pricing" className="text-gray-800 hover:text-blue-600 font-medium transition-colors">Pricing</Link>
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
            Our Services
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="max-w-3xl mx-auto text-xl text-gray-600"
          >
            Comprehensive solutions designed to streamline operations for coaching institutes and educational organizations.
          </motion.p>
        </div>

        {/* Services List */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <ServiceCard 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            }
            title="Attendance Management"
            description="Track student attendance with ease using our digital register. Quickly mark present, absent, or late status and generate detailed reports."
            features={[
              "Digital attendance register",
              "Automatic absence alerts to parents",
              "Monthly attendance reports",
              "Historical attendance tracking"
            ]}
            color="blue"
            serviceVariants={serviceVariants}
          />
          
          <ServiceCard 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            title="Fee Management"
            description="Efficiently manage student fees, generate receipts, and send automated payment reminders to ensure timely payments."
            features={[
              "Customizable fee structures",
              "Automated payment reminders",
              "Digital receipt generation",
              "Payment history tracking"
            ]}
            color="green"
            serviceVariants={serviceVariants}
          />
          
          <ServiceCard 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            }
            title="WhatsApp Integration"
            description="Connect with parents instantly through automated WhatsApp messages for absence notifications, fee reminders, and announcements."
            features={[
              "Instant absence notifications",
              "Fee payment reminders",
              "Event and holiday announcements",
              "Homework and assignment updates"
            ]}
            color="purple"
            serviceVariants={serviceVariants}
          />
          
          <ServiceCard 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
            title="Performance Analytics"
            description="Gain insights into student performance with detailed analytics and track progress over time to identify areas for improvement."
            features={[
              "Individual student progress tracking",
              "Class performance comparison",
              "Visual performance graphs",
              "Improvement recommendations"
            ]}
            color="orange"
            serviceVariants={serviceVariants}
          />
          
          <ServiceCard 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            title="Class Scheduling"
            description="Create and manage class schedules efficiently. Handle teacher assignments, room allocations, and class timings all in one place."
            features={[
              "Drag-and-drop schedule creation",
              "Teacher availability tracking",
              "Classroom utilization optimization",
              "Schedule conflict detection"
            ]}
            color="red"
            serviceVariants={serviceVariants}
          />
          
          <ServiceCard 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
            title="Staff Management"
            description="Manage your teaching and non-teaching staff details, track attendance, manage salaries, and evaluate performance."
            features={[
              "Staff attendance tracking",
              "Salary management",
              "Performance evaluation",
              "Document management"
            ]}
            color="indigo"
            serviceVariants={serviceVariants}
          />
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-xl p-8 sm:p-10 text-center text-white"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to transform your institute?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-3xl mx-auto">
            Get started with Classentry today and experience the difference our comprehensive services can make for your educational institution.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Link to="/contact" className="bg-white text-blue-600 px-8 py-3 rounded-md font-medium shadow-lg hover:shadow-xl transition-all duration-300">
              Schedule a Demo
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

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo';
  serviceVariants: any;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description, features, color, serviceVariants }) => {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 hover:bg-blue-100 border-blue-100';
      case 'green':
        return 'bg-green-50 hover:bg-green-100 border-green-100';
      case 'purple':
        return 'bg-purple-50 hover:bg-purple-100 border-purple-100';
      case 'orange':
        return 'bg-orange-50 hover:bg-orange-100 border-orange-100';
      case 'red':
        return 'bg-red-50 hover:bg-red-100 border-red-100';
      case 'indigo':
        return 'bg-indigo-50 hover:bg-indigo-100 border-indigo-100';
      default:
        return 'bg-gray-50 hover:bg-gray-100 border-gray-100';
    }
  };

  return (
    <motion.div 
      variants={serviceVariants}
      whileHover={{ y: -10 }}
      className={`rounded-xl shadow-lg border p-6 transition-all duration-300 ${getColorClasses(color)}`}
    >
      <div className="flex justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{title}</h3>
      <p className="text-gray-600 mb-5 text-center">{description}</p>
      
      <div className="border-t border-gray-200 pt-5">
        <h4 className="font-medium text-gray-900 mb-3">Key Features:</h4>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default Services; 