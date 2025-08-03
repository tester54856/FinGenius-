import mongoose from "mongoose";
import UserModel from "../models/user.model";
import { NotFoundException, UnauthorizedException } from "../utils/app-error";
import {
  LoginSchemaType,
  RegisterSchemaType,
} from "../validators/auth.validator";
import ReportSettingModel from "../models/report-setting.model";
import { calulateNextReportDate } from "../utils/helper";
import { signJwtToken } from "../utils/jwt";

export const registerService = async (body: RegisterSchemaType) => {
  const { email } = body;

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const existingUser = await UserModel.findOne({ email }).session(session);
      if (existingUser) throw new UnauthorizedException("User already exists");

      const newUser = new UserModel({
        ...body,
      });

      await newUser.save({ session });

      const reportSetting = new ReportSettingModel({
        userId: newUser._id,
        frequency: "MONTHLY",
        isEnabled: true,
        nextReportDate: calulateNextReportDate(),
        lastSentDate: null,
      });
      await reportSetting.save({ session });

      return { user: newUser.omitPassword() };
    });
  } catch (error) {
    throw error;
  } finally {
    await session.endSession();
  }
};

export const loginService = async (body: LoginSchemaType) => {
  const { email, password } = body;
  
  console.log(`🔍 Attempting login for email: ${email}`);
  
  try {
    const user = await UserModel.findOne({ email });
    
    if (!user) {
      console.log(`❌ User not found for email: ${email}`);
      throw new NotFoundException("Email/password not found");
    }

    console.log(`✅ User found: ${user.name}`);

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      console.log(`❌ Invalid password for user: ${email}`);
      throw new UnauthorizedException("Invalid email/password");
    }

    console.log(`✅ Password validated for user: ${email}`);

    const { token, expiresAt } = signJwtToken({ userId: user.id });

    console.log(`✅ JWT token created for user: ${email}`);

    const reportSetting = await ReportSettingModel.findOne(
      {
        userId: user.id,
      },
      { _id: 1, frequency: 1, isEnabled: 1 }
    ).lean();

    console.log(`✅ Report setting found for user: ${email}`);

    console.log(`🎉 Login successful for user: ${email}`);

    return {
      user: user.omitPassword(),
      accessToken: token,
      expiresAt,
      reportSetting,
    };
  } catch (error) {
    console.error(`❌ Login error for ${email}:`, error);
    throw error;
  }
};
