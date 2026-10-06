import { IStudentRepository } from '../repositories/interfaces/IStudentRepository.js';
import { StudentRepository } from '../repositories/StudentRepository.js';
import { ITeacherRepository } from '../repositories/interfaces/ITeacherRepository.js';
import { TeacherRepository } from '../repositories/TeacherRepository.js';
import { IClassRepository } from '../repositories/interfaces/IClassRepository.js';
import { ClassRepository } from '../repositories/ClassRepository.js';
import { ISubjectRepository } from '../repositories/interfaces/ISubjectRepository.js';
import { SubjectRepository } from '../repositories/SubjectRepository.js';
import { IAttendanceRepository } from '../repositories/interfaces/IAttendanceRepository.js';
import { AttendanceRepository } from '../repositories/AttendanceRepository.js';

export class DashboardService {
  private studentRepo: IStudentRepository;
  private teacherRepo: ITeacherRepository;
  private classRepo: IClassRepository;
  private subjectRepo: ISubjectRepository;
  private attendanceRepo: IAttendanceRepository;

  constructor(
    studentRepo: IStudentRepository = new StudentRepository(),
    teacherRepo: ITeacherRepository = new TeacherRepository(),
    classRepo: IClassRepository = new ClassRepository(),
    subjectRepo: ISubjectRepository = new SubjectRepository(),
    attendanceRepo: IAttendanceRepository = new AttendanceRepository()
  ) {
    this.studentRepo = studentRepo;
    this.teacherRepo = teacherRepo;
    this.classRepo = classRepo;
    this.subjectRepo = subjectRepo;
    this.attendanceRepo = attendanceRepo;
  }

  async getDashboardStats() {
    const [totalStudents, totalTeachers, totalClasses, totalSubjects] = await Promise.all([
      this.studentRepo.count({ isActive: true }),
      this.teacherRepo.count(),
      this.classRepo.count(),
      this.subjectRepo.count(),
    ]);

    // Fetch recent 5 classes with teacher details
    const classes = await this.classRepo.find(
      {},
      [{ path: 'teacherId', select: 'name' }],
      { createdAt: -1 },
      0,
      5
    );

    // Fetch recent 5 students
    const recentStudents = await this.studentRepo.find(
      { isActive: true },
      [{ path: 'classId', select: 'name section' }],
      { createdAt: -1 },
      0,
      5
    );

    // Fetch latest attendance entries
    const recentAttendance = await this.attendanceRepo.find(
      {},
      [{ path: 'classId', select: 'name section' }],
      { date: -1, createdAt: -1 },
      0,
      5
    );

    return {
      overview: {
        totalStudents,
        totalTeachers,
        totalClasses,
        totalSubjects,
      },
      recentStudents,
      classes,
      recentAttendance,
    };
  }
}
