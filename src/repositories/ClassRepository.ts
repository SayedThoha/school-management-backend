import { BaseRepository } from './BaseRepository.js';
import { IClass, Class } from '../models/Class.js';
import { IClassRepository } from './interfaces/IClassRepository.js';

export class ClassRepository extends BaseRepository<IClass> implements IClassRepository {
  constructor() {
    super(Class);
  }

  async findByNameAndSection(name: string, section: string): Promise<IClass | null> {
    return await this.model
      .findOne({ name: name.trim(), section: section.trim().toUpperCase() })
      .populate('teacherId', 'name subject contactInfo')
      .exec();
  }

  async findByTeacherId(teacherId: string): Promise<IClass[]> {
    return await this.model
      .find({ teacherId })
      .populate('teacherId', 'name subject')
      .exec();
  }
}
