import { BaseRepository } from './BaseRepository.js';
import { ITeacher, Teacher } from '../models/Teacher.js';
import { ITeacherRepository } from './interfaces/ITeacherRepository.js';

export class TeacherRepository extends BaseRepository<ITeacher> implements ITeacherRepository {
  constructor() {
    super(Teacher);
  }

  async findBySubject(subject: string): Promise<ITeacher[]> {
    return await this.model
      .find({ subject: { $regex: subject, $options: 'i' } })
      .sort({ name: 1 })
      .exec();
  }

  async findByEmail(email: string): Promise<ITeacher | null> {
    return await this.model
      .findOne({ 'contactInfo.email': email.toLowerCase().trim() })
      .exec();
  }
}
