import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { AppError } from "../utils/app-error";
import { ErrorCode } from "../enums/error-code.enum";

interface ErrorWithCode extends Error {
  code?: string;
  statusCode?: number;
}

const errorHandler = (
  error: ErrorWithCode,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let errorCode = ErrorCode.INTERNAL_SERVER_ERROR;

  // Handle multer errors
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      statusCode = 400;
      message = "File size too large. Maximum size is 5MB.";
      errorCode = ErrorCode.FILE_TOO_LARGE;
    } else if (error.code === "LIMIT_FILE_COUNT") {
      statusCode = 400;
      message = "Too many files uploaded.";
      errorCode = ErrorCode.TOO_MANY_FILES;
    } else {
      statusCode = 400;
      message = "File upload error.";
      errorCode = ErrorCode.FILE_UPLOAD_ERROR;
    }
  }
  // Handle AppError
  else if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    errorCode = error.errorCode;
  }
  // Handle validation errors
  else if (error.name === "ValidationError") {
    statusCode = 400;
    message = "Validation Error";
    errorCode = ErrorCode.VALIDATION_ERROR;
  }
  // Handle cast errors (MongoDB)
  else if (error.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
    errorCode = ErrorCode.INVALID_ID;
  }
  // Handle duplicate key errors
  else if (error.code === "11000") {
    statusCode = 409;
    message = "Duplicate field value";
    errorCode = ErrorCode.DUPLICATE_ENTRY;
  }
  // Handle JWT errors
  else if (error.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
    errorCode = ErrorCode.INVALID_TOKEN;
  }
  // Handle JWT expired errors
  else if (error.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
    errorCode = ErrorCode.TOKEN_EXPIRED;
  }

  // Log error in development
  if (process.env.NODE_ENV === "development") {
    console.error("Error:", error);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message,
      ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    },
  });
};

export default errorHandler;
