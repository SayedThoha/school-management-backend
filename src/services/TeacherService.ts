import { ITeacherRepository } from '../repositories/interfaces/ITeacherRepository.js';
import { TeacherRepository } from '../repositories/TeacherRepository.js';
import { ITeacher } from '../models/Teacher.js';

export class TeacherService {
  private teacherRepo: ITeacherRepository;

  constructor(teacherRepo: ITeacherRepository = new TeacherRepository()) {
    this.teacherRepo = teacherRepo;
  }

  async getAllTeachers(subjectFilter?: string): Promise<ITeacher[]> {
    if (subjectFilter) {
      return await this.teacherRepo.findBySubject(subjectFilter);
    }
    return await this.teacherRepo.find({}, undefined, { name: 1 });
  }

  async getTeacherById(id: string): Promise<ITeacher> {
    const teacher = await this.teacherRepo.findById(id);
    if (!teacher) {
      throw new Error('Teacher not found');
    }
    return teacher;
  }

  async createTeacher(data: Partial<ITeacher>): Promise<ITeacher> {
    if (data.contactInfo?.email) {
      const existing = await this.teacherRepo.findByEmail(data.contactInfo.email);
      if (existing) {
        throw new Error('A teacher with this contact email already exists');
      }
    }
    return await this.teacherRepo.create(data);
  }

  async updateTeacher(id: string, data: Partial<ITeacher>): Promise<ITeacher> {
    const existing = await this.teacherRepo.findById(id);
    if (!existing) {
      throw new Error('Teacher not found');
    }

    if (data.contactInfo?.email) {
      const duplicate = await this.teacherRepo.findByEmail(data.contactInfo.email);
      if (duplicate && duplicate._id.toString() !== id) {
        throw new Error('Another teacher is already using this contact email');
      }
    }

    const updated = await this.teacherRepo.update(id, data);
    if (!updated) {
      throw new Error('Failed to update teacher');
    }
    return updated;
  }

  async deleteTeacher(id: string): Promise<void> {
    const existing = await this.teacherRepo.findById(id);
    if (!existing) {
      throw new Error('Teacher not found');
    }
    await this.teacherRepo.delete(id);
  }
}
