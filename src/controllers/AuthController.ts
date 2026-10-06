import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService.js';

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService = new AuthService()) {
    this.authService = authService;
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, password, role } = req.body;
      const result = await this.authService.register({ name, email, password, role });
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Registration failed',
      });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      res.status(200).json({
        success: true,
        message: 'Logged in successfully',
        data: result,
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message || 'Authentication failed',
      });
    }
  };

  getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const profile = await this.authService.getUserProfile(userId);
      res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'User profile not found',
      });
    }
  };
}
