import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Fee from '../models/Fee';
import Student from '../models/Student';
import Batch from '../models/Batch';
import User from '../models/User';
import Parent from '../models/Parent';
import { sendFeeReceiptEmail } from '../services/notification';

// Generate a unique receipt number
const generateReceiptNumber = async (): Promise<string> => {
  const prefix = 'RCPT';
  const date = new Date();
  const year = date.getFullYear().toString().substr(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  
  // Get count of receipts for this month to generate sequential number
  const count = await Fee.countDocuments({
    createdAt: {
      $gte: new Date(date.getFullYear(), date.getMonth(), 1),
      $lt: new Date(date.getFullYear(), date.getMonth() + 1, 1),
    },
  });
  
  const sequentialNumber = (count + 1).toString().padStart(4, '0');
  return `${prefix}-${year}${month}${sequentialNumber}`;
};

// Create a new fee entry
export const createFeeEntry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId, batchId, amount, dueDate, month, year } = req.body;
    
    // Validate if student and batch exist
    const student = await Student.findById(studentId);
    const batch = await Batch.findById(batchId);
    
    if (!student) {
      res.status(404).json({ message: 'Student not found' });
      return;
    }
    
    if (!batch) {
      res.status(404).json({ message: 'Batch not found' });
      return;
    }
    
    // Check if a fee entry already exists for this student, batch, month, and year
    const existingFee = await Fee.findOne({
      studentId,
      batchId,
      month,
      year,
    });
    
    if (existingFee) {
      res.status(400).json({ message: 'Fee entry already exists for this student, batch, month, and year' });
      return;
    }
    
    // Generate receipt number
    const receiptNumber = await generateReceiptNumber();
    
    // Create fee entry
    const fee = await Fee.create({
      studentId,
      batchId,
      amount,
      dueDate: new Date(dueDate),
      status: 'pending',
      receiptNumber,
      month,
      year,
    });
    
    res.status(201).json({
      message: 'Fee entry created successfully',
      fee,
    });
  } catch (error) {
    console.error('Create fee entry error:', error);
    res.status(500).json({ message: 'Server error while creating fee entry' });
  }
};

// Record fee payment
export const recordFeePayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { feeId, paymentMethod, transactionId } = req.body;
    
    // Find fee entry
    const fee = await Fee.findById(feeId);
    
    if (!fee) {
      res.status(404).json({ message: 'Fee entry not found' });
      return;
    }
    
    if (fee.status === 'paid') {
      res.status(400).json({ message: 'Fee is already paid' });
      return;
    }
    
    // Update fee status
    fee.status = 'paid';
    fee.paidDate = new Date();
    fee.paymentMethod = paymentMethod;
    fee.transactionId = transactionId;
    fee.receiptGeneratedAt = new Date();
    
    await fee.save();
    
    // Get student and batch details for email
    const student = await Student.findById(fee.studentId);
    const batch = await Batch.findById(fee.batchId);
    
    if (!student || !student.parentId) {
      res.status(200).json({
        message: 'Fee payment recorded successfully, but could not send notification (parent info missing)',
        fee,
      });
      return;
    }
    
    // Get parent email
    const parent = await Parent.findById(student.parentId);
    
    if (!parent || !parent.userId) {
      res.status(200).json({
        message: 'Fee payment recorded successfully, but could not send notification (parent user info missing)',
        fee,
      });
      return;
    }
    
    // Get parent user for email address
    const parentUser = await User.findById(parent.userId);
    
    if (student && batch && parentUser) {
      // Send fee receipt email
      await sendFeeReceiptEmail(
        parentUser.email,
        student.name,
        {
          receiptNumber: fee.receiptNumber,
          amount: fee.amount,
          paidDate: fee.paidDate!,
          batchName: batch.name,
          month: fee.month,
          year: fee.year,
          paymentMethod: fee.paymentMethod!,
          transactionId: fee.transactionId,
        }
      );
    }
    
    res.status(200).json({
      message: 'Fee payment recorded successfully',
      fee,
    });
  } catch (error) {
    console.error('Record fee payment error:', error);
    res.status(500).json({ message: 'Server error while recording fee payment' });
  }
};

// Get fee details by ID
export const getFeeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const fee = await Fee.findById(id)
      .populate('studentId', 'name rollNumber grade')
      .populate('batchId', 'name subject');
    
    if (!fee) {
      res.status(404).json({ message: 'Fee entry not found' });
      return;
    }
    
    res.status(200).json({ fee });
  } catch (error) {
    console.error('Get fee error:', error);
    res.status(500).json({ message: 'Server error while fetching fee details' });
  }
};

// Get all fees for a student
export const getStudentFees = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId } = req.params;
    
    const fees = await Fee.find({ studentId })
      .populate('batchId', 'name subject')
      .sort({ dueDate: -1 });
    
    // Get student details
    const student = await Student.findById(studentId);
    
    res.status(200).json({ 
      student: student ? {
        id: student._id,
        name: student.name,
        grade: student.grade,
        rollNumber: student.rollNumber
      } : null,
      fees 
    });
  } catch (error) {
    console.error('Get student fees error:', error);
    res.status(500).json({ message: 'Server error while fetching student fees' });
  }
};

// Generate fee receipt
export const generateFeeReceipt = async (req: Request, res: Response): Promise<void> => {
  try {
    const { feeId } = req.params;
    
    const fee = await Fee.findById(feeId)
      .populate('studentId', 'name rollNumber grade parentId')
      .populate('batchId', 'name subject');
    
    if (!fee) {
      res.status(404).json({ message: 'Fee entry not found' });
      return;
    }
    
    if (fee.status !== 'paid') {
      res.status(400).json({ message: 'Cannot generate receipt for unpaid fee' });
      return;
    }
    
    // Get parent info if available
    let parentInfo = null;
    if (fee.studentId && (fee.studentId as any).parentId) {
      const parentId = (fee.studentId as any).parentId;
      const parent = await Parent.findById(parentId).populate('userId', 'name email phone');
      if (parent && parent.userId) {
        parentInfo = {
          name: (parent.userId as any).name,
          email: (parent.userId as any).email,
          phone: (parent.userId as any).phone,
        };
      }
    }
    
    // Format the receipt data
    const receiptData = {
      receiptNumber: fee.receiptNumber,
      generatedAt: fee.receiptGeneratedAt || new Date(),
      student: {
        name: (fee.studentId as any).name,
        rollNumber: (fee.studentId as any).rollNumber,
        grade: (fee.studentId as any).grade,
        id: fee.studentId,
      },
      parent: parentInfo,
      batch: {
        name: (fee.batchId as any).name,
        subject: (fee.batchId as any).subject,
      },
      fee: {
        amount: fee.amount,
        month: fee.month,
        year: fee.year,
        paidDate: fee.paidDate,
        paymentMethod: fee.paymentMethod,
        transactionId: fee.transactionId,
      },
      institute: {
        name: 'Your Coaching Institute',
        address: '123 Education Lane, Learning City',
        contact: '+91 98765 43210',
        email: 'info@yourcoaching.com',
      },
    };
    
    res.status(200).json({
      message: 'Fee receipt generated successfully',
      receipt: receiptData,
    });
  } catch (error) {
    console.error('Generate fee receipt error:', error);
    res.status(500).json({ message: 'Server error while generating fee receipt' });
  }
};

// Get pending fees
export const getPendingFees = async (req: Request, res: Response): Promise<void> => {
  try {
    const fees = await Fee.find({ status: 'pending' })
      .populate('studentId', 'name rollNumber grade')
      .populate('batchId', 'name subject')
      .sort({ dueDate: 1 });
    
    res.status(200).json({ fees });
  } catch (error) {
    console.error('Get pending fees error:', error);
    res.status(500).json({ message: 'Server error while fetching pending fees' });
  }
};

// Get overdue fees
export const getOverdueFees = async (req: Request, res: Response): Promise<void> => {
  try {
    const today = new Date();
    
    const fees = await Fee.find({
      status: 'pending',
      dueDate: { $lt: today },
    })
      .populate('studentId', 'name rollNumber grade')
      .populate('batchId', 'name subject')
      .sort({ dueDate: 1 });
    
    // Update status to overdue
    for (const fee of fees) {
      fee.status = 'overdue';
      await fee.save();
    }
    
    res.status(200).json({ fees });
  } catch (error) {
    console.error('Get overdue fees error:', error);
    res.status(500).json({ message: 'Server error while fetching overdue fees' });
  }
}; 