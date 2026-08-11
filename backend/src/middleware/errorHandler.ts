import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Error as MongooseError } from 'mongoose';
import multer from 'multer';
import { ApiError } from '../utils/ApiError';
import { env } from '../config/env';

/**
 * Converts known error types into a normalized ApiError before sending
 * the response. Handles:
 *  - ApiError (our own operational errors)
 *  - ZodError (validation failures)
 *  - Mongoose ValidationError / CastError / duplicate key (11000)
 *  - Anything else (unexpected server errors)
 *
 * In production, stack traces and internal details are never sent to clients.
 */
export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  // Our own operational errors
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(env.NODE_ENV === 'development' && { stack: err.stack }),
    });
    return;
  }

  // Zod validation errors
  if (err instanceof ZodError) {
    const message = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');

    res.status(400).json({
      success: false,
      message: `Validation error: ${message}`,
    });
    return;
  }

  // Multer errors (file upload validation)
  if (err instanceof multer.MulterError) {
    const multerMessages: Record<string, string> = {
      LIMIT_FILE_SIZE: 'File size is too large.',
      LIMIT_FILE_COUNT: 'Too many files uploaded.',
      LIMIT_UNEXPECTED_FILE:
        'Unexpected file field. Please use the correct field name for uploading images.',
    };

    const message =
      multerMessages[err.code] ??
      'Unexpected file field. Please use the correct field name for uploading images.';

    res.status(400).json({ success: false, message });
    return;
  }

  // Mongoose validation errors
  if (err instanceof MongooseError.ValidationError) {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join('; ');

    res.status(400).json({
      success: false,
      message: `Validation error: ${message}`,
    });
    return;
  }

  // Mongoose CastError (e.g. invalid ObjectId)
  if (err instanceof MongooseError.CastError) {
    res.status(400).json({
      success: false,
      message: `Invalid value for field: ${err.path}`,
    });
    return;
  }

  // MongoDB duplicate key error
  if (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code: unknown }).code === 11000
  ) {
    const keyValue = (err as { keyValue?: Record<string, unknown> }).keyValue ?? {};
    const field = Object.keys(keyValue)[0] ?? 'field';
    res.status(409).json({
      success: false,
      message: `Duplicate value for ${field}. Please use a different value.`,
    });
    return;
  }

  // Unexpected / programmer errors
  console.error('Unexpected error:', err);

  res.status(500).json({
    success: false,
    message:
      env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err instanceof Error
          ? err.message
          : 'Internal server error',
    ...(env.NODE_ENV === 'development' && err instanceof Error && { stack: err.stack }),
  });
};
