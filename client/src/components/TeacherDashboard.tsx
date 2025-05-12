import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface User {
  role: string;
  email: string;
}

interface Batch {
  id: string;
  name: string;
  subject: string;
  time: string;
  students: number;
}

interface Student {
  id: string;
  name: string;
  parentPhone: string;
  present: boolean;
}

const TeacherDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('batches');
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  
  // Mock data
  const batches: Batch[] = [
    { id: 'b1', name: 'Morning Batch', subject: 'Physics', time: '8:00 AM - 10:00 AM', students: 32 },
    { id: 'b2', name: 'Afternoon Batch', subject: 'Chemistry', time: '1:00 PM - 3:00 PM', students: 28 },
    { id: 'b3', name: 'Evening Batch', subject: 'Mathematics', time: '5:00 PM - 7:00 PM', students: 30 }
  ];
  
  const [studentsByBatch, setStudentsByBatch] = useState<{[key: string]: Student[]}>({
    b1: [
      { id: 's1', name: 'Aisha Smith', parentPhone: '+1234567890', present: false },
      { id: 's2', name: 'Noah Johnson', parentPhone: '+1234567891', present: false },
      { id: 's3', name: 'Emma Williams', parentPhone: '+1234567892', present: false },
    ],
    b2: [
      { id: 's4', name: 'Liam Brown', parentPhone: '+1234567893', present: false },
      { id: 's5', name: 'Olivia Davis', parentPhone: '+1234567894', present: false },
      { id: 's6', name: 'Lucas Wilson', parentPhone: '+1234567895', present: false },
    ],
    b3: [
      { id: 's7', name: 'Sophia Martinez', parentPhone: '+1234567896', present: false },
      { id: 's8', name: 'Ethan Anderson', parentPhone: '+1234567897', present: false },
      { id: 's9', name: 'Isabella Taylor', parentPhone: '+1234567898', present: false },
    ]
  });
  
  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role === 'teacher') {
        setUser(parsedUser);
      } else {
        // Redirect to login if not a teacher
        window.location.href = '/login';
      }
    } else {
      // Redirect to login if not authenticated
      window.location.href = '/login';
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
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

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-800">Teacher Dashboard</h1>
            <Link 
              to="/" 
              className="ml-6 text-green-600 hover:text-green-800 inline-flex items-center text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Home
            </Link>
          </div>
          <div className="flex items-center">
            <span className="mr-4 text-gray-600">{user.email}</span>
            <button 
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button 
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'batches' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              onClick={() => {
                setActiveTab('batches');
                setSelectedBatch(null);
              }}
            >
              My Batches
            </button>
            <button 
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'attendance' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              onClick={() => setActiveTab('attendance')}
              disabled={!selectedBatch}
            >
              Take Attendance
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'batches' && (
          <div>
            <h2 className="text-xl font-semibold mb-6">My Batches</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {batches.map(batch => (
                <div 
                  key={batch.id}
                  className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  onClick={() => {
                    setSelectedBatch(batch.id);
                    setActiveTab('attendance');
                  }}
                >
                  <div className="bg-green-500 px-4 py-2 text-white text-lg font-semibold">
                    {batch.name}
                  </div>
                  <div className="p-6">
                    <div className="text-gray-600 mb-2">Subject: {batch.subject}</div>
                    <div className="text-gray-600 mb-2">Time: {batch.time}</div>
                    <div className="text-gray-600">Students: {batch.students}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'attendance' && selectedBatch && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                Attendance: {batches.find(b => b.id === selectedBatch)?.name}
              </h2>
              <div className="text-sm text-gray-600">
                {new Date().toLocaleDateString()} | {batches.find(b => b.id === selectedBatch)?.time}
              </div>
            </div>
            
            <div className="bg-white shadow overflow-hidden rounded-lg mb-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Parent Contact
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Attendance
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {studentsByBatch[selectedBatch].map((student) => (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.parentPhone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => toggleAttendance(selectedBatch, student.id)}
                          className={`py-1 px-3 rounded-full text-white ${student.present ? 'bg-green-500' : 'bg-red-500'}`}
                        >
                          {student.present ? 'Present' : 'Absent'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => submitAttendance(selectedBatch)}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Submit Attendance & Send Notifications
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TeacherDashboard; 