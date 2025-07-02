import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default error status code
  let statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  let message = err.message || 'Something went wrong';
  let errors = err.errors;

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = StatusCodes.BAD_REQUEST;
    message = 'Validation Error';
    errors = {};
    
    if (err.details) {
      err.details.forEach((error: any) => {
        errors[error.context.key] = error.message;
      });
    } else if (err.errors) {
      Object.keys(err.errors).forEach((key) => {
        errors[key] = err.errors[key].message;
      });
    }
  } else if (err.name === 'UnauthorizedError') {
    statusCode = StatusCodes.UNAUTHORIZED;
    message = 'Unauthorized';
  } else if (err.name === 'ForbiddenError') {
    statusCode = StatusCodes.FORBIDDEN;
    message = 'Forbidden';
  } else if (err.name === 'NotFoundError') {
    statusCode = StatusCodes.NOT_FOUND;
    message = 'Resource not found';
  } else if (err.name === 'RateLimitExceeded') {
    statusCode = StatusCodes.TOO_MANY_REQUESTS;
    message = 'Too many requests, please try again later';
  }

  // Log the error
  logger.error({
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : {},
    status: statusCode,
    path: req.path,
    method: req.method,
    ip: req.ip,
    user: req.user ? req.user.id : 'anonymous',
  });

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export class ApiError extends Error {
  statusCode: number;
  errors?: any;

  constructor(
    statusCode: number,
    message: string,
    errors?: any,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export class BadRequestError extends ApiError {
  constructor(message = 'Bad Request', errors?: any) {
    super(400, message, errors);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(401, message);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden') {
    super(403, message);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Not Found') {
    super(404, message);
  }
}

export class InternalServerError extends ApiError {
  constructor(message = 'Internal Server Error') {
    super(500, message);
  }
}
