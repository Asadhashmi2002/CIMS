import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ReactComponent as Logo } from '../assets/images/logo.svg';

const About: React.FC = () => {
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
              <Link to="/about" className="text-blue-600 font-medium transition-colors border-b-2 border-blue-600 pb-1">About</Link>
              <Link to="/services" className="text-gray-800 hover:text-blue-600 font-medium transition-colors">Services</Link>
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
            About <span className="text-blue-600">Class</span><span className="text-orange-500">entry</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="max-w-3xl mx-auto text-xl text-gray-600"
          >
            We're revolutionizing education management with technology that empowers institutes and connects parents.
          </motion.p>
        </div>

        {/* Our Story Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="bg-white rounded-xl shadow-lg p-8 sm:p-10 mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-600 mb-4">
                Founded in 2020, Classentry was born from a simple observation: coaching institutes spent too much time on administrative tasks and not enough on teaching.
              </p>
              <p className="text-gray-600 mb-4">
                Our founder, having managed a coaching center for over a decade, experienced firsthand the challenges of tracking attendance, managing fees, and communicating with parents.
              </p>
              <p className="text-gray-600">
                We set out to create a solution that would automate these processes, provide instant communication, and give institute owners the tools they need to focus on what matters most - education.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <div className="bg-blue-50 p-10 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Our Mission Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="bg-white rounded-xl shadow-lg p-8 sm:p-10 mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-center justify-center order-2 md:order-1">
              <div className="bg-orange-50 p-10 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h.5A2.5 2.5 0 0020 5.5v-1.565M12 20.5V12m0 8.5l4-4m-4 4l-4-4" />
                </svg>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <p className="text-gray-600 mb-4">
                Our mission is to transform how educational institutions operate by providing intuitive, affordable technology that streamlines administrative tasks.
              </p>
              <p className="text-gray-600 mb-4">
                We believe that when administrative burdens are reduced, educators can focus on delivering quality education, and students receive better learning experiences.
              </p>
              <p className="text-gray-600">
                By connecting parents, teachers, and administrators through a single platform, we create a collaborative environment that benefits the entire educational ecosystem.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="bg-white rounded-xl shadow-lg p-8 sm:p-10"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            <TeamMember 
              name="Rajiv Sharma" 
              role="Founder & CEO" 
              bio="Former coaching institute owner with 15+ years in education management." 
            />
            <TeamMember 
              name="Priya Verma" 
              role="Head of Product" 
              bio="Education tech specialist with expertise in UX design and product development." 
            />
            <TeamMember 
              name="Amit Patel" 
              role="CTO" 
              bio="Software architect with a passion for creating intuitive educational tools." 
            />
          </div>
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

interface TeamMemberProps {
  name: string;
  role: string;
  bio: string;
}

const TeamMember: React.FC<TeamMemberProps> = ({ name, role, bio }) => {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-gray-50 rounded-lg p-6 text-center"
    >
      <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center">
        <span className="text-2xl font-bold text-white">{name.split(' ').map(n => n[0]).join('')}</span>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-1">{name}</h3>
      <p className="text-blue-600 font-medium mb-3">{role}</p>
      <p className="text-gray-600 text-sm">{bio}</p>
    </motion.div>
  );
};

export default About; 