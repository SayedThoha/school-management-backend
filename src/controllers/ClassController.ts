import { Request, Response } from 'express';
import { ClassService } from '../services/ClassService.js';

export class ClassController {
  private classService: ClassService;

  constructor(classService: ClassService = new ClassService()) {
    this.classService = classService;
  }

  getClasses = async (req: Request, res: Response): Promise<void> => {
    try {
      const classes = await this.classService.getAllClasses();
      res.status(200).json({
        success: true,
        count: classes.length,
        data: classes,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch classes',
      });
    }
  };

  getClassById = async (req: Request, res: Response): Promise<void> => {
    try {
      const cls = await this.classService.getClassById(req.params.id);
      res.status(200).json({
        success: true,
        data: cls,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Class not found',
      });
    }
  };

  createClass = async (req: Request, res: Response): Promise<void> => {
    try {
      const cls = await this.classService.createClass(req.body);
      res.status(201).json({
        success: true,
        message: 'Class created successfully',
        data: cls,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create class',
      });
    }
  };

  updateClass = async (req: Request, res: Response): Promise<void> => {
    try {
      const cls = await this.classService.updateClass(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Class updated successfully',
        data: cls,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update class',
      });
    }
  };

  assignTeacher = async (req: Request, res: Response): Promise<void> => {
    try {
      const { teacherId } = req.body;
      const cls = await this.classService.assignTeacher(req.params.id, teacherId);
      res.status(200).json({
        success: true,
        message: 'Teacher assigned to class successfully',
        data: cls,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to assign teacher to class',
      });
    }
  };

  deleteClass = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.classService.deleteClass(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Class deleted successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete class',
      });
    }
  };
}
