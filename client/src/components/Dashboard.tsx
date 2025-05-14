import React, { useEffect, useState } from 'react';
import { teacherAPI, statsAPI, batchAPI } from '../services/api';

interface User {
  role: string;
  email: string;
}

interface Stats {
  students: number;
  teachers: number;
  batches: number;
  feesCollected: number;
  attendanceToday: number;
  pendingFees: number;
}

interface RecentActivity {
  id: number;
  type: 'attendance' | 'payment' | 'enrollment' | 'message';
  user: string;
  action: string;
  time: string;
}

interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  joiningDate: string;
  status: 'active' | 'inactive';
  password?: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  enrollmentDate: string;
  feesStatus: 'Paid' | 'Pending';
}

interface Batch {
  id: string;
  name: string;
  subject: string;
  teacher: string;
  schedule: string;
  studentCount: number;
  students: Student[];
  teacherNames?: string[];
}

interface BatchData {
  totalStudents: number;
  batchCount: number;
  batches: Batch[];
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'students' | 'teachers' | 'batches' | 'attendance' | 'fees' | 'reports'>('dashboard');
  
  // Teacher management state
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isAddingTeacher, setIsAddingTeacher] = useState(false);
  const [isEditingTeacher, setIsEditingTeacher] = useState(false);
  const [editTeacherId, setEditTeacherId] = useState<string | null>(null);
  const [newTeacher, setNewTeacher] = useState<Omit<Teacher, 'id'>>({
    name: '',
    email: '',
    phone: '+91 ',
    subject: '',
    joiningDate: new Date().toISOString().split('T')[0],
    status: 'active',
    password: ''
  });
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [refreshTeachers, setRefreshTeachers] = useState(false);
  
  // Batch management state
  const [batches, setBatches] = useState<any[]>([]);
  const [isAddingBatch, setIsAddingBatch] = useState(false);
  const [isEditingBatch, setIsEditingBatch] = useState(false);
  const [editBatchId, setEditBatchId] = useState<string | null>(null);
  const [newBatch, setNewBatch] = useState({
    name: '',
    subject: '',
    teacherIds: [] as string[], // Changed from teacherId to teacherIds
    schedule: '',
    status: 'active' as 'active' | 'inactive'
  });
  const [availableTeachers, setAvailableTeachers] = useState<any[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [batchFormError, setBatchFormError] = useState('');
  const [apiBatchError, setApiBatchError] = useState('');
  const [batchSuccessMessage, setBatchSuccessMessage] = useState('');
  
  // Real-time dashboard data
  const [stats, setStats] = useState<Stats>({
    students: 0,
    teachers: 0,
    batches: 0,
    feesCollected: 0,
    attendanceToday: 0,
    pendingFees: 0
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [statsLoading, setStatsLoading] = useState(false);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Batch and student management state
  const [batchData, setBatchData] = useState<BatchData | null>(null);
  const [batchesLoading, setBatchesLoading] = useState(false);
  
  // At the top of the Dashboard component, add a new state for tracking manual refresh
  const [isManuallyRefreshing, setIsManuallyRefreshing] = useState(false);
  
  // Define fetch functions outside of useEffect for reuse
  const fetchTeachers = async () => {
    setIsLoading(true);
    try {
      const response = await teacherAPI.getAllTeachers();
      setTeachers(response.data);
      setIsLoading(false);
    } catch (error) {
      setApiError('Failed to load teachers. Please try again later.');
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const response = await statsAPI.getStats();
      setStats(response.data);
      setLastUpdated(new Date());
      setStatsLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStatsLoading(false);
    }
  };
  
  const fetchActivities = async () => {
    setActivitiesLoading(true);
    try {
      const response = await statsAPI.getActivities();
      setRecentActivities(response.data);
      setActivitiesLoading(false);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setActivitiesLoading(false);
    }
  };

  const fetchBatchesAndStudents = async () => {
    setBatchesLoading(true);
    try {
      const response = await statsAPI.getBatchesAndStudents();
      setBatchData(response.data);
      setBatchesLoading(false);
    } catch (error) {
      console.error('Error fetching batches and students:', error);
      setBatchesLoading(false);
    }
  };
  
  const fetchBatches = async () => {
    setBatchesLoading(true);
    try {
      const response = await batchAPI.getAllBatches();
      setBatches(response.data);
      setBatchesLoading(false);
    } catch (error) {
      console.error('Error fetching batches:', error);
      setApiBatchError('Failed to load batches. Please try again.');
      setBatchesLoading(false);
    }
  };
  
  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Redirect to login if not authenticated
      window.location.href = '/login';
    }
    
    // Initial data load based on active tab
    if (activeTab === 'dashboard') {
      fetchStats();
      fetchActivities();
    } else if (activeTab === 'teachers') {
      fetchTeachers();
    } else if (activeTab === 'students') {
      fetchBatchesAndStudents();
    } else if (activeTab === 'batches') {
      fetchBatches();
    }
    
    // Refresh teacher list if flag is set
    if (refreshTeachers) {
      fetchTeachers();
      setRefreshTeachers(false);
    }
    
    // No auto-refresh interval needed, as we'll only refresh on manual actions
  }, [activeTab, refreshTeachers]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Teacher management functions
  const handleTeacherInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTeacher(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setApiError('');
    setSuccessMessage('');
    
    // Validate form
    if (!newTeacher.email || !newTeacher.password) {
      setFormError('Email and password are required for teacher login');
      return;
    }
    
    // Check if email already exists when adding new teacher
    if (!isEditingTeacher && teachers.some(t => t.email === newTeacher.email)) {
      setFormError('A teacher with this email already exists');
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isEditingTeacher && editTeacherId) {
        // Update existing teacher
        const response = await teacherAPI.updateTeacher(editTeacherId, newTeacher);
        
        // Update teachers state with the updated teacher
        setTeachers(prevTeachers => 
          prevTeachers.map(teacher => 
            teacher.id === editTeacherId ? response.data.teacher : teacher
          )
        );
        
        setSuccessMessage(`Teacher "${newTeacher.name || newTeacher.email}" updated successfully!`);
        
        // Reset form
        setNewTeacher({
          name: '',
          email: '',
          phone: '+91 ',
          subject: '',
          joiningDate: new Date().toISOString().split('T')[0],
          status: 'active',
          password: ''
        });
        setIsEditingTeacher(false);
        setEditTeacherId(null);
      } else {
        // Create new teacher
        const response = await teacherAPI.createTeacher(newTeacher);
        
        // Add the new teacher to the state
        setTeachers(prevTeachers => [...prevTeachers, response.data.teacher]);
        
        setSuccessMessage(`Teacher "${newTeacher.name || newTeacher.email}" created successfully!`);
        
        // Reset form
        setNewTeacher({
          name: '',
          email: '',
          phone: '+91 ',
          subject: '',
          joiningDate: new Date().toISOString().split('T')[0],
          status: 'active',
          password: ''
        });
      }
      
      setIsAddingTeacher(false);
      setIsLoading(false);
      
      // Trigger refresh of teachers list after a short delay
      setTimeout(() => {
        setRefreshTeachers(true);
      }, 1000);
      
    } catch (error: any) {
      console.error('Teacher operation error:', error);
      setApiError(error.response?.data?.message || 'Failed to perform operation. Please try again.');
      setIsLoading(false);
    }
  };
  
  const editTeacher = async (id: string) => {
    setIsLoading(true);
    setApiError('');
    
    try {
      const response = await teacherAPI.getTeacher(id);
      const teacher = response.data;
      
      setNewTeacher({
        name: teacher.name,
        email: teacher.email,
        phone: teacher.phone,
        subject: teacher.subject,
        joiningDate: teacher.joiningDate.split('T')[0], // Format the date
        status: teacher.status as 'active' | 'inactive',
        password: '' // Don't set the password for editing
      });
      
      setEditTeacherId(id);
      setIsEditingTeacher(true);
      setIsAddingTeacher(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching teacher details:', error);
      setApiError('Failed to load teacher details. Please try again.');
      setIsLoading(false);
    }
  };
  
  const cancelForm = () => {
    // Reset form
    setNewTeacher({
      name: '',
      email: '',
      phone: '+91 ',
      subject: '',
      joiningDate: new Date().toISOString().split('T')[0],
      status: 'active',
      password: ''
    });
    setIsAddingTeacher(false);
    setIsEditingTeacher(false);
    setEditTeacherId(null);
    setFormError('');
    setApiError('');
  };
  
  const toggleTeacherStatus = async (id: string) => {
    setIsLoading(true);
    setApiError('');
    
    try {
      // Find teacher in state
      const teacher = teachers.find(t => t.id === id);
      if (!teacher) {
        setApiError('Teacher not found.');
        setIsLoading(false);
        return;
      }
      
      // Toggle status
      const newStatus = teacher.status === 'active' ? 'inactive' : 'active';
      
      // Update teacher with new status
      const response = await teacherAPI.updateTeacher(id, { 
        ...teacher, 
        status: newStatus 
      });
      
      // Update state with new data
      setTeachers(prevTeachers => 
        prevTeachers.map(t => 
          t.id === id ? response.data.teacher : t
        )
      );
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error toggling teacher status:', error);
      setApiError('Failed to update teacher status. Please try again.');
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const removeTeacher = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this teacher? This action cannot be undone.')) {
      setIsLoading(true);
      setApiError('');
      
      try {
        await teacherAPI.deleteTeacher(id);
        
        // Remove teacher from state
        setTeachers(prevTeachers => prevTeachers.filter(t => t.id !== id));
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error removing teacher:', error);
        setApiError('Failed to remove teacher. Please try again.');
        setIsLoading(false);
      }
    }
  };

  // Batch management functions
  const handleBatchInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle multi-select for teachers
    if (name === 'teacherIds' && e.target instanceof HTMLSelectElement && e.target.multiple) {
      try {
        const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
        setNewBatch(prev => ({
          ...prev,
          [name]: selectedOptions
        }));
      } catch (error) {
        // Fallback to single value if multiple selection fails
        setNewBatch(prev => ({
          ...prev,
          [name]: [value]
        }));
      }
    } else {
      setNewBatch(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleAddBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setBatchFormError('');
    setApiBatchError('');
    setBatchSuccessMessage('');
    
    // Validate form
    if (!newBatch.name || !newBatch.subject) {
      setBatchFormError('Batch name and subject are required');
      return;
    }
    
    // Create a modified batch object with proper handling of teacherIds
    const batchToSave = {
      ...newBatch,
      // Ensure teacherIds is an array
      teacherIds: Array.isArray(newBatch.teacherIds) ? newBatch.teacherIds : 
                  (newBatch.teacherIds ? [newBatch.teacherIds] : [])
    };
    
    console.log('Submitting batch with data:', batchToSave);
    
    try {
      if (isEditingBatch && editBatchId) {
        // Update existing batch
        const response = await batchAPI.updateBatch(editBatchId, batchToSave);
        
        // Update batches state with the updated batch
        setBatches(prevBatches => 
          prevBatches.map(batch => 
            batch.id === editBatchId ? response.data.batch : batch
          )
        );
        
        setBatchSuccessMessage(`Batch "${newBatch.name}" updated successfully!`);
      } else {
        // Create new batch
        const response = await batchAPI.createBatch(batchToSave);
        
        // Add the new batch to the state
        setBatches(prevBatches => [...prevBatches, response.data.batch]);
        
        setBatchSuccessMessage(`Batch "${newBatch.name}" created successfully!`);
      }
      
      // Reset form
      setNewBatch({
        name: '',
        subject: '',
        teacherIds: [] as string[],
        schedule: '',
        status: 'active'
      });
      setIsAddingBatch(false);
      setIsEditingBatch(false);
      setEditBatchId(null);
      
    } catch (error: any) {
      console.error('Batch operation error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setApiBatchError(error.response.data.message);
      } else if (error.message) {
        setApiBatchError(error.message);
      } else {
        setApiBatchError('Failed to perform operation. Please try again.');
      }
    }
  };
  
  const editBatch = async (id: string) => {
    try {
      const response = await batchAPI.getBatch(id);
      const batch = response.data;
      
      setNewBatch({
        name: batch.name,
        subject: batch.subject,
        teacherIds: batch.teacherIds || [], // Changed from teacherId to teacherIds
        schedule: batch.schedule || '',
        status: batch.status
      });
      
      setEditBatchId(id);
      setIsEditingBatch(true);
      setIsAddingBatch(true);
      
      // Load available teachers
      setLoadingTeachers(true);
      teacherAPI.getAllTeachers()
        .then(response => {
          setAvailableTeachers(response.data);
          setLoadingTeachers(false);
        })
        .catch(error => {
          console.error('Failed to load available teachers:', error);
          setLoadingTeachers(false);
        });
      
    } catch (error) {
      console.error('Error fetching batch details:', error);
      setApiBatchError('Failed to load batch details. Please try again.');
    }
  };
  
  const cancelBatchForm = () => {
    // Reset form
    setNewBatch({
      name: '',
      subject: '',
      teacherIds: [] as string[], // Changed from teacherId to teacherIds
      schedule: '',
      status: 'active'
    });
    setIsAddingBatch(false);
    setIsEditingBatch(false);
    setEditBatchId(null);
    setBatchFormError('');
    setApiBatchError('');
  };
  
  const removeBatch = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this batch? This action cannot be undone.')) {
      try {
        await batchAPI.deleteBatch(id);
        
        // Get the batch name for the success message
        const batchName = batches.find(b => b.id === id)?.name || 'Batch';
        
        // Remove batch from state
        setBatches(prevBatches => prevBatches.filter(b => b.id !== id));
        
        // Show success message
        setBatchSuccessMessage(`${batchName} deleted successfully!`);
        
      } catch (error) {
        console.error('Error removing batch:', error);
        setApiBatchError('Failed to remove batch. Please try again.');
      }
    }
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
              <span className="text-xl font-bold text-blue-400">Class</span>
              <span className="text-xl font-bold text-orange-400">entry</span>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>} 
              title="Students" 
              active={activeTab === 'students'} 
              onClick={() => setActiveTab('students')}
              collapsed={!sidebarOpen}
            />
            <SidebarItem 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>} 
              title="Teachers" 
              active={activeTab === 'teachers'} 
              onClick={() => setActiveTab('teachers')}
              collapsed={!sidebarOpen}
            />
            <SidebarItem 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2M7 7h10" />
              </svg>} 
              title="Batches" 
              active={activeTab === 'batches'} 
              onClick={() => setActiveTab('batches')}
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>} 
              title="Fees" 
              active={activeTab === 'fees'} 
              onClick={() => setActiveTab('fees')}
              collapsed={!sidebarOpen}
            />
            <SidebarItem 
              icon={<svg xmlns="http://www.w3.org/2000/svg" className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>} 
              title="Reports" 
              active={activeTab === 'reports'} 
              onClick={() => setActiveTab('reports')}
              collapsed={!sidebarOpen}
            />
          </ul>
        </nav>

        {/* User Profile */}
        <div className="border-t border-gray-800 p-4">
          {sidebarOpen ? (
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                {user.email.substring(0, 1).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium">{user.email}</p>
                <p className="text-xs text-gray-400 capitalize">{user.role}</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                {user.email.substring(0, 1).toUpperCase()}
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
              <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
              <div className="hidden md:flex items-center text-sm text-gray-600">
                <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
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
                    <h2 className="text-2xl font-bold text-gray-800">Welcome back, Admin!</h2>
                    <p className="text-gray-600 mt-1">Here's what's happening with your institute today.</p>
                  </div>
                  <div className="mt-4 md:mt-0 flex flex-col items-end">
                    <button 
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
                      onClick={() => {
                        setIsManuallyRefreshing(true);
                        
                        // Fetch all dashboard data
                        Promise.all([
                          fetchStats(),
                          fetchActivities(),
                          fetchBatchesAndStudents()
                        ]).finally(() => {
                          setIsManuallyRefreshing(false);
                        });
                      }}
                      disabled={isManuallyRefreshing}
                    >
                      {isManuallyRefreshing ? (
                        <>
                          <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Refreshing...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Refresh Dashboard
                        </>
                      )}
                    </button>
                    <div className="text-xs text-gray-500 mt-2 flex items-center">
                      <span className="inline-block h-2 w-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                      Last updated: {lastUpdated.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {statsLoading ? (
                  // Loading skeleton for stats
                  <>
                    {[...Array(6)].map((_, index) => (
                      <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 animate-pulse">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                            <div className="h-6 bg-gray-300 rounded w-16"></div>
                            <div className="h-3 bg-gray-200 rounded w-32"></div>
                          </div>
                          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <StatCard 
                      title="Total Students" 
                      value={stats.students} 
                      trend="+12% from last month" 
                      increasing={true}
                      icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                      </svg>} 
                    />
                    <StatCard 
                      title="Attendance Today" 
                      value={`${stats.attendanceToday}%`} 
                      trend="+3% from yesterday" 
                      increasing={true}
                      icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>} 
                    />
                    <StatCard 
                      title="Fees Collected" 
                      value={`₹${stats.feesCollected.toLocaleString()}`} 
                      trend="+21% from last month" 
                      increasing={true}
                      icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>} 
                    />
                    <StatCard 
                      title="Pending Fees" 
                      value={`₹${stats.pendingFees.toLocaleString()}`} 
                      trend="-5% from last month" 
                      increasing={false}
                      icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>} 
                    />
                    <StatCard 
                      title="Total Teachers" 
                      value={stats.teachers} 
                      trend="+2 new hires" 
                      increasing={true}
                      icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>} 
                    />
                    <StatCard 
                      title="Active Batches" 
                      value={stats.batches} 
                      trend="+3 new batches" 
                      increasing={true}
                      icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>} 
                    />
                  </>
                )}
              </div>

              {/* Activity and Calendar Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
                    <button 
                      onClick={() => {
                        setActivitiesLoading(true);
                        statsAPI.getActivities()
                          .then(response => {
                            setRecentActivities(response.data);
                            setActivitiesLoading(false);
                          })
                          .catch(error => {
                            console.error('Error refreshing activities:', error);
                            setActivitiesLoading(false);
                          });
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      {activitiesLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Refreshing...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Refresh
                        </>
                      )}
                    </button>
                  </div>
                  {activitiesLoading ? (
                    // Loading skeleton for activities
                    <div className="space-y-4">
                      {[...Array(5)].map((_, index) => (
                        <div key={index} className="flex items-start border-b border-gray-100 pb-4 animate-pulse">
                          <div className="flex-shrink-0 rounded-full p-2 mr-3 bg-gray-100 h-9 w-9"></div>
                          <div className="flex-grow">
                            <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                            <div className="h-3 bg-gray-100 rounded w-48 mb-2"></div>
                            <div className="h-3 bg-gray-100 rounded w-16"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentActivities.map(activity => (
                        <div key={activity.id} className="flex items-start border-b border-gray-100 pb-4">
                          <div className="flex-shrink-0 rounded-full p-2 mr-3 bg-blue-50">
                            {activity.type === 'attendance' && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                              </svg>
                            )}
                            {activity.type === 'payment' && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                            {activity.type === 'enrollment' && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                              </svg>
                            )}
                            {activity.type === 'message' && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-grow">
                            <h4 className="text-sm font-medium text-gray-800">{activity.user}</h4>
                            <p className="text-sm text-gray-600">{activity.action}</p>
                            <span className="text-xs text-gray-500">{activity.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <QuickActionButton 
                      title="Mark Attendance" 
                      icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>} 
                    />
                    <QuickActionButton 
                      title="Collect Fee" 
                      icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>} 
                    />
                    <QuickActionButton 
                      title="Add Student" 
                      icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>} 
                    />
                    <QuickActionButton 
                      title="Send Notification" 
                      icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>} 
                    />
                    <QuickActionButton 
                      title="Create Report" 
                      icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>} 
                    />
                  </div>

                  {/* Upcoming Events */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Events</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 text-blue-800 rounded-md">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">Physics Test</div>
                          <div className="text-xs">Tomorrow</div>
                        </div>
                        <div className="text-xs mt-1">Batch B3 - 10:00 AM</div>
                      </div>
                      <div className="p-3 bg-green-50 text-green-800 rounded-md">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">Parent-Teacher Meeting</div>
                          <div className="text-xs">May 25</div>
                        </div>
                        <div className="text-xs mt-1">All Batches - 04:00 PM</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'teachers' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Teacher Management</h2>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => {
                      setIsLoading(true);
                      teacherAPI.getAllTeachers()
                        .then(response => {
                          setTeachers(response.data);
                          setIsLoading(false);
                        })
                        .catch(error => {
                          console.error('Failed to refresh teachers:', error);
                          setApiError('Failed to load teachers. Please try again.');
                          setIsLoading(false);
                        });
                    }}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
                    disabled={isLoading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh List
                  </button>
                  {!isAddingTeacher && (
                    <button 
                      onClick={() => {
                        setIsAddingTeacher(true);
                        setFormError('');
                        setApiError('');
                        setSuccessMessage('');
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Loading...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Add New Teacher
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
              
              {successMessage && (
                <div className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-sm">
                  <div className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {successMessage}
                  </div>
                  <button 
                    onClick={() => setSuccessMessage('')} 
                    className="mt-2 text-xs text-green-800 hover:text-green-900 underline"
                  >
                    Dismiss
                  </button>
                </div>
              )}
              
              {apiError && (
                <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm">
                  <div className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {apiError}
                  </div>
                  <button 
                    onClick={() => setApiError('')} 
                    className="mt-2 text-xs text-red-800 hover:text-red-900 underline"
                  >
                    Dismiss
                  </button>
                </div>
              )}
              
              {isAddingTeacher && (
                <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200 shadow-md">
                  <div className="border-b border-gray-200 pb-4 mb-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-800 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        {isEditingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
                      </h3>
                      <button
                        onClick={cancelForm}
                        className="text-gray-500 hover:text-gray-700 transition-colors bg-gray-100 hover:bg-gray-200 rounded-full p-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {isEditingTeacher ? 
                        'Update the teacher details. Email and password are required for login.' : 
                        'Fill in the details to add a new teacher to the platform. Email and password are required for login.'}
                    </p>
                  </div>
                  
                  {formError && (
                    <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm">
                      <div className="flex">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {formError}
                      </div>
                    </div>
                  )}
                  
                  <form onSubmit={handleAddTeacher} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <div className="space-y-1">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Full Name <span className="text-gray-400">(optional)</span>
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={newTeacher.name}
                            onChange={handleTeacherInputChange}
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2.5 sm:text-sm border-gray-300 rounded-md"
                            placeholder="John Doe"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>
                          </div>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={newTeacher.email}
                            onChange={handleTeacherInputChange}
                            className={`focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2.5 sm:text-sm border-gray-300 rounded-md ${
                              !isEditingTeacher && teachers.some(t => t.email === newTeacher.email && newTeacher.email !== '') 
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                : ''
                            }`}
                            placeholder="teacher@example.com"
                            required
                          />
                          {!isEditingTeacher && teachers.some(t => t.email === newTeacher.email && newTeacher.email !== '') && (
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                        {!isEditingTeacher && teachers.some(t => t.email === newTeacher.email && newTeacher.email !== '') ? (
                          <p className="mt-1 text-xs text-red-600">This email already exists in the system. Please use a different email.</p>
                        ) : (
                          <p className="mt-1 text-xs text-blue-600">This will be used as the login ID</p>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                          Phone Number <span className="text-gray-400">(optional)</span>
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={newTeacher.phone}
                            onChange={handleTeacherInputChange}
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2.5 sm:text-sm border-gray-300 rounded-md"
                            placeholder="+91 98765 43210"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                          Subject <span className="text-gray-400">(optional)</span>
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                          <input
                            type="text"
                            id="subject"
                            name="subject"
                            value={newTeacher.subject}
                            onChange={handleTeacherInputChange}
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2.5 sm:text-sm border-gray-300 rounded-md"
                            placeholder="Physics, Mathematics, etc."
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <label htmlFor="joiningDate" className="block text-sm font-medium text-gray-700">
                          Joining Date <span className="text-gray-400">(optional)</span>
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <input
                            type="date"
                            id="joiningDate"
                            name="joiningDate"
                            value={newTeacher.joiningDate}
                            onChange={handleTeacherInputChange}
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2.5 sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                          Password <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h14a2 2 0 002-2v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                          <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            value={newTeacher.password || ''}
                            onChange={handleTeacherInputChange}
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-10 py-2.5 sm:text-sm border-gray-300 rounded-md"
                            placeholder="••••••••"
                            required
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <button
                              type="button"
                              onClick={togglePasswordVisibility}
                              className="text-gray-400 hover:text-gray-600 focus:outline-none"
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
                        <p className="mt-1 text-xs text-blue-600">This will be used for login authentication</p>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-gray-200 mt-6">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">* Required fields for login</span>
                        <div className="flex items-center space-x-3">
                          <button
                            type="button"
                            onClick={cancelForm}
                            className="px-4 py-2.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-6 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex items-center"
                          >
                            {isEditingTeacher ? (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Update Teacher
                              </>
                            ) : (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Add Teacher
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Teacher List</h3>
                
                {isLoading && !isAddingTeacher ? (
                  <div className="flex justify-center items-center p-8">
                    <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                ) : teachers.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="mt-2 text-gray-600">No teachers found</p>
                    <button 
                      onClick={() => setIsAddingTeacher(true)}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Add Your First Teacher
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Teacher
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Subject
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Since
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {teachers.map((teacher) => (
                          <tr key={teacher.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                  <span className="text-indigo-800 font-medium text-sm">
                                    {teacher.name ? teacher.name.split(' ').map(n => n[0]).join('').toUpperCase() : teacher.email[0].toUpperCase()}
                                  </span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {teacher.name || '(No name provided)'}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {teacher.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{teacher.phone}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{teacher.subject || '(Not specified)'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  teacher.status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {teacher.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(teacher.joiningDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => editTeacher(teacher.id)}
                                  className="text-indigo-600 hover:text-indigo-900 p-1"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => removeTeacher(teacher.id)}
                                  className="text-red-600 hover:text-red-900 p-1"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mt-6">
                  <p className="text-sm text-gray-600 mb-4">
                    <strong>Important:</strong> Teachers can log in using their email address and password. Only these two fields are required for login.
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                    <li>Email address serves as the unique login ID</li>
                    <li>Password is used for authentication</li>
                    <li>Other details (name, phone, subject) are optional and can be added later</li>
                  </ol>
                  {teachers.length > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-800 text-sm">
                      <div className="font-medium">Sample Login:</div>
                      <div className="mt-1">Email: <span className="font-mono">{teachers[0]?.email || 'example@email.com'}</span></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'students' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Student Management</h2>
                <button 
                  onClick={() => {
                    setBatchesLoading(true);
                    statsAPI.getBatchesAndStudents()
                      .then(response => {
                        setBatchData(response.data);
                        setBatchesLoading(false);
                      })
                      .catch(error => {
                        console.error('Error fetching batches and students:', error);
                        setBatchesLoading(false);
                      });
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
                  disabled={batchesLoading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh Data
                </button>
              </div>

              {/* Stats Cards for Students */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Students</p>
                      <h3 className="text-2xl font-bold text-gray-900">{batchData?.totalStudents || 0}</h3>
                    </div>
                    <div className="p-3 rounded-full bg-blue-50">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-xs text-green-500 font-medium">↑ 12% from last month</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Batches</p>
                      <h3 className="text-2xl font-bold text-gray-900">{batchData?.batchCount || 0}</h3>
                    </div>
                    <div className="p-3 rounded-full bg-indigo-50">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-xs text-green-500 font-medium">↑ 3 new batches</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Average Per Batch</p>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {batchData ? Math.round(batchData.totalStudents / batchData.batchCount) : 0}
                      </h3>
                    </div>
                    <div className="p-3 rounded-full bg-green-50">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-xs text-gray-500 font-medium">Students per batch average</span>
                  </div>
                </div>
              </div>

              {/* Batch List */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Batch List</h3>
                
                {batchesLoading ? (
                  <div className="flex justify-center items-center p-8">
                    <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                ) : !batches || batches.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p className="mt-2 text-gray-600">No batches found</p>
                    <button 
                      onClick={() => {
                        setIsAddingBatch(true);
                        setBatchFormError('');
                        setApiBatchError('');
                        setBatchSuccessMessage('');
                        
                        // Load available teachers for assignment
                        setLoadingTeachers(true);
                        teacherAPI.getAllTeachers()
                          .then(response => {
                            setAvailableTeachers(response.data);
                            setLoadingTeachers(false);
                          })
                          .catch(error => {
                            console.error('Failed to load available teachers:', error);
                            setLoadingTeachers(false);
                          });
                      }}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Create Your First Batch
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Batch
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Subject
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Teacher
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Schedule
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Students
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {batches.map((batch) => (
                          <tr key={batch.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                  <span className="text-indigo-800 font-medium text-sm">
                                    {batch.id}
                                  </span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {batch.name}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{batch.subject}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {batch.teacherNames && batch.teacherNames.length > 0 
                                  ? batch.teacherNames.join(', ') 
                                  : 'No teachers assigned'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{batch.schedule}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {batch.studentCount} students
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => alert(`View students for ${batch.name} (Not implemented in demo)`)}
                                  className="text-indigo-600 hover:text-indigo-900 p-1"
                                  title="View Students"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => editBatch(batch.id)}
                                  className="text-blue-600 hover:text-blue-900 p-1"
                                  title="Edit Batch"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => removeBatch(batch.id)}
                                  className="text-red-600 hover:text-red-900 p-1"
                                  title="Delete Batch"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Summary Section */}
              <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-sm text-gray-700">
                  <p className="font-medium mb-2">Quick Summary:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Total Students: <span className="font-medium">{batchData?.totalStudents || 0}</span></li>
                    <li>Total Batches: <span className="font-medium">{batchData?.batchCount || 0}</span></li>
                    <li>Most Popular Subject: <span className="font-medium">{batchData?.batches?.[0]?.subject || 'N/A'}</span></li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'batches' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Batch Management</h2>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => {
                      setBatchesLoading(true);
                      batchAPI.getAllBatches()
                        .then(response => {
                          setBatches(response.data);
                          setBatchesLoading(false);
                        })
                        .catch(error => {
                          console.error('Failed to refresh batches:', error);
                          setApiBatchError('Failed to load batches. Please try again.');
                          setBatchesLoading(false);
                        });
                    }}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
                    disabled={batchesLoading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh List
                  </button>
                  {!isAddingBatch && (
                    <button 
                      onClick={() => {
                        setIsAddingBatch(true);
                        setBatchFormError('');
                        setApiBatchError('');
                        setBatchSuccessMessage('');
                        
                        // Load available teachers for assignment
                        setLoadingTeachers(true);
                        teacherAPI.getAllTeachers()
                          .then(response => {
                            setAvailableTeachers(response.data);
                            setLoadingTeachers(false);
                          })
                          .catch(error => {
                            console.error('Failed to load available teachers:', error);
                            setLoadingTeachers(false);
                          });
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Create New Batch
                    </button>
                  )}
                </div>
              </div>
              
              {batchSuccessMessage && (
                <div className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-sm">
                  <div className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {batchSuccessMessage}
                  </div>
                  <button 
                    onClick={() => setBatchSuccessMessage('')} 
                    className="mt-2 text-xs text-green-800 hover:text-green-900 underline"
                  >
                    Dismiss
                  </button>
                </div>
              )}
              
              {apiBatchError && (
                <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm">
                  <div className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {apiBatchError}
                  </div>
                  <button 
                    onClick={() => setApiBatchError('')} 
                    className="mt-2 text-xs text-red-800 hover:text-red-900 underline"
                  >
                    Dismiss
                  </button>
                </div>
              )}
              
              {isAddingBatch && (
                <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200 shadow-md">
                  <div className="border-b border-gray-200 pb-4 mb-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-800 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        {isEditingBatch ? 'Edit Batch' : 'Create New Batch'}
                      </h3>
                      <button
                        onClick={cancelBatchForm}
                        className="text-gray-500 hover:text-gray-700 transition-colors bg-gray-100 hover:bg-gray-200 rounded-full p-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {isEditingBatch ? 
                        'Update the batch details. Name and subject are required.' : 
                        'Fill in the details to create a new batch.'}
                    </p>
                  </div>
                  
                  {batchFormError && (
                    <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm">
                      <div className="flex">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {batchFormError}
                      </div>
                    </div>
                  )}
                  
                  <form onSubmit={handleAddBatch} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <div className="space-y-1">
                        <label htmlFor="batchName" className="block text-sm font-medium text-gray-700">
                          Batch Name <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                          </div>
                          <input
                            type="text"
                            id="batchName"
                            name="name"
                            value={newBatch.name}
                            onChange={handleBatchInputChange}
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2.5 sm:text-sm border-gray-300 rounded-md"
                            placeholder="Mathematics B01"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                          Subject <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                          <input
                            type="text"
                            id="subject"
                            name="subject"
                            value={newBatch.subject}
                            onChange={handleBatchInputChange}
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2.5 sm:text-sm border-gray-300 rounded-md"
                            placeholder="Mathematics, Physics, etc."
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <label htmlFor="teacherIds" className="block text-sm font-medium text-gray-700">
                          Assign Teachers <span className="text-gray-400">(optional)</span>
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <select
                            id="teacherIds"
                            name="teacherIds"
                            value={newBatch.teacherIds}
                            onChange={handleBatchInputChange}
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2.5 sm:text-sm border-gray-300 rounded-md"
                            multiple
                            size={4}
                          >
                            {loadingTeachers ? (
                              <option value="" disabled>Loading teachers...</option>
                            ) : (
                              availableTeachers.map(teacher => (
                                <option key={teacher.id} value={teacher.id}>
                                  {teacher.name || teacher.email}
                                </option>
                              ))
                            )}
                          </select>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Hold Ctrl (or Cmd on Mac) to select multiple teachers</p>
                      </div>
                      
                      <div className="space-y-1">
                        <label htmlFor="schedule" className="block text-sm font-medium text-gray-700">
                          Schedule <span className="text-gray-400">(optional)</span>
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <input
                            type="text"
                            id="schedule"
                            name="schedule"
                            value={newBatch.schedule}
                            onChange={handleBatchInputChange}
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2.5 sm:text-sm border-gray-300 rounded-md"
                            placeholder="Mon, Wed, Fri - 09:00 AM"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-gray-200 mt-6">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">* Required fields</span>
                        <div className="flex items-center space-x-3">
                          <button
                            type="button"
                            onClick={cancelBatchForm}
                            className="px-4 py-2.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-6 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex items-center"
                          >
                            {isEditingBatch ? (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Update Batch
                              </>
                            ) : (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Create Batch
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Batch List</h3>
                
                {batchesLoading ? (
                  <div className="flex justify-center items-center p-8">
                    <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                ) : !batches || batches.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p className="mt-2 text-gray-600">No batches found</p>
                    <button 
                      onClick={() => {
                        setIsAddingBatch(true);
                        setBatchFormError('');
                        setApiBatchError('');
                        setBatchSuccessMessage('');
                        
                        // Load available teachers for assignment
                        setLoadingTeachers(true);
                        teacherAPI.getAllTeachers()
                          .then(response => {
                            setAvailableTeachers(response.data);
                            setLoadingTeachers(false);
                          })
                          .catch(error => {
                            console.error('Failed to load available teachers:', error);
                            setLoadingTeachers(false);
                          });
                      }}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Create Your First Batch
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Batch
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Subject
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Teacher
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Schedule
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Students
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {batches.map((batch) => (
                          <tr key={batch.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                  <span className="text-indigo-800 font-medium text-sm">
                                    {batch.id}
                                  </span>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {batch.name}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{batch.subject}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {batch.teacherNames && batch.teacherNames.length > 0 
                                  ? batch.teacherNames.join(', ') 
                                  : 'No teachers assigned'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{batch.schedule}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {batch.studentCount} students
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => alert(`View students for ${batch.name} (Not implemented in demo)`)}
                                  className="text-indigo-600 hover:text-indigo-900 p-1"
                                  title="View Students"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => editBatch(batch.id)}
                                  className="text-blue-600 hover:text-blue-900 p-1"
                                  title="Edit Batch"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => removeBatch(batch.id)}
                                  className="text-red-600 hover:text-red-900 p-1"
                                  title="Delete Batch"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// Define the missing components
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

interface StatCardProps {
  title: string;
  value: string | number;
  trend: string;
  icon: React.ReactNode;
  increasing?: boolean; // Add this to indicate if the value is increasing
}

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, icon, increasing = true }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow relative overflow-hidden">
      {/* Dynamic indicator - subtle background animation */}
      <div className={`absolute right-0 top-0 h-full w-1 ${increasing ? 'bg-green-500' : 'bg-red-500'}`}></div>
      
      <div className="flex items-center">
        <div className="mr-4">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
          <p className="text-xs flex items-center mt-1">
            <span className={`${increasing ? 'text-green-500' : 'text-red-500'} mr-1`}>
              {increasing ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                </svg>
              )}
            </span>
            <span className={`${increasing ? 'text-green-500' : 'text-red-500'} font-medium`}>{trend}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

interface QuickActionButtonProps {
  title: string;
  icon: React.ReactNode;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ title, icon }) => {
  return (
    <button 
      className="flex items-center w-full p-3 text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-md transition-colors"
      onClick={() => alert(`${title} action (not implemented in demo)`)}
    >
      <span className="mr-3 text-blue-500">{icon}</span>
      <span className="text-sm font-medium">{title}</span>
    </button>
  );
};

export default Dashboard; 

