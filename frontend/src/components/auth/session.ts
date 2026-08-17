import axios from 'axios';

/**
 * Single TanStack Query key representing the verified admin session.
 * Successful login, successful logout, and every shared 401 response
 * invalidate or remove this key.
 */
export const AUTH_SESSION_QUERY_KEY = ['auth', 'session'] as const;

/**
 * Classifies an Axios failure as unauthorized (HTTP 401). This is the only
 * place the frontend infers session expiry from an API response; it never
 * reads cookie or JWT content.
 */
export function isUnauthorizedError(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 401;
}
