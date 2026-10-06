import { Router } from 'express';
import { body, param } from 'express-validator';
import { ClassController } from '../controllers/ClassController.js';
import { authenticateJwt } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';
import { handleValidationErrors } from '../middleware/validation.middleware.js';

const router = Router();
const classController = new ClassController();

router.use(authenticateJwt);

// GET /api/classes (List all classes with teachers and enrolled counts)
router.get('/', authorizeRoles('Admin', 'Teacher'), classController.getClasses);

// GET /api/classes/:id (Class details + all students in the class)
router.get(
  '/:id',
  authorizeRoles('Admin', 'Teacher'),
  [param('id').isMongoId().withMessage('Invalid class ID'), handleValidationErrors],
  classController.getClassById
);

// POST /api/classes (Create class - Admin only)
router.post(
  '/',
  authorizeRoles('Admin'),
  [
    body('name').trim().notEmpty().withMessage('Class name is required (e.g. Grade 10)'),
    body('section').trim().notEmpty().withMessage('Section is required (e.g. A, B)'),
    body('teacherId').optional({ nullable: true }).isMongoId().withMessage('Invalid teacher ID'),
    handleValidationErrors,
  ],
  classController.createClass
);

// PUT /api/classes/:id (Update class - Admin only)
router.put(
  '/:id',
  authorizeRoles('Admin'),
  [
    param('id').isMongoId().withMessage('Invalid class ID'),
    body('name').optional().trim().notEmpty().withMessage('Class name cannot be empty'),
    body('section').optional().trim().notEmpty().withMessage('Section cannot be empty'),
    body('teacherId').optional({ nullable: true }).isMongoId().withMessage('Invalid teacher ID'),
    handleValidationErrors,
  ],
  classController.updateClass
);

// POST /api/classes/:id/assign-teacher (Assign teacher to class)
router.post(
  '/:id/assign-teacher',
  authorizeRoles('Admin'),
  [
    param('id').isMongoId().withMessage('Invalid class ID'),
    body('teacherId').isMongoId().withMessage('Valid teacher ID is required'),
    handleValidationErrors,
  ],
  classController.assignTeacher
);

// DELETE /api/classes/:id (Delete class - Admin only)
router.delete(
  '/:id',
  authorizeRoles('Admin'),
  [param('id').isMongoId().withMessage('Invalid class ID'), handleValidationErrors],
  classController.deleteClass
);

export default router;
