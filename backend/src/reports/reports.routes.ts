import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
    getInventoryAvailability,
    getLowStockAlerts,
    getResourceUsageByEvent,
    getUsageOverTime,
    getVendorResourceUsage,
} from './reports.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * GET /reports/events/:eventId/usage
 * Get resource usage by event
 */
router.get('/events/:eventId/usage', getResourceUsageByEvent);

/**
 * GET /reports/vendors/usage
 * Get vendor-based resource usage
 */
router.get('/vendors/usage', getVendorResourceUsage);

/**
 * GET /reports/inventory/availability
 * Get inventory availability report
 */
router.get('/inventory/availability', getInventoryAvailability);

/**
 * GET /reports/usage/timeline
 * Get usage over time report
 * Query params: startDate, endDate (ISO format)
 */
router.get('/usage/timeline', getUsageOverTime);

/**
 * GET /reports/alerts/low-stock
 * Get low stock alerts
 * Query param: threshold (decimal, e.g., 0.2 for 20%)
 */
router.get('/alerts/low-stock', getLowStockAlerts);

export default router;
