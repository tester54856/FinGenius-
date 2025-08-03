import { HTTPSTATUS, HttpStatusCodeType } from "../config/http.config";
import { ErrorCode } from "../enums/error-code.enum";

export class AppError extends Error {
  public statusCode: number;
  public errorCode: ErrorCode;
  public isOperational: boolean;

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

    // Capture stack trace
    if (Error.captureStackTrace && typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class HttpException extends AppError {
  constructor(
    message = "Http Exception Error",
    statusCode: HttpStatusCodeType,
    errorCode?: ErrorCode
  ) {
    super(message, statusCode, errorCode);
  }
}

export class NotFoundException extends AppError {
  constructor(message = "Resource not found", errorCode?: ErrorCode) {
    super(
      message,
      HTTPSTATUS.NOT_FOUND,
      errorCode || ErrorCode.RESOURCE_NOT_FOUND
    );
  }
}

export class BadRequestException extends AppError {
  constructor(message = "Bad Request", errorCode?: ErrorCode) {
    super(
      message,
      HTTPSTATUS.BAD_REQUEST,
      errorCode || ErrorCode.VALIDATION_ERROR
    );
  }
}

export class UnauthorizedException extends AppError {
  constructor(message = "Unauthorized Access", errorCode?: ErrorCode) {
    super(
      message,
      HTTPSTATUS.UNAUTHORIZED,
      errorCode || ErrorCode.ACCESS_UNAUTHORIZED
    );
  }
}

export class InternalServerException extends AppError {
  constructor(
    message = "Internal Server Error",
    errorCode?: ErrorCode
  ) {
    super(
      message,
      HTTPSTATUS.INTERNAL_SERVER_ERROR,
      errorCode || ErrorCode.INTERNAL_SERVER_ERROR
    );
  }
}
