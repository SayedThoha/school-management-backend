import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { AttendanceController } from '../controllers/AttendanceController.js';
import { authenticateJwt } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';
import { handleValidationErrors } from '../middleware/validation.middleware.js';

const router = Router();
const attendanceController = new AttendanceController();

router.use(authenticateJwt);

// POST /api/attendance/mark (Mark attendance)
router.post(
  '/mark',
  authorizeRoles('Admin', 'Teacher'),
  [
    body('classId').isMongoId().withMessage('Valid class ID is required'),
    body('date').matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Date must be in YYYY-MM-DD format'),
    body('records').isArray().withMessage('Records must be an array'),
    body('records.*.studentId').isMongoId().withMessage('Valid studentId required for each record'),
    body('records.*.status').isIn(['Present', 'Absent', 'Late']).withMessage('Status must be Present, Absent, or Late'),
    handleValidationErrors,
  ],
  attendanceController.markAttendance
);

// GET /api/attendance/class/:classId (Date-wise tracking: get attendance of class for specific date)
router.get(
  '/class/:classId',
  authorizeRoles('Admin', 'Teacher'),
  [
    param('classId').isMongoId().withMessage('Invalid class ID'),
    query('date').matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Date must be in YYYY-MM-DD format'),
    handleValidationErrors,
  ],
  attendanceController.getAttendanceByDateAndClass
);

// GET /api/attendance/history/:classId (Class attendance history over date range)
router.get(
  '/history/:classId',
  authorizeRoles('Admin', 'Teacher'),
  [
    param('classId').isMongoId().withMessage('Invalid class ID'),
    query('startDate').optional().matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('startDate must be YYYY-MM-DD'),
    query('endDate').optional().matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('endDate must be YYYY-MM-DD'),
    handleValidationErrors,
  ],
  attendanceController.getClassHistory
);

// GET /api/attendance/student/:studentId (Individual student attendance record & percentage)
router.get(
  '/student/:studentId',
  authorizeRoles('Admin', 'Teacher'),
  [param('studentId').isMongoId().withMessage('Invalid student ID'), handleValidationErrors],
  attendanceController.getStudentAttendanceHistory
);

export default router;
