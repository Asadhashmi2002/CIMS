import mongoose, { Document, Schema } from 'mongoose';

export interface IParent extends Document {
  userId: mongoose.Types.ObjectId;
  studentIds: mongoose.Types.ObjectId[];
  occupation: string;
  alternatePhone: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

const ParentSchema = new Schema<IParent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentIds: [{
      type: Schema.Types.ObjectId,
      ref: 'Student',
    }],
    occupation: {
      type: String,
    },
    alternatePhone: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IParent>('Parent', ParentSchema); 