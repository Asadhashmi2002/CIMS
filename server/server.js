const express = require('express');
const cors = require('cors');
const path = require('path');

// Create Express app
const app = express();
const PORT = 5000;

// Sample data
const users = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', password: 'admin123', role: 'admin' },
  { id: '2', name: 'John Doe', email: 'john@example.com', password: 'john123', role: 'teacher' },
  { id: '3', name: 'Jane Smith', email: 'jane@example.com', password: 'jane123', role: 'teacher' },
  { id: '4', name: 'Teacher Demo', email: 'teacher@example.com', password: 'teacher123', role: 'teacher' }
];

// Enable CORS for all origins in development
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// Parse JSON requests
app.use(express.json());

// Simple health check endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'API is working',
    defaultCredentials: {
      admin: { email: 'admin@example.com', password: 'admin123' },
      teacher: { email: 'teacher@example.com', password: 'teacher123' }
    }
  });
});

// Auth login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  console.log('Login attempt:', { email, password });
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    // Create a copy of the user object without the password
    const { password, ...userData } = user;
    
    console.log('Login successful for:', email);
    
    // Return success with token (simulated)
    res.json({
      message: 'Login successful',
      token: 'demo-jwt-token-' + Date.now(),
      user: userData
    });
  } else {
    console.log('Login failed for:', email);
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

// Teacher login endpoint
app.post('/api/teachers/login', (req, res) => {
  const { email, password } = req.body;
  
  console.log('Teacher login attempt:', { email, password });
  
  const teacher = users.find(u => u.email === email && u.password === password && u.role === 'teacher');
  
  if (teacher) {
    // Create a copy of the user object without the password
    const { password, ...teacherData } = teacher;
    
    console.log('Teacher login successful for:', email);
    
    // Return success with token (simulated)
    res.json({
      message: 'Login successful',
      token: 'demo-jwt-token-' + Date.now(),
      user: teacherData
    });
  } else {
    console.log('Teacher login failed for:', email);
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  console.log('Available demo accounts:');
  console.log('- Admin: admin@example.com / admin123');
  console.log('- Teacher: teacher@example.com / teacher123');
}); 