import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import { requireEventManager } from '../middleware/rbac';
import { validate } from '../middleware/validate';
import {
    allocateResource,
    deallocateResource,
    getEventResources,
    updateResourceAllocation,
} from './eventResources.controller';

const router = Router({ mergeParams: true }); // Merge params from parent router

// All routes require authentication
router.use(authenticate);

/**
 * GET /events/:eventId/resources
 * Get all resources allocated to an event
 */
router.get('/', getEventResources);

/**
 * POST /events/:eventId/resources
 * Allocate a resource to an event (requires EVENT_MANAGER or ADMIN role)
 */
router.post(
  '/',
  requireEventManager,
  validate([
    body('resourceId').isUUID().withMessage('Valid resource ID is required'),
    body('allocatedQuantity').isInt({ min: 1 }).withMessage('Allocated quantity must be at least 1'),
  ]),
  allocateResource
);

/**
 * PUT /events/:eventId/resources/:resourceId
 * Update resource allocation (requires EVENT_MANAGER or ADMIN role)
 */
router.put(
  '/:resourceId',
  requireEventManager,
  validate([
    body('allocatedQuantity').isInt({ min: 1 }).withMessage('Allocated quantity must be at least 1'),
  ]),
  updateResourceAllocation
);

/**
 * DELETE /events/:eventId/resources/:resourceId
 * Remove resource allocation (requires EVENT_MANAGER or ADMIN role)
 */
router.delete('/:resourceId', requireEventManager, deallocateResource);

export default router;
