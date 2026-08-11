import { Request, Response, NextFunction } from 'express';
import { loginSchema, changePasswordSchema } from '../validators/auth.validator';
import { loginUser, getCurrentUser, changePassword } from '../services/auth.service';
import { AUTH_COOKIE_NAME, getAuthCookieOptions, getClearCookieOptions } from '../utils/cookie';
import { AuthRequest } from '../middleware/auth.middleware';

/**
 * POST /api/v1/auth/login
 * Validates credentials, sets the auth cookie, returns public user data.
 * The JWT is never included in the JSON body.
 */
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const input = loginSchema.parse(req.body);
    const { token, user } = await loginUser(input);

    res.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions());

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/auth/me
 * Returns the currently authenticated user's public profile.
 * Requires authenticate middleware — req.userId is guaranteed to be set.
 */
export const me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = req as AuthRequest;
    const user = await getCurrentUser(userId);

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/v1/auth/logout
 * Clears the auth cookie. Idempotent — safe to call even without a cookie.
 */
export const logout = (_req: Request, res: Response): void => {
  res.clearCookie(AUTH_COOKIE_NAME, getClearCookieOptions());

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

/**
 * PATCH /api/v1/auth/change-password
 * Changes the password, rotates the auth cookie with a fresh token.
 * Requires authenticate middleware — req.userId is guaranteed to be set.
 */
export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId } = req as AuthRequest;
    const input = changePasswordSchema.parse(req.body);
    const { token } = await changePassword(userId, input);

    // Rotate the cookie — old token is replaced immediately
    res.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions());

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (err) {
    next(err);
  }
};
