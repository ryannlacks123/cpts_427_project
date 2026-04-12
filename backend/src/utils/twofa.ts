import QRCode from 'qrcode';
import speakeasy from 'speakeasy';

const APP_NAME = process.env.APP_NAME || 'Event Resource Management';

/**
 * Generate a new 2FA secret for a user
 */
export const generate2FASecret = (email: string) => {
  const secret = speakeasy.generateSecret({
    name: `${APP_NAME} (${email})`,
    length: 32,
  });

  return {
    secret: secret.base32,
    otpauthUrl: secret.otpauth_url,
  };
};

/**
 * Generate a QR code for the 2FA secret
 */
export const generateQRCode = async (otpauthUrl: string): Promise<string> => {
  try {
    return await QRCode.toDataURL(otpauthUrl);
  } catch (error) {
    throw new Error('Failed to generate QR code');
  }
};

/**
 * Verify a TOTP token
 */
export const verify2FAToken = (token: string, secret: string): boolean => {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 2, // Allow 2 time steps before/after for clock drift
  });
};
