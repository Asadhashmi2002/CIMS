import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

// Admin role check middleware
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
  
  next();
};

// Teacher role check middleware
export const isTeacher = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Teacher role required.' });
  }
  
  next();
};

// Middleware to check if user is an admin
export const isAdminOld = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // @ts-ignore - userId is added by auth middleware
    const userId = req.userId;
    
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    if (user.role !== 'admin') {
      res.status(403).json({ message: 'Access denied. Admin role required.' });
      return;
    }
    
    next();
  } catch (error) {
    console.error('Role check error:', error);
    res.status(500).json({ message: 'Server error checking user role' });
  }
}; 