import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../utils/db';
import { generate2FAToken, generateToken, verify2FAToken as verifyJWT2FAToken } from '../utils/jwt';
import { comparePassword, hashPassword } from '../utils/password';
import { generate2FASecret, generateQRCode, verify2FAToken } from '../utils/twofa';

/**
 * Register a new user
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'User already exists with this email' });
      return;
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        is2faEnabled: true,
        createdAt: true,
      },
    });

    // Assign default VIEWER role
    const viewerRole = await prisma.role.findUnique({ where: { name: 'VIEWER' } });
    if (viewerRole) {
      await prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: viewerRole.id,
        },
      });
    }

    res.status(201).json({
      message: 'User registered successfully',
      user,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

/**
 * Login user - returns 2FA token if 2FA is enabled, otherwise returns JWT
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.passwordHash);
    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // If 2FA is enabled, return a temporary token
    if (user.is2faEnabled) {
      const tempToken = generate2FAToken(user.id);
      res.json({
        require2FA: true,
        tempToken,
        message: 'Please provide 2FA code',
      });
      return;
    }

    // Generate JWT token
    const roles = user.userRoles.map(ur => ur.role.name);
    const token = generateToken({
      userId: user.id,
      email: user.email,
      roles,
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
};

/**
 * Verify 2FA code and return JWT
 */
export const verify2FA = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tempToken, code } = req.body;

    // Verify temp token
    const { userId } = verifyJWT2FAToken(tempToken);

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user || !user.twoFaSecret) {
      res.status(401).json({ error: 'Invalid request' });
      return;
    }

    // Verify 2FA code
    const isValid = verify2FAToken(code, user.twoFaSecret);
    if (!isValid) {
      res.status(401).json({ error: 'Invalid 2FA code' });
      return;
    }

    // Generate JWT token
    const roles = user.userRoles.map(ur => ur.role.name);
    const token = generateToken({
      userId: user.id,
      email: user.email,
      roles,
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles,
      },
    });
  } catch (error) {
    console.error('2FA verification error:', error);
    res.status(500).json({ error: 'Failed to verify 2FA code' });
  }
};

/**
 * Enable 2FA for the authenticated user
 */
export const enable2FA = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const userId = req.user.userId;

    // Find user
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Generate 2FA secret
    const { secret, otpauthUrl } = generate2FASecret(user.email);
    const qrCode = await generateQRCode(otpauthUrl!);

    // Store secret temporarily (will be confirmed when user verifies)
    await prisma.user.update({
      where: { id: userId },
      data: { twoFaSecret: secret },
    });

    res.json({
      secret,
      qrCode,
      message: 'Scan the QR code with your authenticator app and verify with a code',
    });
  } catch (error) {
    console.error('Enable 2FA error:', error);
    res.status(500).json({ error: 'Failed to enable 2FA' });
  }
};

/**
 * Confirm 2FA setup by verifying a code
 */
export const confirm2FA = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { code } = req.body;
    const userId = req.user.userId;

    // Find user
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.twoFaSecret) {
      res.status(400).json({ error: 'No 2FA setup in progress' });
      return;
    }

    // Verify code
    const isValid = verify2FAToken(code, user.twoFaSecret);
    if (!isValid) {
      res.status(401).json({ error: 'Invalid 2FA code' });
      return;
    }

    // Enable 2FA
    await prisma.user.update({
      where: { id: userId },
      data: { is2faEnabled: true },
    });

    res.json({ message: '2FA enabled successfully' });
  } catch (error) {
    console.error('Confirm 2FA error:', error);
    res.status(500).json({ error: 'Failed to confirm 2FA' });
  }
};

/**
 * Disable 2FA for the authenticated user
 */
export const disable2FA = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { password } = req.body;
    const userId = req.user.userId;

    // Find user
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.passwordHash);
    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid password' });
      return;
    }

    // Disable 2FA
    await prisma.user.update({
      where: { id: userId },
      data: {
        is2faEnabled: false,
        twoFaSecret: null,
      },
    });

    res.json({ message: '2FA disabled successfully' });
  } catch (error) {
    console.error('Disable 2FA error:', error);
    res.status(500).json({ error: 'Failed to disable 2FA' });
  }
};

/**
 * Get current user profile
 */
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        name: true,
        is2faEnabled: true,
        createdAt: true,
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      is2faEnabled: user.is2faEnabled,
      roles: user.userRoles.map(ur => ur.role.name),
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};
