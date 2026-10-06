import { Request, Response } from 'express';
import { StudentService } from '../services/StudentService.js';

export class StudentController {
  private studentService: StudentService;

  constructor(studentService: StudentService = new StudentService()) {
    this.studentService = studentService;
  }

  getStudents = async (req: Request, res: Response): Promise<void> => {
    try {
      const { classId, search } = req.query;
      const students = await this.studentService.getAllStudents(
        classId ? String(classId) : undefined,
        search ? String(search) : undefined
      );
      res.status(200).json({
        success: true,
        count: students.length,
        data: students,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch students',
      });
    }
  };

  getStudentById = async (req: Request, res: Response): Promise<void> => {
    try {
      const student = await this.studentService.getStudentById(req.params.id);
      res.status(200).json({
        success: true,
        data: student,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Student not found',
      });
    }
  };

  createStudent = async (req: Request, res: Response): Promise<void> => {
    try {
      const student = await this.studentService.createStudent(req.body);
      res.status(201).json({
        success: true,
        message: 'Student created successfully',
        data: student,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create student',
      });
    }
  };

  updateStudent = async (req: Request, res: Response): Promise<void> => {
    try {
      const student = await this.studentService.updateStudent(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Student updated successfully',
        data: student,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update student',
      });
    }
  };

  deleteStudent = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.studentService.deleteStudent(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Student deleted successfully',
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Failed to delete student',
      });
    }
  };
}
