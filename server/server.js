const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const teacherRoutes = require('./routes/teachers');
const studentRoutes = require('./routes/students');
const batchRoutes = require('./routes/batches');
const feeRoutes = require('./routes/fees');
const attendanceRoutes = require('./routes/attendance');
const statsRoutes = require('./routes/stats');

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

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

// Use route files
app.use('/api/auth', authRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/stats', statsRoutes);

// For Vercel deployment - handle SPA routing
if (process.env.NODE_ENV === 'production') {
  // Serve static files
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    }
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  console.log('Available demo accounts:');
  console.log('- Admin: admin@example.com / admin123');
  console.log('- Teacher: teacher@example.com / teacher123');
}); 