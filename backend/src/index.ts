import "dotenv/config";
import "./config/passport.config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import passport from "passport";
import { Env } from "./config/env.config";
import { HTTPSTATUS } from "./config/http.config";
import errorHandler from "./middlewares/errorHandler.middleware";
import { BadRequestException } from "./utils/app-error";
import { asyncHandler } from "./middlewares/asyncHandler.middlerware";
import connectDB from "./config/database.config";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import transactionRoutes from "./routes/transaction.route";
// import { initializeCrons } from "./cron";
import reportRoutes from "./routes/report.route";
import { getDateRange } from "./utils/date";
import analyticsRoutes from "./routes/analytics.route";
// import { apiLimiter, authLimiter } from "./middlewares/rateLimit.middleware";

const app = express();
const BASE_PATH = Env.BASE_PATH;

// Security middleware
app.use(helmet());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(passport.initialize());

// CORS configuration for production
const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // For development, allow all origins
    if (Env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    // Allow all Vercel domains
    if (origin.includes('vercel.app') || origin.includes('localhost')) {
      return callback(null, true);
    }
    
    const allowedOrigins = [
      Env.FRONTEND_ORIGIN,
      'http://localhost:5173',
      'http://localhost:3000',
      'https://vercel.app',
      'https://*.vercel.app',
      'https://fin-genius-six.vercel.app',
      'https://*.fin-genius-six.vercel.app'
    ];
    
    // Check if origin is allowed
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin.includes('*')) {
        return origin.includes(allowedOrigin.replace('*', ''));
      }
      return origin === allowedOrigin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Apply rate limiting - temporarily disabled
// app.use(apiLimiter);

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(HTTPSTATUS.OK).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: Env.NODE_ENV,
  });
});

// Debug endpoint to check environment variables
app.get("/debug", (req: Request, res: Response) => {
  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    MONGO_URI: process.env.MONGO_URI ? 'Set' : 'Missing',
    JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Missing',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ? 'Set' : 'Missing',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY ? 'Set' : 'Missing',
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Missing',
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Missing',
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Missing',
    RESEND_API_KEY: process.env.RESEND_API_KEY ? 'Set' : 'Missing',
    FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN,
  };
  
  res.status(HTTPSTATUS.OK).json({
    status: "Debug Info",
    timestamp: new Date().toISOString(),
    environment: Env.NODE_ENV,
    envVars,
  });
});

// Remove test error route in production
if (Env.NODE_ENV === "development") {
  app.get(
    "/",
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      throw new BadRequestException("This is a test error");
      res.status(HTTPSTATUS.OK).json({
        message: "Hello Subscribe to the channel",
      });
    })
  );
}

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/user`, passport.authenticate("jwt", { session: false }), userRoutes);
app.use(`${BASE_PATH}/transaction`, passport.authenticate("jwt", { session: false }), transactionRoutes);
app.use(`${BASE_PATH}/report`, passport.authenticate("jwt", { session: false }), reportRoutes);
app.use(`${BASE_PATH}/analytics`, passport.authenticate("jwt", { session: false }), analyticsRoutes);

app.use(errorHandler);

const server = app.listen(Env.PORT, async () => {
  await connectDB();

  // Initialize cron jobs in development
  if (Env.NODE_ENV === "development") {
    // await initializeCrons();
  }

  console.log(`Server is running on port ${Env.PORT} in ${Env.NODE_ENV} mode`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});