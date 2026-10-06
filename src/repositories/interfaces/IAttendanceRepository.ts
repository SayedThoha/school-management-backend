import { IBaseRepository } from './IBaseRepository.js';
import { IAttendance } from '../../models/Attendance.js';

export interface IAttendanceRepository extends IBaseRepository<IAttendance> {
  findByClassAndDate(classId: string, date: string): Promise<IAttendance | null>;
  findByClassHistory(classId: string, startDate?: string, endDate?: string): Promise<IAttendance[]>;
  getStudentAttendance(studentId: string): Promise<IAttendance[]>;
}
