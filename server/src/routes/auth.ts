import express from 'express';
import { register, login, getCurrentUser, changePassword } from '../controllers/auth';
import { auth } from '../middleware/auth';

const router = express.Router();

// Register a new user
router.post('/register', register);

// Login user
router.post('/login', login);

// Get current user profile (requires authentication)
router.get('/me', auth, getCurrentUser);

// Change password (requires authentication)
router.post('/change-password', auth, changePassword);

export default router; 