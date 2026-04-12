import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import { requireEventManager } from '../middleware/rbac';
import { validate } from '../middleware/validate';
import {
    createEvent,
    deleteEvent,
    getEvent,
    getEvents,
    updateEvent,
} from './events.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * GET /events
 * Get all events
 */
router.get('/', getEvents);

/**
 * GET /events/:id
 * Get a single event
 */
router.get('/:id', getEvent);

/**
 * POST /events
 * Create a new event (requires EVENT_MANAGER or ADMIN role)
 */
router.post(
  '/',
  requireEventManager,
  validate([
    body('name').notEmpty().withMessage('Event name is required'),
    body('location').notEmpty().withMessage('Location is required'),
    body('startDatetime').isISO8601().withMessage('Valid start datetime is required'),
    body('endDatetime').isISO8601().withMessage('Valid end datetime is required'),
    body('description').notEmpty().withMessage('Description is required'),
  ]),
  createEvent
);

/**
 * PUT /events/:id
 * Update an event (requires EVENT_MANAGER or ADMIN role)
 */
router.put(
  '/:id',
  requireEventManager,
  validate([
    body('name').optional().notEmpty().withMessage('Event name cannot be empty'),
    body('location').optional().notEmpty().withMessage('Location cannot be empty'),
    body('startDatetime').optional().isISO8601().withMessage('Valid start datetime is required'),
    body('endDatetime').optional().isISO8601().withMessage('Valid end datetime is required'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  ]),
  updateEvent
);

/**
 * DELETE /events/:id
 * Delete an event (requires EVENT_MANAGER or ADMIN role)
 */
router.delete('/:id', requireEventManager, deleteEvent);

export default router;
