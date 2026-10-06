import { Router } from 'express';
import { body, query, param } from 'express-validator';
import { StudentController } from '../controllers/StudentController.js';
import { authenticateJwt } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';
import { handleValidationErrors } from '../middleware/validation.middleware.js';

const router = Router();
const studentController = new StudentController();

// All student routes require authentication
router.use(authenticateJwt);

// GET /api/students
router.get(
  '/',
  authorizeRoles('Admin', 'Teacher'),
  [
    query('classId').optional().isMongoId().withMessage('Invalid classId'),
    query('search').optional().isString(),
    handleValidationErrors,
  ],
  studentController.getStudents
);

// GET /api/students/:id
router.get(
  '/:id',
  authorizeRoles('Admin', 'Teacher'),
  [param('id').isMongoId().withMessage('Invalid student ID'), handleValidationErrors],
  studentController.getStudentById
);

// POST /api/students (Add student)
router.post(
  '/',
  authorizeRoles('Admin', 'Teacher'),
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('classId').isMongoId().withMessage('Valid Class ID is required'),
    body('rollNumber').trim().notEmpty().withMessage('Roll Number is required'),
    body('age').isInt({ min: 3, max: 30 }).withMessage('Age must be between 3 and 30'),
    body('contactInfo.phone').trim().notEmpty().withMessage('Contact phone number is required'),
    body('contactInfo.parentName').trim().notEmpty().withMessage('Parent or guardian name is required'),
    body('contactInfo.email').optional().isEmail().withMessage('Invalid contact email format'),
    handleValidationErrors,
  ],
  studentController.createStudent
);

// PUT /api/students/:id (Edit student)
router.put(
  '/:id',
  authorizeRoles('Admin', 'Teacher'),
  [
    param('id').isMongoId().withMessage('Invalid student ID'),
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('classId').optional().isMongoId().withMessage('Valid Class ID is required'),
    body('rollNumber').optional().trim().notEmpty().withMessage('Roll number cannot be empty'),
    body('age').optional().isInt({ min: 3, max: 30 }).withMessage('Age must be between 3 and 30'),
    handleValidationErrors,
  ],
  studentController.updateStudent
);

// DELETE /api/students/:id (Delete student)
router.delete(
  '/:id',
  authorizeRoles('Admin'),
  [param('id').isMongoId().withMessage('Invalid student ID'), handleValidationErrors],
  studentController.deleteStudent
);

export default router;
