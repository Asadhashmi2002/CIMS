import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as Logo } from '../assets/images/logo.svg';
import { batchAPI } from '../services/api';

interface User {
  id: string;
  role: string;
  email: string;
  name?: string;
}

interface Batch {
  id: string;
  name: string;
  subject: string;
  schedule: string;
  teacherIds: string[];
  teacherNames: string[];
  studentCount: number;
  status: 'active' | 'inactive';
  created: string;
  progress?: number;
  nextClass?: string;
}

interface Student {
  id: string;
  name: string;
  parentPhone: string;
  present: boolean;
  email?: string;
  performance?: 'excellent' | 'good' | 'average' | 'poor';
  attendance?: number;
}

interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: 'draft' | 'assigned' | 'submitted' | 'graded';
  submissions: number;
  batch: string;
}

interface Announcement {
  id: string;
  title: string;
  date: string;
  type: 'info' | 'alert' | 'success';
  content: string;
}

const TeacherDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'batches' | 'attendance' | 'assignments' | 'students' | 'announcements'>('dashboard');
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const [batches, setBatches] = useState<Batch[]>([]);
  const [batchesLoading, setBatchesLoading] = useState(false);
  const [batchError, setBatchError] = useState('');
  
  const [studentsByBatch, setStudentsByBatch] = useState<{[key: string]: Student[]}>({});
  
  const assignments: Assignment[] = [
    { id: 'a1', title: 'Kinematics Problem Set', subject: 'Physics', dueDate: '2023-05-22', status: 'assigned', submissions: 12, batch: 'b1' },
    { id: 'a2', title: 'Chemical Equations Worksheet', subject: 'Chemistry', dueDate: '2023-05-25', status: 'assigned', submissions: 8, batch: 'b2' },
    { id: 'a3', title: 'Calculus Integration', subject: 'Mathematics', dueDate: '2023-05-20', status: 'submitted', submissions: 28, batch: 'b3' },
    { id: 'a4', title: 'Dynamics Test Prep', subject: 'Physics', dueDate: '2023-05-30', status: 'draft', submissions: 0, batch: 'b1' },
    { id: 'a5', title: 'Periodic Table Quiz', subject: 'Chemistry', dueDate: '2023-05-18', status: 'graded', submissions: 28, batch: 'b2' },
  ];
  
  const announcements: Announcement[] = [
    { id: 'n1', title: 'Physics Test Postponed', date: '2023-05-15', type: 'info', content: 'The Physics test scheduled for May 18th has been postponed to May 20th due to a scheduling conflict.' },
    { id: 'n2', title: 'Holiday Notice', date: '2023-05-12', type: 'alert', content: 'The institute will remain closed on May 25th for maintenance. All classes scheduled for this day will be held online.' },
    { id: 'n3', title: 'New Study Material Available', date: '2023-05-10', type: 'success', content: 'New study materials for Chemistry have been uploaded to the student portal. Please inform your students to download and review them.' },
  ];
  
  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role === 'teacher') {
        // Add name for the demo if not present
        if (!parsedUser.name) {
          parsedUser.name = "Dr. Rajesh Sharma";
        }
        setUser(parsedUser);
        
        // Fetch batches assigned to this teacher
        loadTeacherBatches(parsedUser.id);
      } else {
        // Redirect to login if not a teacher
        window.location.href = '/login';
      }
    } else {
      // Redirect to login if not authenticated
      window.location.href = '/login';
    }
  }, []);

  useEffect(() => {
    if (batches.length > 0) {
      const studentData: {[key: string]: Student[]} = {};
      
      // Generate demo student data for each batch
      batches.forEach(batch => {
        // Generate between 8-15 students per batch
        const numStudents = Math.floor(Math.random() * 8) + 8;
        const students: Student[] = [];
        
        for (let i = 1; i <= numStudents; i++) {
          const firstName = ['Ajay', 'Rahul', 'Priya', 'Neha', 'Sandeep', 'Amit', 'Pooja', 'Anjali', 'Vishal', 'Rohit'][Math.floor(Math.random() * 10)];
          const lastName = ['Sharma', 'Patel', 'Singh', 'Kumar', 'Gupta', 'Mehta', 'Verma', 'Joshi', 'Agarwal', 'Shah'][Math.floor(Math.random() * 10)];
          
          students.push({
            id: `s${batch.id}${i}`,
            name: `${firstName} ${lastName}`,
            parentPhone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
            present: true, // Default to present
            performance: ['excellent', 'good', 'average', 'poor'][Math.floor(Math.random() * 4)] as 'excellent' | 'good' | 'average' | 'poor',
            attendance: Math.floor(Math.random() * 21) + 80 // 80-100% attendance
          });
        }
        
        studentData[batch.id] = students;
      });
      
      setStudentsByBatch(studentData);
    }
  }, [batches]);

  const loadTeacherBatches = async (teacherId: string) => {
    if (!teacherId) return;
    
    setBatchesLoading(true);
    setBatchError('');
    
    try {
      // Add a small delay to ensure the loading state is visible
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const response = await batchAPI.getTeacherBatches(teacherId);
      
      // If no batches were found, set empty array and clear loading state
      if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
        setBatches([]);
        setBatchesLoading(false);
        return;
      }
      
      // Add some UI-specific properties to each batch
      const processedBatches = response.data.map((batch: Batch) => {
        // Generate a progress value between 60-100%
        const progress = Math.floor(Math.random() * 40) + 60; 
        
        // Generate next class day
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today = new Date().getDay();
        const nextDay = (today + 1) % 7; // Next day
        
        // Extract time from schedule or use default
        const timeMatch = batch.schedule && batch.schedule.match(/\d{1,2}:\d{2}/);
        const timeStr = timeMatch ? timeMatch[0] : '9:00 AM';
        
        return {
          ...batch,
          progress,
          nextClass: `${days[nextDay]}, ${timeStr}`,
          status: batch.status || 'active', // Ensure status exists
          studentCount: batch.studentCount || 0 // Ensure studentCount exists
        };
      });
      
      setBatches(processedBatches);
      setBatchesLoading(false);
    } catch (error: any) {
      console.error('Failed to load teacher batches:', error);
      
      // Provide a specific error message based on the error
      if (error.response) {
        // The request was made and the server responded with a status code
        if (error.response.status === 404) {
          setBatchError('No batches found. Please check with your administrator.');
        } else if (error.response.status === 403) {
          setBatchError('You do not have permission to view these batches.');
        } else if (error.response.status >= 500) {
          setBatchError('Server error. Please try again later or contact support.');
        } else {
          setBatchError(`Error: ${error.response.data?.message || 'Failed to load batches.'}`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        setBatchError('Could not connect to the server. Please check your internet connection.');
      } else {
        // Something happened in setting up the request
        setBatchError(error.message || 'An unexpected error occurred. Please try again.');
      }
      
      // Set an empty array for batches to avoid undefined errors
      setBatches([]);
      setBatchesLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleAttendance = (batchId: string, studentId: string) => {
    setStudentsByBatch(prev => {
      const updatedStudents = [...prev[batchId]];
      const studentIndex = updatedStudents.findIndex(s => s.id === studentId);
      
      if (studentIndex !== -1) {
        updatedStudents[studentIndex] = {
          ...updatedStudents[studentIndex],
          present: !updatedStudents[studentIndex].present
        };
      }
      
      return {
        ...prev,
        [batchId]: updatedStudents
      };
    });
  };

  const submitAttendance = (batchId: string) => {
    const absentStudents = studentsByBatch[batchId].filter(s => !s.present);
    
    if (absentStudents.length > 0) {
      alert(`Attendance submitted for batch ${batches.find(b => b.id === batchId)?.name}. 
      ${absentStudents.length} students are absent. 
      In a real app, WhatsApp notifications would be sent to parents of: 
      ${absentStudents.map(s => s.name).join(', ')}`);
    } else {
      alert(`Attendance submitted for batch ${batches.find(b => b.id === batchId)?.name}. All students are present!`);
    }
  };

  const handleBatchSelect = (batchId: string) => {
    // Ensure we have student data for this batch
    if (!studentsByBatch[batchId]) {
      // Initialize student data if it doesn't exist
      const numStudents = Math.floor(Math.random() * 8) + 8;
      const students: Student[] = [];
      
      for (let i = 1; i <= numStudents; i++) {
        const firstName = ['Ajay', 'Rahul', 'Priya', 'Neha', 'Sandeep', 'Amit', 'Pooja', 'Anjali', 'Vishal', 'Rohit'][Math.floor(Math.random() * 10)];
        const lastName = ['Sharma', 'Patel', 'Singh', 'Kumar', 'Gupta', 'Mehta', 'Verma', 'Joshi', 'Agarwal', 'Shah'][Math.floor(Math.random() * 10)];
        
        students.push({
          id: `s${batchId}${i}`,
          name: `${firstName} ${lastName}`,
          parentPhone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          present: true,
          performance: ['excellent', 'good', 'average', 'poor'][Math.floor(Math.random() * 4)] as 'excellent' | 'good' | 'average' | 'poor',
          attendance: Math.floor(Math.random() * 21) + 80
        });
      }
      
      setStudentsByBatch(prev => ({
        ...prev,
        [batchId]: students
      }));
    }
    
    setSelectedBatch(batchId);
    setActiveTab('attendance');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const iconClass = "h-5 w-5 mr-3";

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className={`bg-gray-900 text-white transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} flex flex-col`}>
        {/* Logo & Toggle */}
        <div className="p-4 flex items-center justify-between border-b border-gray-800">
          {sidebarOpen && (
            <div className="flex items-center">
              <Logo className="h-8 w-8" />
              <div className="ml-2">
                <h1 className="text-lg font-semibold">
                  <span className="text-blue-400">Class</span><span className="text-orange-400">entry</span>
                </h1>
              </div>
            </div>
          )}
          <button 
            onClick={toggleSidebar} 
            className="text-gray-300 hover:text-white p-1"
          >
            {sidebarOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          <ul className="space-y-1">
            <SidebarItem 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>} 
              title="Dashboard" 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')} 
              collapsed={!sidebarOpen}
            />
            <SidebarItem 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>} 
              title="My Batches" 
              active={activeTab === 'batches'} 
              onClick={() => {
                setActiveTab('batches');
                setSelectedBatch(null);
              }} 
              collapsed={!sidebarOpen}
            />
            <SidebarItem 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>} 
              title="Attendance" 
              active={activeTab === 'attendance'} 
              onClick={() => setActiveTab('attendance')} 
              collapsed={!sidebarOpen}
            />
            <SidebarItem 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m-6-8h6M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
              </svg>} 
              title="Assignments" 
              active={activeTab === 'assignments'} 
              onClick={() => setActiveTab('assignments')} 
              collapsed={!sidebarOpen}
            />
            <SidebarItem 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>} 
              title="Students" 
              active={activeTab === 'students'} 
              onClick={() => setActiveTab('students')} 
              collapsed={!sidebarOpen}
            />
            <SidebarItem 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>} 
              title="Announcements" 
              active={activeTab === 'announcements'} 
              onClick={() => setActiveTab('announcements')} 
              collapsed={!sidebarOpen}
            />
          </ul>
        </nav>

        {/* User Profile */}
        <div className="border-t border-gray-800 p-4">
          {sidebarOpen ? (
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                {user.name ? user.name.substring(0, 1).toUpperCase() : user.email.substring(0, 1).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium">{user.name || user.email}</p>
                <p className="text-xs text-gray-400 capitalize">{user.role}</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                {user.name ? user.name.substring(0, 1).toUpperCase() : user.email.substring(0, 1).toUpperCase()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-800">Teacher Dashboard</h1>
              <div className="hidden md:flex items-center text-sm text-gray-600">
                <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Home
              </Link>
              <button className="relative p-1 text-gray-500 hover:text-gray-700 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-800 font-medium flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {activeTab === 'dashboard' && (
            <>
              {/* Welcome Banner */}
              <div className="bg-white rounded-lg shadow-sm mb-6 p-6 border-l-4 border-blue-500">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Welcome back, {user.name || 'Teacher'}!</h2>
                    <p className="text-gray-600 mt-1">Here's an overview of your classes and upcoming schedule.</p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                      Check Schedule
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {/* Total Students */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <div className="mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Students</p>
                      <h3 className="text-2xl font-bold text-gray-900">{Object.values(studentsByBatch).reduce((total, students) => total + students.length, 0)}</h3>
                      <p className="text-xs text-gray-500 mt-1">Across {batches.length} batches</p>
                    </div>
                  </div>
                </div>

                {/* Today's Classes */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <div className="mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Today's Classes</p>
                      <h3 className="text-2xl font-bold text-gray-900">2</h3>
                      <p className="text-xs text-gray-500 mt-1">Next: Chemistry at 1:00 PM</p>
                    </div>
                  </div>
                </div>

                {/* Assignments */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <div className="mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending Assignments</p>
                      <h3 className="text-2xl font-bold text-gray-900">{assignments.filter(a => a.status === 'assigned').length}</h3>
                      <p className="text-xs text-gray-500 mt-1">{assignments.filter(a => a.status === 'submitted').length} to grade</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Batches and Announcements */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Your Batches</h3>
                    <button 
                      className="text-sm text-blue-600 hover:text-blue-800"
                      onClick={() => setActiveTab('batches')}
                    >
                      View All
                    </button>
                  </div>
                  
                  {batchesLoading ? (
                    <div className="flex justify-center items-center h-40">
                      <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  ) : batchError ? (
                    <div className="text-center p-4 text-red-600">{batchError}</div>
                  ) : batches.length === 0 ? (
                    <div className="text-center p-8 bg-gray-50 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <p className="text-gray-600">No batches assigned to you yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {batches.slice(0, 3).map(batch => (
                        <div key={batch.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div>
                            <h4 className="text-md font-semibold text-gray-800">{batch.name} - {batch.subject}</h4>
                            <p className="text-sm text-gray-600">{batch.schedule} • {batch.studentCount} students</p>
                          </div>
                          <div className="mt-2 sm:mt-0">
                            <div className="flex items-center space-x-2">
                              <div className="text-sm font-medium text-gray-700">Progress: {batch.progress}%</div>
                              <div className="w-32 bg-gray-200 rounded-full h-2.5">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${batch.progress}%` }}></div>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Next Class: {batch.nextClass}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Announcements</h3>
                  <div className="space-y-3">
                    {announcements.map(announcement => (
                      <div 
                        key={announcement.id} 
                        className={`p-3 rounded-md ${
                          announcement.type === 'info' ? 'bg-blue-50 text-blue-800' : 
                          announcement.type === 'alert' ? 'bg-red-50 text-red-800' : 
                          'bg-green-50 text-green-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">{announcement.title}</div>
                          <div className="text-xs">{announcement.date}</div>
                        </div>
                        <div className="text-xs mt-1">{announcement.content.substring(0, 80)}...</div>
                      </div>
                    ))}
                    <button 
                      className="w-full mt-2 p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium rounded-md"
                      onClick={() => setActiveTab('announcements')}
                    >
                      View All Announcements
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'batches' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">My Batches</h2>
                <button 
                  onClick={() => loadTeacherBatches(user.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh Batches
                </button>
              </div>
              
              {batchError && (
                <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm">
                  <div className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {batchError}
                  </div>
                </div>
              )}
              
              {batchesLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="flex items-center bg-gray-50 px-6 py-4 rounded-lg shadow-sm">
                    <svg className="animate-spin h-5 w-5 mr-3 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                    <span className="text-sm text-gray-600 font-medium">Loading batches...</span>
                  </div>
                </div>
              ) : batches.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Batches Assigned</h3>
                  <p className="text-gray-500">You don't have any batches assigned to you at the moment. Please contact the admin for batch assignments.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {batches.map(batch => (
                    <div 
                      key={batch.id}
                      className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleBatchSelect(batch.id)}
                    >
                      <div className="p-4 border-b border-gray-200 bg-blue-50">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mr-3 flex-shrink-0">
                            {batch.name.substring(0, 1).toUpperCase()}
                          </div>
                          <div className="overflow-hidden">
                            <h4 className="font-medium text-gray-900 truncate">{batch.name}</h4>
                            <p className="text-sm text-gray-500 truncate">{batch.subject}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="text-sm space-y-2">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-gray-700">{batch.schedule}</span>
                          </div>
                          
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <span className="text-gray-700">{batch.studentCount} Students</span>
                          </div>
                          
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            <span className="text-gray-700">Progress: {batch.progress}%</span>
                          </div>
                          
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-gray-700">Next: {batch.nextClass}</span>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${batch.progress}%` }}></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            batch.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {batch.status}
                          </span>
                          
                          <div className="flex space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBatchSelect(batch.id);
                              }}
                              className="inline-flex items-center p-1 border border-transparent rounded text-blue-600 hover:bg-blue-50 focus:outline-none"
                              title="Take Attendance"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                              </svg>
                            </button>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                alert(`View students for ${batch.name} (Not implemented in demo)`);
                              }}
                              className="inline-flex items-center p-1 border border-transparent rounded text-green-600 hover:bg-green-50 focus:outline-none"
                              title="View Students"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Instructions and explanation */}
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mt-6">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Important:</strong> As a teacher, you can access your assigned batches here.
                </p>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                  <li>Click on a batch to take attendance for that class</li>
                  <li>Use the attendance system to mark students present or absent</li>
                  <li>Submit attendance to notify parents of absent students</li>
                  <li>View batch details including schedule and progress</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'attendance' && (
            <div>
              {selectedBatch && studentsByBatch[selectedBatch] ? (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">
                      Attendance: {batches.find(b => b.id === selectedBatch)?.name}
                    </h2>
                    <div className="text-sm text-gray-600">
                      {new Date().toLocaleDateString()} | {batches.find(b => b.id === selectedBatch)?.schedule}
                    </div>
                  </div>
                  
                  <div className="bg-white shadow overflow-hidden rounded-lg mb-6">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium text-gray-700">
                          Total Students: {studentsByBatch[selectedBatch].length}
                        </div>
                        <div className="text-sm font-medium text-gray-700">
                          Present: {studentsByBatch[selectedBatch].filter(s => s.present).length} / 
                          Absent: {studentsByBatch[selectedBatch].filter(s => !s.present).length}
                        </div>
                      </div>
                    </div>
                    
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Parent Contact
                          </th>
                          <th scope="col" className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Performance
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Attendance
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {studentsByBatch[selectedBatch].map((student) => (
                          <tr key={student.id} className={!student.present ? 'bg-red-50' : ''}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {student.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {student.parentPhone}
                            </td>
                            <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                ${student.performance === 'excellent' ? 'bg-green-100 text-green-800' : 
                                  student.performance === 'good' ? 'bg-blue-100 text-blue-800' : 
                                  student.performance === 'average' ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-red-100 text-red-800'}`}
                              >
                                {student.performance}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleAttendance(selectedBatch, student.id);
                                }}
                                className={`py-1 px-3 rounded-full text-white ${
                                  student.present ? 
                                    'bg-green-500 hover:bg-green-600' : 
                                    'bg-red-500 hover:bg-red-600'
                                } transition-colors`}
                              >
                                {student.present ? 'Present' : 'Absent'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                    <div className="text-sm text-gray-600 bg-yellow-50 p-3 rounded border border-yellow-200 flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span>
                        Absent students' parents will receive WhatsApp notifications when attendance is submitted.
                      </span>
                    </div>
                    
                    <button
                      onClick={() => submitAttendance(selectedBatch)}
                      className="inline-flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Submit Attendance
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Batch to Take Attendance</h3>
                  <p className="text-gray-500 mb-6">Choose one of your batches to mark student attendance</p>
                  <button 
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    onClick={() => setActiveTab('batches')}
                  >
                    View My Batches
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Placeholder for other tabs */}
          {(activeTab === 'assignments' || activeTab === 'students' || activeTab === 'announcements') && (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Module</h3>
              <p className="text-gray-500">This feature is coming soon. Please check back later!</p>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-sm text-gray-600">
                © 2023 Classentry Management System. All rights reserved.
              </div>
              <div className="mt-2 md:mt-0 text-sm text-gray-500">
                Version 1.0.0
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

// Sidebar Item Component
interface SidebarItemProps {
  icon: React.ReactNode;
  title: string;
  active: boolean;
  onClick: () => void;
  collapsed: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, title, active, onClick, collapsed }) => {
  return (
    <li>
      <button
        onClick={onClick}
        className={`flex items-center w-full px-4 py-3 transition-colors ${
          active 
            ? 'bg-blue-600 text-white' 
            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
        }`}
      >
        {icon}
        {!collapsed && <span>{title}</span>}
      </button>
    </li>
  );
};

export default TeacherDashboard; 