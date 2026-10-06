import { FilterQuery } from 'mongoose';
import { BaseRepository } from './BaseRepository.js';
import { IAttendance, Attendance } from '../models/Attendance.js';
import { IAttendanceRepository } from './interfaces/IAttendanceRepository.js';

export class AttendanceRepository extends BaseRepository<IAttendance> implements IAttendanceRepository {
  constructor() {
    super(Attendance);
  }

  async findByClassAndDate(classId: string, date: string): Promise<IAttendance | null> {
    return await this.model
      .findOne({ classId, date })
      .populate('records.studentId', 'name rollNumber')
      .populate('classId', 'name section')
      .populate('markedBy', 'name email')
      .exec();
  }

  async findByClassHistory(classId: string, startDate?: string, endDate?: string): Promise<IAttendance[]> {
    const filter: FilterQuery<IAttendance> = { classId };
    if (startDate && endDate) {
      filter.date = { $gte: startDate, $lte: endDate };
    } else if (startDate) {
      filter.date = { $gte: startDate };
    } else if (endDate) {
      filter.date = { $lte: endDate };
    }

    return await this.model
      .find(filter)
      .populate('records.studentId', 'name rollNumber')
      .populate('classId', 'name section')
      .populate('markedBy', 'name')
      .sort({ date: -1 })
      .exec();
  }

  async getStudentAttendance(studentId: string): Promise<IAttendance[]> {
    return await this.model
      .find({ 'records.studentId': studentId })
      .populate('classId', 'name section')
      .sort({ date: -1 })
      .exec();
  }
}
