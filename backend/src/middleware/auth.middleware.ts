import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../utils/jwt';
import { ApiError } from '../utils/ApiError';
import { AUTH_COOKIE_NAME } from '../utils/cookie';

// Extend Express's Request type so downstream handlers get a typed userId
// Using module augmentation inside the file (no-namespace-safe approach)
interface AuthRequest extends Request {
  userId: string;
}

/**
 * Reads the auth cookie, verifies the JWT, and attaches userId to the request.
 *
 * Returns 401 for:
 *   - Missing cookie
 *   - Invalid token signature
 *   - Expired token
 *
 * The generic error message prevents leaking implementation details.
 */
export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  let token: string | undefined;

  // 1. Check HTTP-only cookie
  if (req.cookies && typeof req.cookies[AUTH_COOKIE_NAME] === 'string') {
    token = req.cookies[AUTH_COOKIE_NAME];
  }

  // 2. Fallback to Authorization: Bearer <token> (e.g. for iOS Safari ITP cross-site cookie restrictions)
  if (!token && typeof req.headers.authorization === 'string' && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.slice(7).trim();
  }

  if (!token) {
    return next(new ApiError(401, 'Authentication required'));
  }

  try {
    const payload = verifyToken(token);
    (req as AuthRequest).userId = payload.userId;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return next(new ApiError(401, 'Session expired, please log in again'));
    }
    return next(new ApiError(401, 'Invalid authentication token'));
  }
};

// Re-export the type so controllers can use it if needed
export type { AuthRequest };
