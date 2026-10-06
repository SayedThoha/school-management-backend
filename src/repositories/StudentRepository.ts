import { FilterQuery } from 'mongoose';
import { BaseRepository } from './BaseRepository.js';
import { IStudent, Student } from '../models/Student.js';
import { IStudentRepository } from './interfaces/IStudentRepository.js';

export class StudentRepository extends BaseRepository<IStudent> implements IStudentRepository {
  constructor() {
    super(Student);
  }

  async findByClass(classId: string): Promise<IStudent[]> {
    return await this.model
      .find({ classId, isActive: true })
      .populate('classId', 'name section')
      .sort({ rollNumber: 1 })
      .exec();
  }

  async findByRollNumber(classId: string, rollNumber: string): Promise<IStudent | null> {
    return await this.model.findOne({ classId, rollNumber: rollNumber.toUpperCase() }).exec();
  }

  async searchStudents(query: string, classId?: string): Promise<IStudent[]> {
    const filter: FilterQuery<IStudent> = {
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { rollNumber: { $regex: query, $options: 'i' } },
      ],
    };

    if (classId) {
      filter.classId = classId;
    }

    return await this.model
      .find(filter)
      .populate('classId', 'name section')
      .sort({ createdAt: -1 })
      .exec();
  }
}
