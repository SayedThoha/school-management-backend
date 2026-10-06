import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController.js';
import { authenticateJwt } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = Router();
const dashboardController = new DashboardController();

router.use(authenticateJwt);

// GET /api/dashboard/stats
router.get('/stats', authorizeRoles('Admin', 'Teacher'), dashboardController.getStats);

export default router;
