import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface JwtPayload {
  userId: string;
}

/**
 * Signs a JWT containing only the user's ID.
 * Secret and expiry come exclusively from environment variables.
 */
export const signToken = (userId: string): string => {
  return jwt.sign({ userId } satisfies JwtPayload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
};

/**
 * Verifies a JWT and returns the decoded payload.
 * Throws a JsonWebTokenError / TokenExpiredError on failure —
 * the auth middleware handles those and converts them to 401 responses.
 */
export const verifyToken = (token: string): JwtPayload => {
  const decoded = jwt.verify(token, env.JWT_SECRET);

  if (typeof decoded === 'string' || !('userId' in decoded)) {
    throw new jwt.JsonWebTokenError('Invalid token payload');
  }

  return decoded as JwtPayload;
};
