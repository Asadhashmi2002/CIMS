const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// JWT Secret (in production, this would be in environment variables)
const JWT_SECRET = 'your-jwt-secret-key-here';

// Sample data - will add password hashes as teachers are created
const teachers = [
  { id: '2', name: 'John Doe', email: 'john@example.com', role: 'teacher', phone: '+91 9876543210', subject: 'Physics', joiningDate: '2023-05-15', status: 'active', passwordHash: '$2a$10$X9YIAq.sMYTLSq.jO3pYA.YZ1K3m3Axt7SgvfNQBHSMtjDVdexeiO' }, // password: john123
  { id: '3', name: 'Jane Smith', email: 'jane@example.com', role: 'teacher', phone: '+91 9876543211', subject: 'Chemistry', joiningDate: '2023-04-10', status: 'active', passwordHash: '$2a$10$O62ZYDQmm7YBf9xDnAz.5OG3MBNB5qH3DMnZK08kRg.zZ7eeJWKua' }, // password: jane123
  { id: '4', name: 'Teacher Demo', email: 'teacher@example.com', role: 'teacher', phone: '+91 9876543212', subject: 'Mathematics', joiningDate: '2023-03-20', status: 'active', passwordHash: '$2a$10$ZFd4mghblG.s4Xm9UyJBNeTOmKLGgEIRKfOHoqf8TMEkNVTb0GIPS' } // password: teacher123
];

// Get all teachers - don't expose password hashes in response
router.get('/', (req, res) => {
  const sanitizedTeachers = teachers.map(({ passwordHash, ...rest }) => rest);
  res.json(sanitizedTeachers);
});

// Get a single teacher - don't expose password hash
router.get('/:id', (req, res) => {
  const teacher = teachers.find(t => t.id === req.params.id);
  if (teacher) {
    const { passwordHash, ...sanitizedTeacher } = teacher;
    res.json(sanitizedTeacher);
  } else {
    res.status(404).json({ message: 'Teacher not found' });
  }
});

// Create a new teacher with password hashing
router.post('/', async (req, res) => {
  try {
    // Basic validation
    const { email, password } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }
    
    // Check if email already exists
    const existingTeacher = teachers.find(t => t.email === email);
    if (existingTeacher) {
      return res.status(400).json({ message: 'A teacher with this email already exists' });
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    // Create new teacher with default values for missing fields
    const newTeacher = {
      id: Date.now().toString(),
      name: req.body.name || '',
      email: email,
      phone: req.body.phone || '+91 ',
      subject: req.body.subject || '',
      joiningDate: req.body.joiningDate || new Date().toISOString().split('T')[0],
      status: req.body.status || 'active',
      role: 'teacher',
      passwordHash: passwordHash
    };
    
    teachers.push(newTeacher);
    
    // Create a sanitized version without the passwordHash
    const { passwordHash: _, ...sanitizedTeacher } = newTeacher;
    
    // Success response
    res.status(201).json({ 
      message: 'Teacher created successfully',
      teacher: sanitizedTeacher 
    });
  } catch (error) {
    console.error('Error creating teacher:', error);
    res.status(500).json({ message: 'Failed to create teacher. Please try again.' });
  }
});

// Update a teacher - handle password updates securely
router.put('/:id', async (req, res) => {
  try {
    const index = teachers.findIndex(t => t.id === req.params.id);
    if (index !== -1) {
      // Check if trying to update to an email that already exists
      if (req.body.email && req.body.email !== teachers[index].email) {
        const existingTeacher = teachers.find(t => t.email === req.body.email);
        if (existingTeacher) {
          return res.status(400).json({ message: 'A teacher with this email already exists' });
        }
      }
      
      // Handle password update if provided
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(req.body.password, salt);
        
        // Remove plain text password from req.body
        const { password, ...dataWithoutPassword } = req.body;
        
        // Update teacher with new password hash
        teachers[index] = { 
          ...teachers[index], 
          ...dataWithoutPassword,
          passwordHash 
        };
      } else {
        // Update without changing password
        teachers[index] = { ...teachers[index], ...req.body };
      }
      
      // Return sanitized teacher object (without passwordHash)
      const { passwordHash, ...sanitizedTeacher } = teachers[index];
      
      res.json({ 
        message: 'Teacher updated successfully',
        teacher: sanitizedTeacher 
      });
    } else {
      res.status(404).json({ message: 'Teacher not found' });
    }
  } catch (error) {
    console.error('Error updating teacher:', error);
    res.status(500).json({ message: 'Failed to update teacher. Please try again.' });
  }
});

// Delete a teacher
router.delete('/:id', (req, res) => {
  try {
    const index = teachers.findIndex(t => t.id === req.params.id);
    if (index !== -1) {
      // Get a copy without the passwordHash before removing
      const { passwordHash, ...sanitizedTeacher } = teachers[index];
      teachers.splice(index, 1);
      
      res.json({ 
        message: 'Teacher deleted successfully',
        teacher: sanitizedTeacher 
      });
    } else {
      res.status(404).json({ message: 'Teacher not found' });
    }
  } catch (error) {
    console.error('Error deleting teacher:', error);
    res.status(500).json({ message: 'Failed to delete teacher. Please try again.' });
  }
});

// Teacher login endpoint with proper authentication
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Teacher login attempt for:', email);
    
    // Find teacher by email
    const teacher = teachers.find(t => t.email === email && t.role === 'teacher');
    
    if (!teacher) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Compare password with stored hash
    const isMatch = await bcrypt.compare(password, teacher.passwordHash);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Create a copy of the teacher object without the password hash
    const { passwordHash, ...teacherData } = teacher;
    
    // Generate JWT token
    const token = jwt.sign(
      { id: teacher.id, email: teacher.email, role: 'teacher' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    console.log('Teacher login successful for:', email);
    
    // Return success with token
    res.json({
      message: 'Login successful',
      token: token,
      teacher: teacherData
    });
  } catch (error) {
    console.error('Teacher login error:', error);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
});

module.exports = router; 