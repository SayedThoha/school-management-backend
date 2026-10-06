import { IAttendanceRepository } from '../repositories/interfaces/IAttendanceRepository.js';
import { AttendanceRepository } from '../repositories/AttendanceRepository.js';
import { IStudentRepository } from '../repositories/interfaces/IStudentRepository.js';
import { StudentRepository } from '../repositories/StudentRepository.js';
import { IClassRepository } from '../repositories/interfaces/IClassRepository.js';
import { ClassRepository } from '../repositories/ClassRepository.js';
import { IAttendance, IAttendanceRecord } from '../models/Attendance.js';

export class AttendanceService {
  private attendanceRepo: IAttendanceRepository;
  private studentRepo: IStudentRepository;
  private classRepo: IClassRepository;

  constructor(
    attendanceRepo: IAttendanceRepository = new AttendanceRepository(),
    studentRepo: IStudentRepository = new StudentRepository(),
    classRepo: IClassRepository = new ClassRepository()
  ) {
    this.attendanceRepo = attendanceRepo;
    this.studentRepo = studentRepo;
    this.classRepo = classRepo;
  }

  async markAttendance(
    classId: string,
    date: string,
    records: { studentId: string; status: 'Present' | 'Absent' | 'Late'; remarks?: string }[],
    markedBy?: string
  ): Promise<IAttendance> {
    const cls = await this.classRepo.findById(classId);
    if (!cls) {
      throw new Error('Class not found');
    }

    // Check if attendance already exists for this date and class
    const existing = await this.attendanceRepo.findOne({ classId, date });

    if (existing) {
      // Update existing record
      const updated = await this.attendanceRepo.update(existing._id.toString(), {
        records: records as any,
        markedBy: markedBy as any,
      });
      return updated!;
    } else {
      // Create new attendance entry
      return await this.attendanceRepo.create({
        classId: classId as any,
        date,
        records: records as any,
        markedBy: markedBy as any,
      });
    }
  }

  async getAttendanceByDateAndClass(classId: string, date: string): Promise<any> {
    const cls = await this.classRepo.findById(classId);
    if (!cls) {
      throw new Error('Class not found');
    }

    const attendance = await this.attendanceRepo.findByClassAndDate(classId, date);
    const allStudents = await this.studentRepo.findByClass(classId);

    // If attendance is already recorded, return with student details and summary
    if (attendance) {
      const summary = {
        total: attendance.records.length,
        present: attendance.records.filter((r) => r.status === 'Present').length,
        absent: attendance.records.filter((r) => r.status === 'Absent').length,
        late: attendance.records.filter((r) => r.status === 'Late').length,
      };

      return {
        isMarked: true,
        attendance,
        summary,
        students: allStudents,
      };
    }

    // Default template if not yet recorded for today
    return {
      isMarked: false,
      attendance: null,
      summary: {
        total: allStudents.length,
        present: 0,
        absent: 0,
        late: 0,
      },
      students: allStudents,
    };
  }

  async getClassAttendanceHistory(classId: string, startDate?: string, endDate?: string): Promise<IAttendance[]> {
    return await this.attendanceRepo.findByClassHistory(classId, startDate, endDate);
  }

  async getStudentAttendanceHistory(studentId: string): Promise<any> {
    const student = await this.studentRepo.findById(studentId);
    if (!student) {
      throw new Error('Student not found');
    }

    const records = await this.attendanceRepo.getStudentAttendance(studentId);
    const history = records.map((att) => {
      const studentRec = att.records.find((r) => r.studentId.toString() === studentId);
      return {
        date: att.date,
        class: att.classId,
        status: studentRec?.status || 'Unknown',
        remarks: studentRec?.remarks || '',
      };
    });

    const totalDays = history.length;
    const presentDays = history.filter((h) => h.status === 'Present').length;
    const percentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;

    return {
      student,
      history,
      totalDays,
      presentDays,
      attendanceRate: `${percentage}%`,
    };
  }
}
