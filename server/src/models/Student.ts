import mongoose, { Document, Schema } from 'mongoose';

export interface IStudent extends Document {
  userId?: mongoose.Types.ObjectId;
  parentId: mongoose.Types.ObjectId;
  rollNumber: string;
  name: string;
  grade: string;
  batchIds: mongoose.Types.ObjectId[];
  address: string;
  dateOfBirth: Date;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema = new Schema<IStudent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Parent',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    rollNumber: {
      type: String,
      required: true,
      unique: true,
    },
    grade: {
      type: String,
      required: true,
    },
    batchIds: [{
      type: Schema.Types.ObjectId,
      ref: 'Batch',
    }],
    address: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IStudent>('Student', StudentSchema); 