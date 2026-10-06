import { ISubjectRepository } from '../repositories/interfaces/ISubjectRepository.js';
import { SubjectRepository } from '../repositories/SubjectRepository.js';
import { ITeacherRepository } from '../repositories/interfaces/ITeacherRepository.js';
import { TeacherRepository } from '../repositories/TeacherRepository.js';
import { IClassRepository } from '../repositories/interfaces/IClassRepository.js';
import { ClassRepository } from '../repositories/ClassRepository.js';
import { ISubject } from '../models/Subject.js';

export class SubjectService {
  private subjectRepo: ISubjectRepository;
  private teacherRepo: ITeacherRepository;
  private classRepo: IClassRepository;

  constructor(
    subjectRepo: ISubjectRepository = new SubjectRepository(),
    teacherRepo: ITeacherRepository = new TeacherRepository(),
    classRepo: IClassRepository = new ClassRepository()
  ) {
    this.subjectRepo = subjectRepo;
    this.teacherRepo = teacherRepo;
    this.classRepo = classRepo;
  }

  async getAllSubjects(classId?: string, teacherId?: string): Promise<ISubject[]> {
    if (classId) {
      return await this.subjectRepo.findByClass(classId);
    }
    if (teacherId) {
      return await this.subjectRepo.findByTeacher(teacherId);
    }
    return await this.subjectRepo.find(
      {},
      [
        { path: 'teacherId', select: 'name subject contactInfo' },
        { path: 'classId', select: 'name section' },
      ],
      { name: 1 }
    );
  }

  async getSubjectById(id: string): Promise<ISubject> {
    const subject = await this.subjectRepo.findById(id, [
      { path: 'teacherId', select: 'name subject' },
      { path: 'classId', select: 'name section' },
    ]);
    if (!subject) {
      throw new Error('Subject not found');
    }
    return subject;
  }

  async createSubject(data: Partial<ISubject>): Promise<ISubject> {
    if (data.teacherId) {
      const teacher = await this.teacherRepo.findById(data.teacherId.toString());
      if (!teacher) {
        throw new Error('Assigned teacher does not exist');
      }
    }

    if (data.classId) {
      const cls = await this.classRepo.findById(data.classId.toString());
      if (!cls) {
        throw new Error('Mapped class does not exist');
      }
    }

    return await this.subjectRepo.create(data);
  }

  async updateSubject(id: string, data: Partial<ISubject>): Promise<ISubject> {
    const existing = await this.subjectRepo.findById(id);
    if (!existing) {
      throw new Error('Subject not found');
    }

    if (data.teacherId) {
      const teacher = await this.teacherRepo.findById(data.teacherId.toString());
      if (!teacher) {
        throw new Error('Assigned teacher does not exist');
      }
    }

    if (data.classId) {
      const cls = await this.classRepo.findById(data.classId.toString());
      if (!cls) {
        throw new Error('Mapped class does not exist');
      }
    }

    const updated = await this.subjectRepo.update(id, data);
    if (!updated) {
      throw new Error('Failed to update subject');
    }
    return updated;
  }

  async deleteSubject(id: string): Promise<void> {
    const existing = await this.subjectRepo.findById(id);
    if (!existing) {
      throw new Error('Subject not found');
    }
    await this.subjectRepo.delete(id);
  }
}
