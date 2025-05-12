import express from 'express';
import {
  createFeeEntry,
  recordFeePayment,
  getFeeById,
  getStudentFees,
  generateFeeReceipt,
  getPendingFees,
  getOverdueFees
} from '../controllers/fee';
import { auth, authorize } from '../middleware/auth';

const router = express.Router();

// Create fee entry (admin only)
router.post('/', auth, authorize(['admin']), createFeeEntry);

// Record fee payment
router.post('/payment', auth, authorize(['admin']), recordFeePayment);

// Get fee by ID
router.get('/:id', auth, getFeeById);

// Get student fees
router.get('/student/:studentId', auth, getStudentFees);

// Generate fee receipt
router.get('/receipt/:feeId', auth, generateFeeReceipt);

// Get pending fees
router.get('/status/pending', auth, authorize(['admin', 'teacher']), getPendingFees);

// Get overdue fees
router.get('/status/overdue', auth, authorize(['admin', 'teacher']), getOverdueFees);

export default router; 