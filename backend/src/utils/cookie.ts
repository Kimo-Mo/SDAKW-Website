import { CookieOptions } from 'express';
import { env } from '../config/env';

export const AUTH_COOKIE_NAME = 'auth_token';

/**
 * Returns cookie options appropriate for the current environment.
 *
 * Production (Render backend + Vercel frontend — cross-origin):
 *   - secure: true  → HTTPS only
 *   - sameSite: 'none' → required for cross-origin credentialed requests
 *
 * Development (localhost):
 *   - secure: false
 *   - sameSite: 'lax'
 *
 * maxAge is derived from JWT_EXPIRES_IN. The JWT and cookie lifetimes
 * are intentionally kept in sync — the cookie doesn't outlive the token.
 */
export const getAuthCookieOptions = (): CookieOptions => {
  const isProduction = env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: parseDurationMs(env.JWT_EXPIRES_IN),
    path: '/',
  };
};

/**
 * Options for clearing the auth cookie.
 * Must match the original cookie's path/domain/secure/sameSite attributes
 * or browsers will not delete the cookie.
 */
export const getClearCookieOptions = (): CookieOptions => {
  const isProduction = env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  };
};

/**
 * Converts a simple duration string (e.g. "7d", "24h", "30m") to milliseconds.
 * Falls back to 7 days if the format is not recognized.
 */
const parseDurationMs = (duration: string): number => {
  const match = /^(\d+)([smhd])$/.exec(duration);
  if (!match) return 7 * 24 * 60 * 60 * 1000;

  const value = parseInt(match[1], 10);
  const unit = match[2];

  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return value * (multipliers[unit] ?? 0);
};
