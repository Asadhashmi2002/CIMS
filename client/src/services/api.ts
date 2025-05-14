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
  getAllTeachers: () => api.get('/teachers'),
  
  // Get a single teacher
  getTeacher: (id: string) => api.get(`/teachers/${id}`),
  
  // Create a new teacher
  createTeacher: (teacherData: any) => api.post('/teachers', teacherData),
  
  // Update a teacher
  updateTeacher: (id: string, teacherData: any) => api.put(`/teachers/${id}`, teacherData),
  
  // Delete a teacher
  deleteTeacher: (id: string) => api.delete(`/teachers/${id}`)
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

export default api; 