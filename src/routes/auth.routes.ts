import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/AuthController.js';
import { handleValidationErrors } from '../middleware/validation.middleware.js';
import { authenticateJwt } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = Router();
const authController = new AuthController();

// POST /api/auth/register (Admin creates user)
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['Admin', 'Teacher']).withMessage('Role must be Admin or Teacher'),
    handleValidationErrors,
  ],
  authController.register
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    handleValidationErrors,
  ],
  authController.login
);

// GET /api/auth/me
router.get('/me', authenticateJwt, authController.getProfile);

export default router;
