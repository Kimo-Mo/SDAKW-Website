import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

/**
 * Catch-all handler for routes that do not match any registered endpoint.
 * Must be registered after all route definitions.
 */
export const notFound = (_req: Request, _res: Response, next: NextFunction): void => {
  next(
    new ApiError(404, `Route ${_req.originalUrl} not found or Method ${_req.method} not allowed`),
  );
};
