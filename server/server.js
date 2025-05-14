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

// Use route files
app.use('/api/auth', authRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/stats', statsRoutes);

// Handle undefined API routes
app.all('/api/*', (req, res) => {
  res.status(404).json({ message: `API endpoint not found: ${req.path}` });
});

// Only respond with API info if explicitly requesting /api
app.get('/api', (req, res) => {
  res.json({
    message: 'API is working',
    endpoints: [
      '/api/auth',
      '/api/teachers',
      '/api/students',
      '/api/batches',
      '/api/fees',
      '/api/attendance',
      '/api/stats'
    ],
    defaultCredentials: {
      admin: { email: 'admin@example.com', password: 'admin123' },
      teacher: { email: 'teacher@example.com', password: 'teacher123' }
    }
  });
});

// For requests to the root that don't match any of the above routes,
// defer to the static file handling in Vercel config
// (Allows the client SPA to be served)

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  console.log('Available demo accounts:');
  console.log('- Admin: admin@example.com / admin123');
  console.log('- Teacher: teacher@example.com / teacher123');
}); 