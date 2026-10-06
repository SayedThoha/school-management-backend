import { BaseRepository } from './BaseRepository.js';
import { ISubject, Subject } from '../models/Subject.js';
import { ISubjectRepository } from './interfaces/ISubjectRepository.js';

export class SubjectRepository extends BaseRepository<ISubject> implements ISubjectRepository {
  constructor() {
    super(Subject);
  }

  async findByClass(classId: string): Promise<ISubject[]> {
    return await this.model
      .find({ classId })
      .populate('teacherId', 'name subject contactInfo')
      .populate('classId', 'name section')
      .sort({ name: 1 })
      .exec();
  }

  async findByTeacher(teacherId: string): Promise<ISubject[]> {
    return await this.model
      .find({ teacherId })
      .populate('classId', 'name section')
      .sort({ name: 1 })
      .exec();
  }

  async findByCode(code: string): Promise<ISubject | null> {
    return await this.model
      .findOne({ code: code.trim().toUpperCase() })
      .populate('teacherId', 'name')
      .populate('classId', 'name section')
      .exec();
  }
}
