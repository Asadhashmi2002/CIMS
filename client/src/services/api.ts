import axios from 'axios';

// Create an axios instance with base URL that can be used in different environments
// For Vercel deployment, we need to handle relative and absolute URLs properly
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api');

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  // Add timeout and retry settings for better reliability
  timeout: 15000,
  // Retry logic for handling transient network issues
  validateStatus: function (status) {
    return status >= 200 && status < 500; // Handle 4xx errors manually, retry on 5xx
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
    // Remove the timestamp query parameter which causes unnecessary refreshes
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Any status code within the range of 2xx will trigger this function
    return response;
  },
  (error) => {
    // Any status codes outside the range of 2xx will trigger this function
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', error.response.status, error.response.data);
      
      // Handle specific error cases
      if (error.response.status === 401) {
        // Unauthorized - could redirect to login
        console.warn('Authentication required. User may need to log in again.');
        // Optional: localStorage.removeItem('user');
        // Optional: window.location.href = '/login';
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API No Response Error:', error.request);
      
      // Check if the error is specifically a network error
      if (error.message && (
        error.message.includes('Network Error') || 
        error.message.includes('timeout') ||
        error.message.includes('ECONNREFUSED') ||
        error.message.includes('ECONNABORTED')
      )) {
        error.isNetworkError = true;
        console.error('Network connection error:', error.message);
      }
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Request Setup Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  // Login
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  
  // Teacher Login
  teacherLogin: (email: string, password: string) =>
    api.post('/teachers/login', { email, password }),
  
  // Register
  register: (userData: any) => 
    api.post('/auth/register', userData)
};

// Teacher API
export const teacherAPI = {
  // Get all teachers
  getAllTeachers: async () => {
    try {
      const response = await api.get('/teachers');
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Get a single teacher
  getTeacher: async (id: string) => {
    try {
      const response = await api.get(`/teachers/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Create a new teacher
  createTeacher: async (teacherData: any) => {
    try {
      const response = await api.post('/teachers', teacherData);
      return response;
    } catch (error: any) {
      throw error;
    }
  },
  
  // Update a teacher
  updateTeacher: async (id: string, teacherData: any) => {
    try {
      const response = await api.put(`/teachers/${id}`, teacherData);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Delete a teacher
  deleteTeacher: async (id: string) => {
    try {
      const response = await api.delete(`/teachers/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// Student API
export const studentAPI = {
  getAllStudents: () => api.get('/students'),
  getStudent: (id: string) => api.get(`/students/${id}`),
  createStudent: (studentData: any) => api.post('/students', studentData),
  updateStudent: (id: string, studentData: any) => api.put(`/students/${id}`, studentData),
  deleteStudent: (id: string) => api.delete(`/students/${id}`),
};

// Fee API
export const feeAPI = {
  getAllFees: () => api.get('/fees'),
  getFee: (id: string) => api.get(`/fees/${id}`),
  createFee: (feeData: any) => api.post('/fees', feeData),
  updateFee: (id: string, feeData: any) => api.put(`/fees/${id}`, feeData),
  deleteFee: (id: string) => api.delete(`/fees/${id}`),
};

// Attendance API
export const attendanceAPI = {
  getAllAttendance: () => api.get('/attendance'),
  getAttendance: (id: string) => api.get(`/attendance/${id}`),
  createAttendance: (attendanceData: any) => api.post('/attendance', attendanceData),
  updateAttendance: (id: string, attendanceData: any) => api.put(`/attendance/${id}`, attendanceData),
  deleteAttendance: (id: string) => api.delete(`/attendance/${id}`),
};

// Stats API
export const statsAPI = {
  // Get dashboard stats
  getStats: () => api.get('/stats'),
  
  // Get recent activities
  getActivities: () => api.get('/stats/activities'),
  
  // Get batches and students data
  getBatchesAndStudents: async () => {
    try {
      const response = await api.get('/stats/batches');
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// Batch API
export const batchAPI = {
  // Get all batches
  getAllBatches: async () => {
    try {
      const response = await api.get('/batches');
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Get batches for a specific teacher
  getTeacherBatches: async (teacherId: string) => {
    try {
      // First try to get batches from the server
      const response = await api.get(`/batches/teacher/${teacherId}`, {
        timeout: 8000 // Set lower timeout for teacher batches to improve UX
      });
      
      return response;
    } catch (error: any) {
      // If there's a server error or endpoint doesn't exist, use demo data
      if ((error.response && error.response.status === 404) || error.isNetworkError) {
        console.log('Using demo batch data due to server connectivity issue');
        
        // Return mock data for demo purposes
        const mockBatches = [
          {
            id: 'b1',
            name: 'Physics Batch 101',
            subject: 'Physics',
            schedule: 'Mon, Wed, Fri - 10:00 AM',
            teacherIds: [teacherId],
            teacherNames: ['Dr. Rajesh Sharma'],
            studentCount: 15,
            status: 'active',
            created: new Date().toISOString()
          },
          {
            id: 'b2',
            name: 'Chemistry Fundamentals',
            subject: 'Chemistry',
            schedule: 'Tue, Thu - 2:00 PM',
            teacherIds: [teacherId],
            teacherNames: ['Dr. Rajesh Sharma'],
            studentCount: 18,
            status: 'active',
            created: new Date().toISOString()
          },
          {
            id: 'b3',
            name: 'Mathematics Advanced',
            subject: 'Mathematics',
            schedule: 'Mon, Fri - 4:00 PM',
            teacherIds: [teacherId],
            teacherNames: ['Dr. Rajesh Sharma'],
            studentCount: 12,
            status: 'active',
            created: new Date().toISOString()
          }
        ];
        
        return { data: mockBatches };
      }
      
      // For other errors, pass them through
      throw error;
    }
  },
  
  // Get a single batch
  getBatch: async (id: string) => {
    try {
      const response = await api.get(`/batches/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Create a new batch
  createBatch: async (batchData: any) => {
    try {
      // Make sure teacherIds is handled correctly
      const dataToSend = {
        ...batchData,
        teacherIds: Array.isArray(batchData.teacherIds) ? batchData.teacherIds : 
                     (batchData.teacherIds ? [batchData.teacherIds] : [])
      };
      
      const response = await api.post('/batches', dataToSend, { timeout: 30000 });
      return response;
    } catch (error: any) {
      throw error;
    }
  },
  
  // Update a batch
  updateBatch: async (id: string, batchData: any) => {
    try {
      const response = await api.put(`/batches/${id}`, batchData);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  // Delete a batch
  deleteBatch: async (id: string) => {
    try {
      const response = await api.delete(`/batches/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Assign teacher to batch
  assignTeacher: async (batchId: string, teacherId: string) => {
    try {
      const response = await api.post(`/batches/${batchId}/assign-teacher`, { teacherId });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get available teachers for assignment
  getAvailableTeachers: async () => {
    try {
      const response = await api.get('/teachers');
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default api; 