import { Router } from 'express';
import { body, query, param } from 'express-validator';
import { TeacherController } from '../controllers/TeacherController.js';
import { authenticateJwt } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';
import { handleValidationErrors } from '../middleware/validation.middleware.js';

const router = Router();
const teacherController = new TeacherController();

router.use(authenticateJwt);

// GET /api/teachers
router.get(
  '/',
  authorizeRoles('Admin', 'Teacher'),
  [query('subject').optional().isString(), handleValidationErrors],
  teacherController.getTeachers
);

// GET /api/teachers/:id
router.get(
  '/:id',
  authorizeRoles('Admin', 'Teacher'),
  [param('id').isMongoId().withMessage('Invalid teacher ID'), handleValidationErrors],
  teacherController.getTeacherById
);

// POST /api/teachers (Admin only)
router.post(
  '/',
  authorizeRoles('Admin'),
  [
    body('name').trim().notEmpty().withMessage('Teacher name is required'),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('experience').isFloat({ min: 0 }).withMessage('Experience must be a positive number'),
    body('contactInfo.phone').trim().notEmpty().withMessage('Contact phone is required'),
    body('contactInfo.email').isEmail().withMessage('Valid contact email is required'),
    handleValidationErrors,
  ],
  teacherController.createTeacher
);

// PUT /api/teachers/:id (Admin only)
router.put(
  '/:id',
  authorizeRoles('Admin'),
  [
    param('id').isMongoId().withMessage('Invalid teacher ID'),
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('subject').optional().trim().notEmpty().withMessage('Subject cannot be empty'),
    body('experience').optional().isFloat({ min: 0 }).withMessage('Experience must be a positive number'),
    body('contactInfo.email').optional().isEmail().withMessage('Valid contact email format is required'),
    handleValidationErrors,
  ],
  teacherController.updateTeacher
);

// DELETE /api/teachers/:id (Admin only)
router.delete(
  '/:id',
  authorizeRoles('Admin'),
  [param('id').isMongoId().withMessage('Invalid teacher ID'), handleValidationErrors],
  teacherController.deleteTeacher
);

export default router;
