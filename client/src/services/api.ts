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
  timeout: 10000
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
    return config;
  },
  (error) => {
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
      const response = await api.get(`/batches/teacher/${teacherId}`);
      return response;
    } catch (error) {
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