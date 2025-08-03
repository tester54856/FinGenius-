import { getEnv } from "../utils/get-env";

const validateEnvironment = () => {
  const requiredEnvVars = [
    'MONGO_URI',
    'JWT_SECRET',
    'GEMINI_API_KEY',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'RESEND_API_KEY',
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    console.error('Please set these variables in your environment or .env file');
    // Don't throw error in development to allow for easier setup
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
  }
};

const envConfig = () => {
  // Validate environment variables
  validateEnvironment();

  return {
    NODE_ENV: getEnv("NODE_ENV", "development"),

    PORT: getEnv("PORT", "8000"),
    BASE_PATH: getEnv("BASE_PATH", "/api"),
    MONGO_URI: getEnv("MONGO_URI"),

    JWT_SECRET: getEnv("JWT_SECRET", "secert_jwt"),
    JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN", "15m") as string,

    JWT_REFRESH_SECRET: getEnv("JWT_REFRESH_SECRET", "secert_jwt_refresh"),
    JWT_REFRESH_EXPIRES_IN: getEnv("JWT_REFRESH_EXPIRES_IN", "7d") as string,

    GEMINI_API_KEY: getEnv("GEMINI_API_KEY"),

    CLOUDINARY_CLOUD_NAME: getEnv("CLOUDINARY_CLOUD_NAME"),
    CLOUDINARY_API_KEY: getEnv("CLOUDINARY_API_KEY"),
    CLOUDINARY_API_SECRET: getEnv("CLOUDINARY_API_SECRET"),

    RESEND_API_KEY: getEnv("RESEND_API_KEY"),
    RESEND_MAILER_SENDER: getEnv("RESEND_MAILER_SENDER", ""),

    FRONTEND_ORIGIN: getEnv("FRONTEND_ORIGIN", "localhost"),
  };
};

export const Env = envConfig();
