import axios from 'axios';

// Create an axios instance with base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Add some debugging
console.log('API Base URL:', API_BASE_URL);

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
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`);
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
    console.error('Request intercept error:', error);
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
    console.log('Fetching all teachers...');
    try {
      const response = await api.get('/teachers');
      console.log('Teachers fetched successfully:', response.data);
      return response;
    } catch (error) {
      console.error('Error fetching teachers:', error);
      throw error;
    }
  },
  
  // Get a single teacher
  getTeacher: async (id: string) => {
    try {
      const response = await api.get(`/teachers/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching teacher ${id}:`, error);
      throw error;
    }
  },
  
  // Create a new teacher
  createTeacher: async (teacherData: any) => {
    console.log('Creating new teacher with data:', { 
      ...teacherData, 
      password: teacherData.password ? '********' : undefined 
    });
    try {
      const response = await api.post('/teachers', teacherData);
      console.log('Teacher created successfully:', response.data);
      return response;
    } catch (error: any) {
      console.error('Error creating teacher:', error.response?.data || error.message || error);
      throw error;
    }
  },
  
  // Update a teacher
  updateTeacher: async (id: string, teacherData: any) => {
    try {
      const response = await api.put(`/teachers/${id}`, teacherData);
      console.log('Teacher updated successfully:', response.data);
      return response;
    } catch (error) {
      console.error(`Error updating teacher ${id}:`, error);
      throw error;
    }
  },
  
  // Delete a teacher
  deleteTeacher: async (id: string) => {
    try {
      const response = await api.delete(`/teachers/${id}`);
      console.log('Teacher deleted successfully:', id);
      return response;
    } catch (error) {
      console.error(`Error deleting teacher ${id}:`, error);
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
    console.log('Fetching batches and students data...');
    try {
      const response = await api.get('/stats/batches');
      console.log('Batches and students data fetched:', response.data);
      return response;
    } catch (error) {
      console.error('Error fetching batches and students:', error);
      throw error;
    }
  }
};

// Batch API
export const batchAPI = {
  // Get all batches
  getAllBatches: async () => {
    console.log('Fetching all batches...');
    try {
      const response = await api.get('/batches');
      console.log('Batches fetched successfully:', response.data);
      return response;
    } catch (error) {
      console.error('Error fetching batches:', error);
      throw error;
    }
  },
  
  // Get batches for a specific teacher
  getTeacherBatches: async (teacherId: string) => {
    console.log(`Fetching batches for teacher ${teacherId}...`);
    try {
      const response = await api.get(`/batches/teacher/${teacherId}`);
      console.log('Teacher batches fetched successfully:', response.data);
      return response;
    } catch (error) {
      console.error(`Error fetching batches for teacher ${teacherId}:`, error);
      throw error;
    }
  },
  
  // Get a single batch
  getBatch: async (id: string) => {
    try {
      const response = await api.get(`/batches/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching batch ${id}:`, error);
      throw error;
    }
  },
  
  // Create a new batch
  createBatch: async (batchData: any) => {
    console.log('Creating new batch with data:', batchData);
    try {
      // Make sure teacherIds is handled correctly
      const dataToSend = {
        ...batchData,
        teacherIds: Array.isArray(batchData.teacherIds) ? batchData.teacherIds : 
                     (batchData.teacherIds ? [batchData.teacherIds] : [])
      };
      
      console.log('Sending batch data to server:', dataToSend);
      
      // Add an explicit timeout for better debugging
      const response = await api.post('/batches', dataToSend, { timeout: 30000 });
      console.log('Batch created successfully:', response.data);
      return response;
    } catch (error: any) {
      // Enhanced error logging
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Server error response:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response from server, request:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', error.message);
      }
      console.error('Complete error object:', error);
      throw error;
    }
  },
  
  // Update a batch
  updateBatch: async (id: string, batchData: any) => {
    try {
      const response = await api.put(`/batches/${id}`, batchData);
      console.log('Batch updated successfully:', response.data);
      return response;
    } catch (error) {
      console.error(`Error updating batch ${id}:`, error);
      throw error;
    }
  },
  
  // Delete a batch
  deleteBatch: async (id: string) => {
    try {
      const response = await api.delete(`/batches/${id}`);
      console.log('Batch deleted successfully:', id);
      return response;
    } catch (error) {
      console.error(`Error deleting batch ${id}:`, error);
      throw error;
    }
  },

  // Assign teacher to batch
  assignTeacher: async (batchId: string, teacherId: string) => {
    try {
      const response = await api.post(`/batches/${batchId}/assign-teacher`, { teacherId });
      console.log('Teacher assigned to batch successfully:', response.data);
      return response;
    } catch (error) {
      console.error(`Error assigning teacher to batch ${batchId}:`, error);
      throw error;
    }
  },

  // Get available teachers for assignment
  getAvailableTeachers: async () => {
    try {
      // This endpoint doesn't exist - let's use getAllTeachers from teacherAPI instead
      // const response = await api.get('/batches/available-teachers');
      const response = await api.get('/teachers');
      return response;
    } catch (error) {
      console.error('Error fetching available teachers:', error);
      throw error;
    }
  }
};

export default api; 