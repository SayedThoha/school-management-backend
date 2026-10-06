import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ITeacherContactInfo {
  phone: string;
  email: string;
  address?: string;
}

export interface ITeacher extends Document {
  name: string;
  subject: string;
  experience: number; // in years
  contactInfo: ITeacherContactInfo;
  qualification?: string;
  userId?: Types.ObjectId; // linked user account if exists
  createdAt: Date;
  updatedAt: Date;
}

const TeacherSchema: Schema<ITeacher> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Teacher name is required'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Primary subject is required'],
      trim: true,
    },
    experience: {
      type: Number,
      required: [true, 'Experience in years is required'],
      min: [0, 'Experience cannot be negative'],
    },
    contactInfo: {
      phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
      },
      email: {
        type: String,
        required: [true, 'Contact email is required'],
        trim: true,
        lowercase: true,
      },
      address: {
        type: String,
        default: '',
        trim: true,
      },
    },
    qualification: {
      type: String,
      default: '',
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Teacher = mongoose.model<ITeacher>('Teacher', TeacherSchema);
