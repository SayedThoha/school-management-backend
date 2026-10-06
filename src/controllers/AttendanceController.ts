import { Request, Response } from 'express';
import { AttendanceService } from '../services/AttendanceService.js';

export class AttendanceController {
  private attendanceService: AttendanceService;

  constructor(attendanceService: AttendanceService = new AttendanceService()) {
    this.attendanceService = attendanceService;
  }

  markAttendance = async (req: Request, res: Response): Promise<void> => {
    try {
      const { classId, date, records } = req.body;
      const markedBy = req.user?.id;

      if (!classId || !date || !records || !Array.isArray(records)) {
        res.status(400).json({
          success: false,
          message: 'classId, date (YYYY-MM-DD), and records array are required',
        });
        return;
      }

      const attendance = await this.attendanceService.markAttendance(classId, date, records, markedBy);
      res.status(200).json({
        success: true,
        message: 'Attendance saved successfully',
        data: attendance,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to mark attendance',
      });
    }
  };

  getAttendanceByDateAndClass = async (req: Request, res: Response): Promise<void> => {
    try {
      const { classId } = req.params;
      const { date } = req.query;

      if (!date) {
        res.status(400).json({
          success: false,
          message: 'date query parameter is required (YYYY-MM-DD)',
        });
        return;
      }

      const result = await this.attendanceService.getAttendanceByDateAndClass(classId, String(date));
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Failed to fetch attendance',
      });
    }
  };

  getClassHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { classId } = req.params;
      const { startDate, endDate } = req.query;

      const history = await this.attendanceService.getClassAttendanceHistory(
        classId,
        startDate ? String(startDate) : undefined,
        endDate ? String(endDate) : undefined
      );

      res.status(200).json({
        success: true,
        count: history.length,
        data: history,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch attendance history',
      });
    }
  };

  getStudentAttendanceHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { studentId } = req.params;
      const result = await this.attendanceService.getStudentAttendanceHistory(studentId);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Failed to fetch student attendance',
      });
    }
  };
}
