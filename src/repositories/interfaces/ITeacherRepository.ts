import { IBaseRepository } from './IBaseRepository.js';
import { ITeacher } from '../../models/Teacher.js';

export interface ITeacherRepository extends IBaseRepository<ITeacher> {
  findBySubject(subject: string): Promise<ITeacher[]>;
  findByEmail(email: string): Promise<ITeacher | null>;
}
