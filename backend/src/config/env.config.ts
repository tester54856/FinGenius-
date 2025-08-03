import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().default("8000"),
  BASE_PATH: z.string().default("/api"),
  MONGO_URI: z.string(),
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  GEMINI_API_KEY: z.string(),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  RESEND_API_KEY: z.string(),
  RESEND_MAILER_SENDER: z.string().default("noreply@fingenius.com"),
  FRONTEND_ORIGIN: z.string().default("http://localhost:5173"),
});

const validateEnvironment = (): void => {
  const env = process.env;
  
  const requiredVars = [
    "MONGO_URI",
    "JWT_SECRET", 
    "JWT_REFRESH_SECRET",
    "GEMINI_API_KEY",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY", 
    "CLOUDINARY_API_SECRET",
    "RESEND_API_KEY"
  ];

  const missingVars = requiredVars.filter(varName => !env[varName]);
  
  if (missingVars.length > 0) {
    console.error("❌ Missing required environment variables:", missingVars);
    process.exit(1);
  }
};

export const Env = envSchema.parse(process.env);

export { validateEnvironment };
