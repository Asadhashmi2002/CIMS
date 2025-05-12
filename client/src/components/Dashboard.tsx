import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface User {
  role: string;
  email: string;
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Redirect to login if not authenticated
      window.location.href = '/login';
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
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
            <h1 className="text-2xl font-bold text-gray-800">Coaching Institute Management</h1>
            <Link 
              to="/" 
              className="ml-6 text-blue-600 hover:text-blue-800 inline-flex items-center text-sm"
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Dashboard Cards */}
          <DashboardCard 
            title="Students" 
            count="120" 
            icon="👨‍🎓" 
            color="bg-blue-500" 
            link="/students"
          />
          <DashboardCard 
            title="Teachers" 
            count="12" 
            icon="👨‍🏫" 
            color="bg-green-500" 
            link="/teachers"
          />
          <DashboardCard 
            title="Batches" 
            count="8" 
            icon="📚" 
            color="bg-purple-500" 
            link="/batches"
          />
          <DashboardCard 
            title="Attendance" 
            count="Today" 
            icon="📋" 
            color="bg-yellow-500" 
            link="/attendance"
          />
          <DashboardCard 
            title="Fee Collection" 
            count="₹45,000" 
            icon="💰" 
            color="bg-red-500" 
            link="/fees"
          />
          <DashboardCard 
            title="Reports" 
            count="Generate" 
            icon="📊" 
            color="bg-indigo-500" 
            link="/reports"
          />
        </div>
      </main>
    </div>
  );
};

interface DashboardCardProps {
  title: string;
  count: string;
  icon: string;
  color: string;
  link: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, count, icon, color, link }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300"
      onClick={() => alert(`Navigating to ${link} (not implemented in demo)`)}
    >
      <div className={`${color} px-4 py-2 text-white text-lg font-semibold`}>
        {title}
      </div>
      <div className="p-6 flex justify-between items-center">
        <div>
          <div className="text-3xl font-bold">{count}</div>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
};

export default Dashboard; 