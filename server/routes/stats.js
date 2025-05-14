const express = require('express');
const router = express.Router();

// Get dashboard stats
router.get('/', (req, res) => {
  // In a real app, this would be calculated from the database
  res.json({
    totalStudents: 0,
    totalTeachers: 3,
    totalBatches: 0,
    totalFees: 0
  });
});

// Get recent activities
router.get('/activities', (req, res) => {
  // In a real app, this would be fetched from the database
  res.json([
    {
      id: '1',
      type: 'login',
      user: 'Teacher Demo',
      timestamp: new Date().toISOString()
    }
  ]);
});

// Get batches and students data
router.get('/batches', (req, res) => {
  // In a real app, this would be fetched from the database
  res.json({
    batches: [],
    students: []
  });
});

module.exports = router; 