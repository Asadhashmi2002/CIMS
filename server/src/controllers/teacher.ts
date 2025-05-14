import { Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/User';
import Teacher from '../models/Teacher';
import bcrypt from 'bcryptjs';

// Get all teachers
export const getAllTeachers = async (req: Request, res: Response) => {
  try {
    const teachers = await Teacher.find().populate('user', '-password');
    return res.status(200).json(teachers);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return res.status(500).json({ message: 'Server error while fetching teachers' });
  }
};

// Get a specific teacher by ID
export const getTeacher = async (req: Request, res: Response) => {
  try {
    const teacher = await Teacher.findById(req.params.id).populate('user', '-password');
    
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    
    return res.status(200).json(teacher);
  } catch (error) {
    console.error('Error fetching teacher:', error);
    return res.status(500).json({ message: 'Server error while fetching teacher' });
  }
};

// Create a new teacher
export const createTeacher = async (req: Request, res: Response) => {
  const { name, email, phone, subject, joiningDate, status, password } = req.body;
  
  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    // Create user first
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name: name || 'Teacher',
      email,
      password: hashedPassword,
      role: 'teacher',
      phone: phone || ''
    });
    
    await user.save();
    
    // Create teacher with reference to user
    const teacher = new Teacher({
      name,
      phone,
      subject,
      joiningDate,
      status,
      user: user._id
    });
    
    await teacher.save();
    
    // Return the teacher with user info (excluding password)
    const populatedTeacher = await Teacher.findById(teacher._id).populate('user', '-password');
    
    return res.status(201).json({ 
      message: 'Teacher created successfully',
      teacher: populatedTeacher
    });
  } catch (error) {
    console.error('Error creating teacher:', error);
    return res.status(500).json({ message: 'Server error while creating teacher' });
  }
};

// Update a teacher
export const updateTeacher = async (req: Request, res: Response) => {
  const { name, email, phone, subject, joiningDate, status, password } = req.body;
  
  try {
    // Find the teacher
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    
    // Update teacher fields
    if (name) teacher.name = name;
    if (phone) teacher.phone = phone;
    if (subject) teacher.subject = subject;
    if (joiningDate) teacher.joiningDate = joiningDate;
    if (status) teacher.status = status;
    
    await teacher.save();
    
    // If email or password is being updated, update the User document
    if (email || password) {
      const userId = teacher.user;
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User account for teacher not found' });
      }
      
      if (email) user.email = email;
      if (password) user.password = await bcrypt.hash(password, 10);
      
      await user.save();
    }
    
    // Return updated teacher with user info
    const updatedTeacher = await Teacher.findById(req.params.id).populate('user', '-password');
    
    return res.status(200).json({
      message: 'Teacher updated successfully',
      teacher: updatedTeacher
    });
  } catch (error) {
    console.error('Error updating teacher:', error);
    return res.status(500).json({ message: 'Server error while updating teacher' });
  }
};

// Delete a teacher
export const deleteTeacher = async (req: Request, res: Response) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    
    // Get the user ID from the teacher
    const userId = teacher.user;
    
    // Delete the teacher
    await Teacher.findByIdAndDelete(req.params.id);
    
    // Delete the associated user
    await User.findByIdAndDelete(userId);
    
    return res.status(200).json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    return res.status(500).json({ message: 'Server error while deleting teacher' });
  }
}; 