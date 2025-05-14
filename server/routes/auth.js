const express = require('express');
const router = express.Router();

// Sample data
const users = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', password: 'admin123', role: 'admin' },
  { id: '2', name: 'John Doe', email: 'john@example.com', password: 'john123', role: 'teacher' },
  { id: '3', name: 'Jane Smith', email: 'jane@example.com', password: 'jane123', role: 'teacher' },
  { id: '4', name: 'Teacher Demo', email: 'teacher@example.com', password: 'teacher123', role: 'teacher' }
];

// Login route
router.post('/login', (req, res) => {
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

// Register route
router.post('/register', (req, res) => {
  // This would typically create a new user in the database
  // For demo purposes, we'll just return a success message
  res.status(201).json({
    message: 'Registration successful',
    user: {
      id: 'new-user-' + Date.now(),
      name: req.body.name,
      email: req.body.email,
      role: req.body.role || 'user'
    }
  });
});

module.exports = router; 