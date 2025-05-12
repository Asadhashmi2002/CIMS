import express from 'express';
import { 
  markAttendance, 
  getAttendanceByBatchAndDate, 
  getStudentAttendance,
  getMonthlyReport 
} from '../controllers/attendance';
import { auth, authorize } from '../middleware/auth';

const router = express.Router();

// Mark attendance (only teachers and admins)
router.post('/mark', auth, authorize(['teacher', 'admin']), markAttendance);

// Get attendance by batch and date
router.get('/batch', auth, getAttendanceByBatchAndDate);

// Get student attendance
router.get('/student', auth, getStudentAttendance);

// Get monthly attendance report
router.get('/monthly-report', auth, getMonthlyReport);

export default router; 