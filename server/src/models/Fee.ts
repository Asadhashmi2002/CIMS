import mongoose, { Document, Schema } from 'mongoose';

export interface IFee extends Document {
  studentId: mongoose.Types.ObjectId;
  batchId: mongoose.Types.ObjectId;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: 'paid' | 'pending' | 'overdue';
  paymentMethod?: string;
  transactionId?: string;
  receiptNumber: string;
  receiptGeneratedAt?: Date;
  month: string;
  year: number;
  createdAt: Date;
  updatedAt: Date;
}

const FeeSchema = new Schema<IFee>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    batchId: {
      type: Schema.Types.ObjectId,
      ref: 'Batch',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    paidDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['paid', 'pending', 'overdue'],
      default: 'pending',
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'online', 'check'],
    },
    transactionId: {
      type: String,
    },
    receiptNumber: {
      type: String,
      required: true,
      unique: true,
    },
    receiptGeneratedAt: {
      type: Date,
    },
    month: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IFee>('Fee', FeeSchema); 