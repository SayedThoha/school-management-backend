import { Request, Response } from 'express';
import { SubjectService } from '../services/SubjectService.js';

export class SubjectController {
  private subjectService: SubjectService;

  constructor(subjectService: SubjectService = new SubjectService()) {
    this.subjectService = subjectService;
  }

  getSubjects = async (req: Request, res: Response): Promise<void> => {
    try {
      const { classId, teacherId } = req.query;
      const subjects = await this.subjectService.getAllSubjects(
        classId ? String(classId) : undefined,
        teacherId ? String(teacherId) : undefined
      );
      res.status(200).json({
        success: true,
        count: subjects.length,
        data: subjects,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch subjects',
      });
    }
  };

  getSubjectById = async (req: Request, res: Response): Promise<void> => {
    try {
      const subject = await this.subjectService.getSubjectById(req.params.id);
      res.status(200).json({
        success: true,
        data: subject,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Subject not found',
      });
    }
  };

  createSubject = async (req: Request, res: Response): Promise<void> => {
    try {
      const subject = await this.subjectService.createSubject(req.body);
      res.status(201).json({
        success: true,
        message: 'Subject created successfully',
        data: subject,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create subject',
      });
    }
  };

  updateSubject = async (req: Request, res: Response): Promise<void> => {
    try {
      const subject = await this.subjectService.updateSubject(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Subject updated successfully',
        data: subject,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update subject',
      });
    }
  };

  deleteSubject = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.subjectService.deleteSubject(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Subject deleted successfully',
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Failed to delete subject',
      });
    }
  };
}
