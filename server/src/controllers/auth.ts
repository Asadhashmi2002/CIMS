import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User, { IUser } from '../models/User';
import Student from '../models/Student';
import Parent from '../models/Parent';
import Teacher from '../models/Teacher';

// Generate JWT token
const generateToken = (userId: string, role: string): string => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: '1d' }
  );
};

// Register user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role, phone, ...additionalInfo } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists with this email' });
      return;
    }

    // Create user
    const newUser = new User({
      name,
      email,
      password,
      role,
      phone,
    });

    // Save user
    const savedUser = await newUser.save();
    const userId = savedUser._id as mongoose.Types.ObjectId;

    // Based on role, create additional profile
    if (role === 'teacher') {
      const { qualification, specialization, experience, joiningDate } = additionalInfo;
      
      const newTeacher = new Teacher({
        userId,
        qualification,
        specialization,
        experience,
        joiningDate: joiningDate ? new Date(joiningDate) : new Date(),
      });
      
      await newTeacher.save();
    } else if (role === 'parent') {
      const { occupation, alternatePhone, address } = additionalInfo;
      
      const newParent = new Parent({
        userId,
        occupation,
        alternatePhone,
        address,
      });
      
      await newParent.save();
      
      // If student details are provided with parent registration
      if (additionalInfo.children && Array.isArray(additionalInfo.children)) {
        const studentIds: mongoose.Types.ObjectId[] = [];
        
        for (const child of additionalInfo.children) {
          const newStudent = new Student({
            userId: null, // Students don't have user accounts anymore
            parentId: newParent._id,
            name: child.name,
            rollNumber: child.rollNumber,
            grade: child.grade,
            address,
            dateOfBirth: new Date(child.dateOfBirth),
          });
          
          const savedStudent = await newStudent.save();
          studentIds.push(savedStudent._id as mongoose.Types.ObjectId);
        }
        
        // Update parent with student IDs
        if (studentIds.length > 0) {
          newParent.studentIds = studentIds;
          await newParent.save();
        }
      }
    }

    // Generate token
    const token = generateToken(userId.toString(), savedUser.role);

    // Return success response
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: userId,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate token
    const userId = user._id as mongoose.Types.ObjectId;
    const token = generateToken(userId.toString(), user.role);

    // Return success response
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get current user profile
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // User is added by auth middleware
    const userId = req.user._id;
    
    // Get user
    const user = await User.findById(userId).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Get role-specific data
    let profileData: any = {};
    
    if (user.role === 'teacher') {
      profileData = await Teacher.findOne({ user: userId });
    } else if (user.role === 'student') {
      // For future implementation
      profileData = {};
    }

    // Return user data
    res.status(200).json({
      user: {
        ...user.toObject(),
        profile: profileData,
      },
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error getting user profile' });
  }
};

// Change password
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // @ts-ignore - userId is added by auth middleware
    const userId = req.userId;
    
    // Get user
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Check current password
    const isPasswordMatch = await user.comparePassword(currentPassword);
    if (!isPasswordMatch) {
      res.status(401).json({ message: 'Current password is incorrect' });
      return;
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error changing password' });
  }
}; 