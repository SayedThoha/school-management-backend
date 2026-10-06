import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ISubject extends Document {
  name: string;
  code: string;
  description?: string;
  teacherId?: Types.ObjectId; // assigned teacher
  classId?: Types.ObjectId;   // mapped class
  createdAt: Date;
  updatedAt: Date;
}

const SubjectSchema: Schema<ISubject> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Subject code is required (e.g. MATH-101)'],
      trim: true,
      uppercase: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
      default: null,
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

SubjectSchema.index({ code: 1, classId: 1 }, { unique: true, sparse: true });

export const Subject = mongoose.model<ISubject>('Subject', SubjectSchema);
