import { IBaseRepository } from './IBaseRepository.js';
import { IUser } from '../../models/User.js';

export interface IUserRepository extends IBaseRepository<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
}
