import { Router } from 'express';
import authRoutes from './auth.routes.js';
import studentRoutes from './student.routes.js';
import teacherRoutes from './teacher.routes.js';
import classRoutes from './class.routes.js';
import subjectRoutes from './subject.routes.js';
import attendanceRoutes from './attendance.routes.js';
import dashboardRoutes from './dashboard.routes.js';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/students', studentRoutes);
apiRouter.use('/teachers', teacherRoutes);
apiRouter.use('/classes', classRoutes);
apiRouter.use('/subjects', subjectRoutes);
apiRouter.use('/attendance', attendanceRoutes);
apiRouter.use('/dashboard', dashboardRoutes);

export default apiRouter;
