import express from 'express';

const router = express.Router();

// Mock teacher list with inline types including passwords for demo
const teachers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', password: 'john123', subject: 'Mathematics' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', password: 'jane123', subject: 'Physics' },
  { id: '3', name: 'Teacher Demo', email: 'teacher@example.com', password: 'teacher123', subject: 'Chemistry' }
];

// Login endpoint for teachers
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  console.log('Teacher login attempt:', { email, passwordProvided: !!password });
  console.log('Available teachers:', teachers.map(t => ({ email: t.email, password: t.password })));
  
  const teacher = teachers.find(t => t.email === email && t.password === password);
  
  if (teacher) {
    // Create a copy of the teacher object without the password
    const { password, ...teacherData } = teacher;
    
    console.log('Teacher login successful for:', email);
    
    // Return success with token (simulated)
    res.json({
      message: 'Login successful',
      token: 'demo-jwt-token-' + Date.now(),
      user: {
        ...teacherData,
        role: 'teacher'
      }
    });
  } else {
    console.log('Teacher login failed for:', email);
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

// Get all teachers
router.get('/', (req, res) => {
  // Return teachers without passwords
  const safeTeachers = teachers.map(({ password, ...teacher }) => teacher);
  res.json(safeTeachers);
});

// Get teacher by id
router.get('/:id', (req, res) => {
  const teacher = teachers.find(t => t.id === req.params.id);
  if (teacher) {
    // Return teacher without password
    const { password, ...safeTeacher } = teacher;
    res.json(safeTeacher);
  } else {
    res.status(404).json({ message: 'Teacher not found' });
  }
});

// Create teacher
router.post('/', (req, res) => {
  // Just return a success response for now
  res.status(201).json({ 
    message: 'Teacher created successfully',
    teacher: { id: '4', ...req.body, password: undefined }
  });
});

// Update teacher
router.put('/:id', (req, res) => {
  // Just return a success response for now
  const { password, ...safeData } = req.body;
  res.status(200).json({
    message: 'Teacher updated successfully',
    teacher: { id: req.params.id, ...safeData }
  });
});

// Delete teacher
router.delete('/:id', (req, res) => {
  res.status(200).json({ message: 'Teacher deleted successfully' });
});

export default router; 