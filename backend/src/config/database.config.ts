import mongoose from "mongoose";
import { getEnv } from "../utils/get-env";

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = getEnv("MONGO_URI");
    
    if (!mongoURI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    const options: any = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    };

    await mongoose.connect(mongoURI, options);
    
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
