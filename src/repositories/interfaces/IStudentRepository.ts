import { IBaseRepository } from './IBaseRepository.js';
import { IStudent } from '../../models/Student.js';

export interface IStudentRepository extends IBaseRepository<IStudent> {
  findByClass(classId: string): Promise<IStudent[]>;
  findByRollNumber(classId: string, rollNumber: string): Promise<IStudent | null>;
  searchStudents(query: string, classId?: string): Promise<IStudent[]>;
}
