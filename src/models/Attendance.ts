import mongoose, { Document, Schema, Types } from 'mongoose';

export type AttendanceStatus = 'Present' | 'Absent' | 'Late';

export interface IAttendanceRecord {
  studentId: Types.ObjectId;
  status: AttendanceStatus;
  remarks?: string;
}

export interface IAttendance extends Document {
  date: string; // YYYY-MM-DD
  classId: Types.ObjectId;
  records: IAttendanceRecord[];
  markedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceRecordSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Late'],
      default: 'Present',
    },
    remarks: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { _id: false }
);

const AttendanceSchema: Schema<IAttendance> = new Schema(
  {
    date: {
      type: String, // YYYY-MM-DD
      required: [true, 'Attendance date is required'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date format must be YYYY-MM-DD'],
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: [true, 'Class reference is required'],
    },
    records: [AttendanceRecordSchema],
    markedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Only one attendance sheet per class per day
AttendanceSchema.index({ date: 1, classId: 1 }, { unique: true });

export const Attendance = mongoose.model<IAttendance>('Attendance', AttendanceSchema);
