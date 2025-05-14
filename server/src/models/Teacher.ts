import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface ITeacher extends Document {
  name: string;
  phone: string;
  subject: string;
  joiningDate: Date;
  status: 'active' | 'inactive';
  user: IUser['_id'] | IUser;
}

const TeacherSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  subject: {
    type: String,
    trim: true
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model<ITeacher>('Teacher', TeacherSchema); 