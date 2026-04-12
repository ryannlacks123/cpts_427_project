import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
    confirm2FA,
    disable2FA,
    enable2FA,
    getProfile,
    login,
    register,
    verify2FA,
} from './auth.controller';

const router = Router();

/**
 * POST /auth/register
 * Register a new user
 */
router.post(
  '/register',
  validate([
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),
    body('name').notEmpty().withMessage('Name is required'),
  ]),
  register
);

/**
 * POST /auth/login
 * Login user
 */
router.post(
  '/login',
  validate([
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ]),
  login
);

/**
 * POST /auth/2fa/verify
 * Verify 2FA code
 */
router.post(
  '/2fa/verify',
  validate([
    body('tempToken').notEmpty().withMessage('Temporary token is required'),
    body('code').notEmpty().withMessage('2FA code is required'),
  ]),
  verify2FA
);

/**
 * POST /auth/2fa/enable
 * Enable 2FA for authenticated user
 */
router.post('/2fa/enable', authenticate, enable2FA);

/**
 * POST /auth/2fa/confirm
 * Confirm 2FA setup
 */
router.post(
  '/2fa/confirm',
  authenticate,
  validate([body('code').notEmpty().withMessage('2FA code is required')]),
  confirm2FA
);

/**
 * POST /auth/2fa/disable
 * Disable 2FA
 */
router.post(
  '/2fa/disable',
  authenticate,
  validate([body('password').notEmpty().withMessage('Password is required')]),
  disable2FA
);

/**
 * GET /auth/profile
 * Get current user profile
 */
router.get('/profile', authenticate, getProfile);

export default router;
