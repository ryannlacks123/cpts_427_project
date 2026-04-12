import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import { requireEventManager } from '../middleware/rbac';
import { validate } from '../middleware/validate';
import {
    createVendor,
    deleteVendor,
    getVendor,
    getVendors,
    updateVendor,
} from './vendors.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * GET /vendors
 * Get all vendors
 */
router.get('/', getVendors);

/**
 * GET /vendors/:id
 * Get a single vendor
 */
router.get('/:id', getVendor);

/**
 * POST /vendors
 * Create a new vendor (requires EVENT_MANAGER or ADMIN role)
 */
router.post(
  '/',
  requireEventManager,
  validate([
    body('name').notEmpty().withMessage('Vendor name is required'),
    body('contactName').notEmpty().withMessage('Contact name is required'),
    body('contactEmail').isEmail().withMessage('Valid contact email is required'),
    body('phone').notEmpty().withMessage('Phone number is required'),
  ]),
  createVendor
);

/**
 * PUT /vendors/:id
 * Update a vendor (requires EVENT_MANAGER or ADMIN role)
 */
router.put(
  '/:id',
  requireEventManager,
  validate([
    body('name').optional().notEmpty().withMessage('Vendor name cannot be empty'),
    body('contactName').optional().notEmpty().withMessage('Contact name cannot be empty'),
    body('contactEmail').optional().isEmail().withMessage('Valid contact email is required'),
    body('phone').optional().notEmpty().withMessage('Phone number cannot be empty'),
  ]),
  updateVendor
);

/**
 * DELETE /vendors/:id
 * Delete a vendor (requires EVENT_MANAGER or ADMIN role)
 */
router.delete('/:id', requireEventManager, deleteVendor);

export default router;
