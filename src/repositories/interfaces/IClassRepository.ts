import { IBaseRepository } from './IBaseRepository.js';
import { IClass } from '../../models/Class.js';

export interface IClassRepository extends IBaseRepository<IClass> {
  findByNameAndSection(name: string, section: string): Promise<IClass | null>;
  findByTeacherId(teacherId: string): Promise<IClass[]>;
}
