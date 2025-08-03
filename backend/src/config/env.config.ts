import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().default("8000"),
  BASE_PATH: z.string().default("/api"),
  MONGO_URI: z.string().optional(),
  JWT_SECRET: z.string().optional(),
  JWT_REFRESH_SECRET: z.string().optional(),
  JWT_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  GEMINI_API_KEY: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  RESEND_MAILER_SENDER: z.string().default("noreply@fingenius.com"),
  FRONTEND_ORIGIN: z.string().default("http://localhost:5173"),
});

const validateEnvironment = (): void => {
  const env = process.env;
  
  const requiredVars = [
    "MONGO_URI",
    "JWT_SECRET", 
    "JWT_REFRESH_SECRET"
  ];

  const missingVars = requiredVars.filter(varName => !env[varName]);
  
  if (missingVars.length > 0) {
    console.error("❌ Missing required environment variables:", missingVars);
    console.error("Available variables:", Object.keys(env));
    // Don't exit in production, just log the error
    if (process.env.NODE_ENV === "development") {
      process.exit(1);
    }
  }
};

export const Env = envSchema.parse(process.env);

export { validateEnvironment };
