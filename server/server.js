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

// Enable CORS with more permissive configuration
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    // Allow specific origins
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5000',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5000'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, true); // Still allow it in development, but log it
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Additional headers to handle various proxy/firewall issues
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  
  // Log API requests in development for debugging
  if (process.env.NODE_ENV !== 'production') {
    console.log(`${req.method} ${req.originalUrl}`);
  }
  
  // Handle OPTIONS method
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  
  next();
});

// Parse JSON requests
app.use(express.json());

// Global error handler for API routes
const apiErrorHandler = (err, req, res, next) => {
  console.error('API Error:', err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

// Use route files
app.use('/api/auth', authRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/stats', statsRoutes);

// Apply error handler after routes
app.use('/api', apiErrorHandler);

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

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../client/build');
  app.use(express.static(clientBuildPath));
  
  // Serve index.html for any request not handled by the API or static files
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    }
  });
}

// Start server if running directly (not imported)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
    console.log('Available demo accounts:');
    console.log('- Admin: admin@example.com / admin123');
    console.log('- Teacher: teacher@example.com / teacher123');
  });
}

// Export app for serverless functions
module.exports = app; 