import { NextFunction, Response } from 'express';
import { AuthRequest } from './auth';

/**
 * Enum for role names
 */
export enum Role {
  ADMIN = 'ADMIN',
  EVENT_MANAGER = 'EVENT_MANAGER',
  STAFF = 'STAFF',
  VIEWER = 'VIEWER',
}

/**
 * Middleware to check if user has required role(s)
 * @param allowedRoles - Array of roles that are allowed to access the route
 */
export const authorize = (...allowedRoles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const userRoles = req.user.roles;
    const hasPermission = allowedRoles.some(role => userRoles.includes(role));

    if (!hasPermission) {
      res.status(403).json({ 
        error: 'Forbidden', 
        message: 'You do not have permission to access this resource' 
      });
      return;
    }

    next();
  };
};

/**
 * Helper to check if user is admin
 */
export const requireAdmin = authorize(Role.ADMIN);

/**
 * Helper to check if user is at least event manager
 */
export const requireEventManager = authorize(Role.ADMIN, Role.EVENT_MANAGER);

/**
 * Helper to check if user is staff or higher
 */
export const requireStaff = authorize(Role.ADMIN, Role.EVENT_MANAGER, Role.STAFF);
