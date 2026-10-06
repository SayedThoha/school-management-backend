import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUserRepository } from '../repositories/interfaces/IUserRepository.js';
import { UserRepository } from '../repositories/UserRepository.js';
import { IUser, UserRole } from '../models/User.js';

export interface AuthTokens {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
}

export class AuthService {
  private userRepository: IUserRepository;

  // Dependency Inversion: depends on IUserRepository abstraction
  constructor(userRepository: IUserRepository = new UserRepository()) {
    this.userRepository = userRepository;
  }

  async register(data: { name: string; email: string; password: string; role?: UserRole }): Promise<AuthTokens> {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) {
      throw new Error('User with this email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const user = await this.userRepository.create({
      name: data.name,
      email: data.email.toLowerCase(),
      password: hashedPassword,
      role: data.role || 'Teacher',
    });

    const token = this.generateToken(user);
    return {
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async login(email: string, password: string): Promise<AuthTokens> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const token = this.generateToken(user);
    return {
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async getUserProfile(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  private generateToken(user: IUser): string {
    const secret = process.env.JWT_SECRET || 'fallback_secret_key_school_mgmt';
    const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as any;
    return jwt.sign(
      {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
      secret,
      { expiresIn }
    );
  }
}
