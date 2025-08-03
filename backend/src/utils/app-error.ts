import { ErrorCode } from '../enums/error-code.enum';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: ErrorCode;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    errorCode: ErrorCode = ErrorCode.INTERNAL_SERVER_ERROR,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = isOperational;

    // Capture stack trace, excluding constructor call from it
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error().stack;
    }
  }
}

// Specific error classes
export class ValidationError extends AppError {
  constructor(message: string, errorCode?: ErrorCode) {
    super(message, 400, errorCode || ErrorCode.VALIDATION_ERROR);
  }
}

export class NotFoundException extends AppError {
  constructor(message: string, errorCode?: ErrorCode) {
    super(message, 404, errorCode || ErrorCode.RESOURCE_NOT_FOUND);
  }
}

export class UnauthorizedException extends AppError {
  constructor(message: string, errorCode?: ErrorCode) {
    super(message, 401, errorCode || ErrorCode.ACCESS_UNAUTHORIZED);
  }
}

export class BadRequestException extends AppError {
  constructor(message: string, errorCode?: ErrorCode) {
    super(message, 400, errorCode || ErrorCode.VALIDATION_ERROR);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, errorCode?: ErrorCode) {
    super(message, 409, errorCode || ErrorCode.DUPLICATE_ENTRY);
  }
}

export class InternalServerException extends AppError {
  constructor(message: string, errorCode?: ErrorCode) {
    super(message, 500, errorCode || ErrorCode.INTERNAL_SERVER_ERROR);
  }
}
