import { IClassRepository } from '../repositories/interfaces/IClassRepository.js';
import { ClassRepository } from '../repositories/ClassRepository.js';
import { ITeacherRepository } from '../repositories/interfaces/ITeacherRepository.js';
import { TeacherRepository } from '../repositories/TeacherRepository.js';
import { IStudentRepository } from '../repositories/interfaces/IStudentRepository.js';
import { StudentRepository } from '../repositories/StudentRepository.js';
import { IClass } from '../models/Class.js';

export class ClassService {
  private classRepo: IClassRepository;
  private teacherRepo: ITeacherRepository;
  private studentRepo: IStudentRepository;

  constructor(
    classRepo: IClassRepository = new ClassRepository(),
    teacherRepo: ITeacherRepository = new TeacherRepository(),
    studentRepo: IStudentRepository = new StudentRepository()
  ) {
    this.classRepo = classRepo;
    this.teacherRepo = teacherRepo;
    this.studentRepo = studentRepo;
  }

  async getAllClasses(): Promise<any[]> {
    const classes = await this.classRepo.find(
      {},
      [{ path: 'teacherId', select: 'name subject contactInfo' }],
      { name: 1, section: 1 }
    );

    // Enrich with student count for each class
    const enriched = await Promise.all(
      classes.map(async (cls) => {
        const studentCount = await this.studentRepo.count({ classId: cls._id, isActive: true });
        return {
          ...cls.toObject(),
          studentCount,
        };
      })
    );

    return enriched;
  }

  async getClassById(id: string): Promise<any> {
    const cls = await this.classRepo.findById(id, [{ path: 'teacherId', select: 'name subject contactInfo' }]);
    if (!cls) {
      throw new Error('Class not found');
    }
    const students = await this.studentRepo.findByClass(id);
    return {
      ...cls.toObject(),
      students,
      studentCount: students.length,
    };
  }

  async createClass(data: { name: string; section: string; teacherId?: string; roomNumber?: string }): Promise<IClass> {
    const existing = await this.classRepo.findByNameAndSection(data.name, data.section);
    if (existing) {
      throw new Error(`Class '${data.name}' Section '${data.section}' already exists`);
    }

    if (data.teacherId) {
      const teacher = await this.teacherRepo.findById(data.teacherId);
      if (!teacher) {
        throw new Error('Assigned teacher not found');
      }
    }

    return await this.classRepo.create({
      name: data.name.trim(),
      section: data.section.trim().toUpperCase(),
      teacherId: data.teacherId as any,
      roomNumber: data.roomNumber?.trim() || '',
    });
  }

  async updateClass(id: string, data: Partial<IClass>): Promise<IClass> {
    const existing = await this.classRepo.findById(id);
    if (!existing) {
      throw new Error('Class not found');
    }

    if (data.name || data.section) {
      const checkName = data.name || existing.name;
      const checkSection = (data.section || existing.section).toUpperCase();
      const duplicate = await this.classRepo.findByNameAndSection(checkName, checkSection);
      if (duplicate && duplicate._id.toString() !== id) {
        throw new Error(`Class '${checkName} - ${checkSection}' already exists`);
      }
    }

    if (data.teacherId) {
      const teacher = await this.teacherRepo.findById(data.teacherId.toString());
      if (!teacher) {
        throw new Error('Assigned teacher not found');
      }
    }

    const updated = await this.classRepo.update(id, data);
    if (!updated) {
      throw new Error('Failed to update class');
    }
    return updated;
  }

  async assignTeacher(classId: string, teacherId: string): Promise<IClass> {
    const cls = await this.classRepo.findById(classId);
    if (!cls) {
      throw new Error('Class not found');
    }

    const teacher = await this.teacherRepo.findById(teacherId);
    if (!teacher) {
      throw new Error('Teacher not found');
    }

    const updated = await this.classRepo.update(classId, { teacherId: teacher._id as any });
    if (!updated) {
      throw new Error('Failed to assign teacher');
    }
    return updated;
  }

  async deleteClass(id: string): Promise<void> {
    const existing = await this.classRepo.findById(id);
    if (!existing) {
      throw new Error('Class not found');
    }

    // Check if students are currently assigned
    const studentCount = await this.studentRepo.count({ classId: id, isActive: true });
    if (studentCount > 0) {
      throw new Error(`Cannot delete class with ${studentCount} actively enrolled students. Please reassign students first.`);
    }

    await this.classRepo.delete(id);
  }
}
