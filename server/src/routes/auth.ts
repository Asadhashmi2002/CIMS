import express from 'express';

const router = express.Router();

// Mock users for demo login
const users = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', password: 'admin123', role: 'admin' },
  { id: '2', name: 'John Doe', email: 'john@example.com', password: 'john123', role: 'teacher' },
  { id: '3', name: 'Jane Smith', email: 'jane@example.com', password: 'jane123', role: 'teacher' },
  { id: '4', name: 'Teacher Demo', email: 'teacher@example.com', password: 'teacher123', role: 'teacher' }
];

// Login endpoint
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  console.log('Login attempt:', { email, passwordProvided: !!password });
  
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

// Get current user (profile)
router.get('/me', (req, res) => {
  // For demo purposes, we'll just return a mock user based on the token
  // In a real app, this would be extracted from JWT token
  
  // Pretend we validated the token...
  const mockUser = {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin'
  };
  
  res.json({ user: mockUser });
});

// Register user (just a placeholder, returns success)
router.post('/register', (req, res) => {
  res.status(201).json({
    message: 'User registered successfully',
    user: {
      id: 'new-id',
      name: req.body.name || 'New User',
      email: req.body.email,
      role: req.body.role || 'teacher'
    }
  });
});

// Change password (placeholder)
router.post('/change-password', (req, res) => {
  res.json({ message: 'Password changed successfully' });
});

export default router; 