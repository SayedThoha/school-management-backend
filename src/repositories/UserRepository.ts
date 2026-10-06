import { BaseRepository } from './BaseRepository.js';
import { IUser, User } from '../models/User.js';
import { IUserRepository } from './interfaces/IUserRepository.js';

export class UserRepository extends BaseRepository<IUser> implements IUserRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await this.model.findOne({ email: email.toLowerCase().trim() }).exec();
  }
}
