import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import { requireEventManager, requireStaff } from '../middleware/rbac';
import { validate } from '../middleware/validate';
import {
    createResource,
    deleteResource,
    getResource,
    getResources,
    getResourceUsage,
    logResourceUsage,
    updateResource,
} from './resources.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * GET /resources
 * Get all resources
 */
router.get('/', getResources);

/**
 * GET /resources/:id
 * Get a single resource
 */
router.get('/:id', getResource);

/**
 * POST /resources
 * Create a new resource (requires EVENT_MANAGER or ADMIN role)
 */
router.post(
  '/',
  requireEventManager,
  validate([
    body('name').notEmpty().withMessage('Resource name is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('totalQuantity').isInt({ min: 0 }).withMessage('Total quantity must be a positive integer'),
    body('vendorId').optional().isUUID().withMessage('Invalid vendor ID'),
  ]),
  createResource
);

/**
 * PUT /resources/:id
 * Update a resource (requires EVENT_MANAGER or ADMIN role)
 */
router.put(
  '/:id',
  requireEventManager,
  validate([
    body('name').optional().notEmpty().withMessage('Resource name cannot be empty'),
    body('category').optional().notEmpty().withMessage('Category cannot be empty'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
    body('totalQuantity').optional().isInt({ min: 0 }).withMessage('Total quantity must be a positive integer'),
    body('vendorId').optional({ nullable: true }).isUUID().withMessage('Invalid vendor ID'),
  ]),
  updateResource
);

/**
 * DELETE /resources/:id
 * Delete a resource (requires EVENT_MANAGER or ADMIN role)
 */
router.delete('/:id', requireEventManager, deleteResource);

/**
 * GET /resources/:id/usage
 * Get resource usage logs
 */
router.get('/:id/usage', getResourceUsage);

/**
 * POST /resources/:id/usage
 * Log resource usage (requires STAFF or higher)
 */
router.post(
  '/:id/usage',
  requireStaff,
  validate([
    body('eventId').isUUID().withMessage('Valid event ID is required'),
    body('change').isInt().withMessage('Change must be an integer'),
    body('notes').optional().isString().withMessage('Notes must be a string'),
  ]),
  logResourceUsage
);

export default router;
