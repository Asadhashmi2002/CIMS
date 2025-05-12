import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Attendance from '../models/Attendance';
import Student from '../models/Student';
import User from '../models/User';
import Batch from '../models/Batch';
import Parent from '../models/Parent';
import { sendAbsenceWhatsAppMessage } from '../services/notification';

// Mark attendance for a student
export const markAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId, batchId, status, date } = req.body;
    
    // @ts-ignore - userId is added by auth middleware
    const markedById = req.userId;
    
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
    
    // Create or update attendance record
    const attendanceDate = date ? new Date(date) : new Date();
    
    const existingAttendance = await Attendance.findOne({
      studentId,
      batchId,
      date: {
        $gte: new Date(attendanceDate.setHours(0, 0, 0, 0)),
        $lt: new Date(attendanceDate.setHours(23, 59, 59, 999)),
      },
    });
    
    let attendance;
    
    if (existingAttendance) {
      // Update existing record
      existingAttendance.status = status;
      existingAttendance.markedById = new mongoose.Types.ObjectId(markedById);
      attendance = await existingAttendance.save();
    } else {
      // Create new record
      attendance = await Attendance.create({
        studentId,
        batchId,
        status,
        date: attendanceDate,
        markedById: new mongoose.Types.ObjectId(markedById),
      });
    }
    
    // If student is absent, send WhatsApp notification
    if (status === 'absent' && !attendance.notificationSent) {
      // Get student and parent details
      const studentDetails = await Student.findById(studentId).populate('parentId');
      
      if (studentDetails?.parentId) {
        // Get parent user account for contact information
        // @ts-ignore
        const parentUser = await User.findById(studentDetails.parentId.userId);
        
        // Get batch name
        const batchDetails = await Batch.findById(batchId);
        
        if (parentUser && batchDetails) {
          // Send WhatsApp notification
          const notificationSent = await sendAbsenceWhatsAppMessage(
            parentUser.phone,
            studentDetails.name,
            batchDetails.name,
            attendanceDate
          );
          
          // Update notification sent status
          if (notificationSent) {
            attendance.notificationSent = true;
            await attendance.save();
          }
        }
      }
    }
    
    res.status(200).json({
      message: 'Attendance marked successfully',
      attendance,
    });
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({ message: 'Server error while marking attendance' });
  }
};

// Get attendance by batch and date
export const getAttendanceByBatchAndDate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { batchId, date } = req.query;
    
    if (!batchId || !date) {
      res.status(400).json({ message: 'Batch ID and date are required' });
      return;
    }
    
    const attendanceDate = new Date(date as string);
    
    // Get attendance records
    const attendanceRecords = await Attendance.find({
      batchId,
      date: {
        $gte: new Date(attendanceDate.setHours(0, 0, 0, 0)),
        $lt: new Date(attendanceDate.setHours(23, 59, 59, 999)),
      },
    }).populate('studentId');
    
    // Get all students in the batch
    const batch = await Batch.findById(batchId).populate('studentIds');
    
    if (!batch) {
      res.status(404).json({ message: 'Batch not found' });
      return;
    }
    
    // Create a map of student IDs to their attendance status
    const attendanceMap = new Map();
    attendanceRecords.forEach((record) => {
      // @ts-ignore
      attendanceMap.set(record.studentId._id.toString(), record);
    });
    
    // Create a response including all students
    const attendanceResponse = batch.studentIds.map((student: any) => {
      const studentId = student._id.toString();
      const attendanceRecord = attendanceMap.get(studentId);
      
      return {
        student: {
          id: studentId,
          name: student.name,
        },
        attendance: attendanceRecord ? {
          status: attendanceRecord.status,
          id: attendanceRecord._id,
          notificationSent: attendanceRecord.notificationSent,
        } : {
          status: 'absent', // Default status when no record is found
          notificationSent: false,
        },
      };
    });
    
    res.status(200).json({
      date: date,
      batchId: batchId,
      batchName: batch.name,
      attendance: attendanceResponse,
    });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ message: 'Server error while fetching attendance' });
  }
};

// Get attendance by student for a date range
export const getStudentAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId, startDate, endDate } = req.query;
    
    if (!studentId) {
      res.status(400).json({ message: 'Student ID is required' });
      return;
    }
    
    const queryOptions: any = { studentId };
    
    // Add date range if provided
    if (startDate && endDate) {
      queryOptions.date = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      };
    }
    
    // Get attendance records
    const attendanceRecords = await Attendance.find(queryOptions)
      .populate('batchId', 'name subject')
      .sort({ date: -1 });
    
    // Calculate statistics
    const totalRecords = attendanceRecords.length;
    const presentCount = attendanceRecords.filter(record => record.status === 'present').length;
    const absentCount = attendanceRecords.filter(record => record.status === 'absent').length;
    const leaveCount = attendanceRecords.filter(record => record.status === 'leave').length;
    
    const attendancePercentage = totalRecords > 0 
      ? ((presentCount / totalRecords) * 100).toFixed(2) 
      : '0.00';
    
    // Get student details
    const student = await Student.findById(studentId);
    
    res.status(200).json({
      student: student ? {
        id: student._id,
        name: student.name,
        grade: student.grade,
      } : null,
      startDate,
      endDate,
      statistics: {
        totalClasses: totalRecords,
        present: presentCount,
        absent: absentCount,
        leave: leaveCount,
        attendancePercentage: attendancePercentage,
      },
      records: attendanceRecords,
    });
  } catch (error) {
    console.error('Get student attendance error:', error);
    res.status(500).json({ message: 'Server error while fetching student attendance' });
  }
};

// Get monthly attendance report for a student
export const getMonthlyReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId, month, year } = req.query;
    
    if (!studentId || !month || !year) {
      res.status(400).json({ message: 'Student ID, month, and year are required' });
      return;
    }
    
    const startDate = new Date(parseInt(year as string), parseInt(month as string) - 1, 1);
    const endDate = new Date(parseInt(year as string), parseInt(month as string), 0);
    
    // Get attendance records
    const attendanceRecords = await Attendance.find({
      studentId,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate('batchId', 'name subject');
    
    // Group by batch
    const batchAttendance = new Map<string, { total: number; present: number; batchName: string }>();
    
    attendanceRecords.forEach((record) => {
      // @ts-ignore
      const batchId = record.batchId._id.toString();
      
      if (!batchAttendance.has(batchId)) {
        batchAttendance.set(batchId, {
          // @ts-ignore
          batchName: record.batchId.name,
          total: 0,
          present: 0,
        });
      }
      
      const batch = batchAttendance.get(batchId)!;
      batch.total += 1;
      
      if (record.status === 'present') {
        batch.present += 1;
      }
    });
    
    // Calculate overall statistics
    const totalClasses = attendanceRecords.length;
    const totalPresent = attendanceRecords.filter(record => record.status === 'present').length;
    
    // Convert map to array
    const batchDetails = Array.from(batchAttendance.values()).map(batch => ({
      batchName: batch.batchName,
      totalClasses: batch.total,
      attended: batch.present,
      percentage: batch.total > 0 ? Math.round((batch.present / batch.total) * 100) : 0,
    }));
    
    // Get student details
    const student = await Student.findById(studentId);
    
    res.status(200).json({
      student: student ? {
        id: student._id,
        name: student.name,
        grade: student.grade,
      } : null,
      month: startDate.toLocaleString('default', { month: 'long' }),
      year: parseInt(year as string),
      totalClasses,
      attended: totalPresent,
      percentage: totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0,
      batchDetails,
    });
  } catch (error) {
    console.error('Get monthly report error:', error);
    res.status(500).json({ message: 'Server error while generating monthly report' });
  }
}; 