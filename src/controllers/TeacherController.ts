import { Request, Response } from 'express';
import { TeacherService } from '../services/TeacherService.js';

export class TeacherController {
  private teacherService: TeacherService;

  constructor(teacherService: TeacherService = new TeacherService()) {
    this.teacherService = teacherService;
  }

  getTeachers = async (req: Request, res: Response): Promise<void> => {
    try {
      const { subject } = req.query;
      const teachers = await this.teacherService.getAllTeachers(subject ? String(subject) : undefined);
      res.status(200).json({
        success: true,
        count: teachers.length,
        data: teachers,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch teachers',
      });
    }
  };

  getTeacherById = async (req: Request, res: Response): Promise<void> => {
    try {
      const teacher = await this.teacherService.getTeacherById(req.params.id);
      res.status(200).json({
        success: true,
        data: teacher,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Teacher not found',
      });
    }
  };

  createTeacher = async (req: Request, res: Response): Promise<void> => {
    try {
      const teacher = await this.teacherService.createTeacher(req.body);
      res.status(201).json({
        success: true,
        message: 'Teacher created successfully',
        data: teacher,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create teacher',
      });
    }
  };

  updateTeacher = async (req: Request, res: Response): Promise<void> => {
    try {
      const teacher = await this.teacherService.updateTeacher(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Teacher updated successfully',
        data: teacher,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update teacher',
      });
    }
  };

  deleteTeacher = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.teacherService.deleteTeacher(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Teacher deleted successfully',
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Failed to delete teacher',
      });
    }
  };
}
