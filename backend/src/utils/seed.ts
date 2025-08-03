import mongoose from "mongoose";
import UserModel from "../models/user.model";
import ReportSettingModel, { ReportFrequencyEnum } from "../models/report-setting.model";
import { calulateNextReportDate } from "./helper";
import { Env } from "../config/env.config";

const seedUser = async () => {
  try {
    // Check if test user already exists
    const existingUser = await UserModel.findOne({ email: "dfstevemiller11@gmail.com" });
    
    if (existingUser) {
      console.log("✅ Test user already exists");
      return;
    }

    // Create test user
    const testUser = new UserModel({
      name: "Steve Miller",
      email: "dfstevemiller11@gmail.com",
      password: "miller@123", // This will be hashed by the pre-save hook
    });

    await testUser.save();

    // Create report setting for the user
    const reportSetting = new ReportSettingModel({
      userId: testUser._id,
      frequency: ReportFrequencyEnum.MONTHLY,
      isEnabled: true,
      nextReportDate: calulateNextReportDate(),
      lastSentDate: null,
    });

    await reportSetting.save();

    console.log("✅ Test user created successfully");
    console.log("📧 Email: dfstevemiller11@gmail.com");
    console.log("🔑 Password: miller@123");
  } catch (error) {
    console.error("❌ Error seeding user:", error);
  }
};

const runSeed = async () => {
  try {
    await mongoose.connect(Env.MONGO_URI);
    console.log("🔗 Connected to MongoDB");
    
    await seedUser();
    
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
};

// Run seed if this file is executed directly
if (require.main === module) {
  runSeed();
}

export { seedUser }; 