import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../utils';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(`[Error] ${error.message}`);

  // Handle custom AppError
  if (error instanceof ValidationError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errors: error.errors,
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }

  // Handle unexpected errors
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};
