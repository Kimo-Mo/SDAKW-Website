import { Request, Response, NextFunction } from 'express';

/**
 * Wraps an async Express handler so ESLint's no-misused-promises rule is satisfied.
 * Express route callbacks must return void; this wrapper catches rejected promises
 * and forwards them to the next() error handler automatically.
 *
 * Usage:
 *   router.get('/route', wrap(asyncHandler));
 */
export const wrap =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
