import { Env } from "../config/env.config";

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private isDevelopment = Env.NODE_ENV === 'development';

  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    
    if (data) {
      return `${prefix} ${message} ${JSON.stringify(data)}`;
    }
    
    return `${prefix} ${message}`;
  }

  info(message: string, data?: any): void {
    if (this.isDevelopment) {
      console.log(this.formatMessage('info', message, data));
    }
    // In production, you might want to send to a logging service
  }

  warn(message: string, data?: any): void {
    if (this.isDevelopment) {
      console.warn(this.formatMessage('warn', message, data));
    }
  }

  error(message: string, error?: any): void {
    const errorData = error ? {
      message: error.message,
      stack: error.stack,
      ...error
    } : undefined;
    
    if (this.isDevelopment) {
      console.error(this.formatMessage('error', message, errorData));
    }
    // In production, send to error tracking service
  }

  debug(message: string, data?: any): void {
    if (this.isDevelopment) {
      console.log(this.formatMessage('debug', message, data));
    }
  }
}

export const logger = new Logger(); 