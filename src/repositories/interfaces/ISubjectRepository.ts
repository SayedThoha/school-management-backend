import { IBaseRepository } from './IBaseRepository.js';
import { ISubject } from '../../models/Subject.js';

export interface ISubjectRepository extends IBaseRepository<ISubject> {
  findByClass(classId: string): Promise<ISubject[]>;
  findByTeacher(teacherId: string): Promise<ISubject[]>;
  findByCode(code: string): Promise<ISubject | null>;
}
