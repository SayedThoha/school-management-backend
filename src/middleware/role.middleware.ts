import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../models/User.js';

/**
 * Role-based authorization middleware.
 * Ensures the authenticated user possesses one of the allowed roles.
 */
export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required prior to authorization.',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user.role}' lacks permissions for this action. Allowed: [${allowedRoles.join(', ')}]`,
      });
      return;
    }

    next();
  };
};
