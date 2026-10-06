import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IClass extends Document {
  name: string;
  section: string;
  teacherId?: Types.ObjectId; // assigned class teacher
  roomNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClassSchema: Schema<IClass> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Class name is required (e.g. Grade 10)'],
      trim: true,
    },
    section: {
      type: String,
      required: [true, 'Section is required (e.g. A, B, Green)'],
      trim: true,
      uppercase: true,
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
      default: null,
    },
    roomNumber: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Unique compound index for name + section (e.g. Grade 10 + A)
ClassSchema.index({ name: 1, section: 1 }, { unique: true });

export const Class = mongoose.model<IClass>('Class', ClassSchema);
