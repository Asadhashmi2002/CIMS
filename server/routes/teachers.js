const express = require('express');
const router = express.Router();

// Sample data
const teachers = [
  { id: '2', name: 'John Doe', email: 'john@example.com', role: 'teacher' },
  { id: '3', name: 'Jane Smith', email: 'jane@example.com', role: 'teacher' },
  { id: '4', name: 'Teacher Demo', email: 'teacher@example.com', role: 'teacher' }
];

// Get all teachers
router.get('/', (req, res) => {
  res.json(teachers);
});

// Get a single teacher
router.get('/:id', (req, res) => {
  const teacher = teachers.find(t => t.id === req.params.id);
  if (teacher) {
    res.json(teacher);
  } else {
    res.status(404).json({ message: 'Teacher not found' });
  }
});

// Create a new teacher
router.post('/', (req, res) => {
  const newTeacher = {
    id: Date.now().toString(),
    ...req.body
  };
  teachers.push(newTeacher);
  res.status(201).json(newTeacher);
});

// Update a teacher
router.put('/:id', (req, res) => {
  const index = teachers.findIndex(t => t.id === req.params.id);
  if (index !== -1) {
    teachers[index] = { ...teachers[index], ...req.body };
    res.json(teachers[index]);
  } else {
    res.status(404).json({ message: 'Teacher not found' });
  }
});

// Delete a teacher
router.delete('/:id', (req, res) => {
  const index = teachers.findIndex(t => t.id === req.params.id);
  if (index !== -1) {
    const deletedTeacher = teachers.splice(index, 1)[0];
    res.json(deletedTeacher);
  } else {
    res.status(404).json({ message: 'Teacher not found' });
  }
});

// Teacher login endpoint
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  console.log('Teacher login attempt:', { email, password });
  
  // Sample data
  const users = [
    { id: '1', name: 'Admin User', email: 'admin@example.com', password: 'admin123', role: 'admin' },
    { id: '2', name: 'John Doe', email: 'john@example.com', password: 'john123', role: 'teacher' },
    { id: '3', name: 'Jane Smith', email: 'jane@example.com', password: 'jane123', role: 'teacher' },
    { id: '4', name: 'Teacher Demo', email: 'teacher@example.com', password: 'teacher123', role: 'teacher' }
  ];
  
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

module.exports = router; 