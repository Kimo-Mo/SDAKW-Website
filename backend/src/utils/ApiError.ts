/**
 * Operational error class used throughout the application.
 *
 * Distinguishes expected, user-facing errors (isOperational = true)
 * from unexpected programmer errors (isOperational = false).
 * Only operational errors are forwarded to the client in production.
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Restore prototype chain (required when extending built-in classes in TS)
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
