import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IStudentContactInfo {
  phone: string;
  email?: string;
  parentName: string;
  address?: string;
}

export interface IStudent extends Document {
  name: string;
  classId: Types.ObjectId;
  rollNumber: string;
  age: number;
  contactInfo: IStudentContactInfo;
  gender?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema: Schema<IStudent> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: [true, 'Class assignment is required'],
    },
    rollNumber: {
      type: String,
      required: [true, 'Roll number is required'],
      trim: true,
      uppercase: true,
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [3, 'Age must be at least 3'],
      max: [30, 'Age must be less than 30'],
    },
    contactInfo: {
      phone: {
        type: String,
        required: [true, 'Contact phone is required'],
        trim: true,
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
        default: '',
      },
      parentName: {
        type: String,
        required: [true, 'Parent / Guardian name is required'],
        trim: true,
      },
      address: {
        type: String,
        trim: true,
        default: '',
      },
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      default: 'Male',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Roll number should be unique within each class
StudentSchema.index({ classId: 1, rollNumber: 1 }, { unique: true });

export const Student = mongoose.model<IStudent>('Student', StudentSchema);
