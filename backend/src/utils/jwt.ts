import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface JWTPayload {
  userId: string;
  email: string;
  roles: string[];
}

/**
 * Generate a JWT token
 */
export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

/**
 * Verify and decode a JWT token
 */
export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Generate a short-lived token for 2FA verification
 */
export const generate2FAToken = (userId: string): string => {
  return jwt.sign({ userId, purpose: '2fa' }, JWT_SECRET, {
    expiresIn: '10m',
  });
};

/**
 * Verify a 2FA token
 */
export const verify2FAToken = (token: string): { userId: string } => {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    if (payload.purpose !== '2fa') {
      throw new Error('Invalid token purpose');
    }
    return { userId: payload.userId };
  } catch (error) {
    throw new Error('Invalid or expired 2FA token');
  }
};
