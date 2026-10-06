import { Router } from 'express';
import { body, query, param } from 'express-validator';
import { SubjectController } from '../controllers/SubjectController.js';
import { authenticateJwt } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';
import { handleValidationErrors } from '../middleware/validation.middleware.js';

const router = Router();
const subjectController = new SubjectController();

router.use(authenticateJwt);

// GET /api/subjects (optionally by classId or teacherId)
router.get(
  '/',
  authorizeRoles('Admin', 'Teacher'),
  [
    query('classId').optional().isMongoId().withMessage('Invalid classId'),
    query('teacherId').optional().isMongoId().withMessage('Invalid teacherId'),
    handleValidationErrors,
  ],
  subjectController.getSubjects
);

// GET /api/subjects/:id
router.get(
  '/:id',
  authorizeRoles('Admin', 'Teacher'),
  [param('id').isMongoId().withMessage('Invalid subject ID'), handleValidationErrors],
  subjectController.getSubjectById
);

// POST /api/subjects (Create subject - Admin only)
router.post(
  '/',
  authorizeRoles('Admin'),
  [
    body('name').trim().notEmpty().withMessage('Subject name is required'),
    body('code').trim().notEmpty().withMessage('Subject code is required'),
    body('teacherId').optional({ nullable: true }).isMongoId().withMessage('Invalid teacher ID'),
    body('classId').optional({ nullable: true }).isMongoId().withMessage('Invalid class ID'),
    handleValidationErrors,
  ],
  subjectController.createSubject
);

// PUT /api/subjects/:id (Update subject - Admin only)
router.put(
  '/:id',
  authorizeRoles('Admin'),
  [
    param('id').isMongoId().withMessage('Invalid subject ID'),
    body('name').optional().trim().notEmpty().withMessage('Subject name cannot be empty'),
    body('code').optional().trim().notEmpty().withMessage('Subject code cannot be empty'),
    body('teacherId').optional({ nullable: true }).isMongoId().withMessage('Invalid teacher ID'),
    body('classId').optional({ nullable: true }).isMongoId().withMessage('Invalid class ID'),
    handleValidationErrors,
  ],
  subjectController.updateSubject
);

// DELETE /api/subjects/:id (Delete subject - Admin only)
router.delete(
  '/:id',
  authorizeRoles('Admin'),
  [param('id').isMongoId().withMessage('Invalid subject ID'), handleValidationErrors],
  subjectController.deleteSubject
);

export default router;
