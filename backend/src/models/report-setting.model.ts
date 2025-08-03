import mongoose, { Document, Schema } from "mongoose";

export interface ReportSettingDocument extends Document {
  userId: mongoose.Types.ObjectId;
  frequency: "daily" | "weekly" | "monthly";
  dayOfWeek?: number;
  dayOfMonth?: number;
  time: string;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const reportSettingSchema = new Schema<ReportSettingDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      default: "weekly",
    },
    dayOfWeek: {
      type: Number,
      min: 0,
      max: 6,
      default: 1, // Monday
    },
    dayOfMonth: {
      type: Number,
      min: 1,
      max: 31,
      default: 1,
    },
    time: {
      type: String,
      default: "09:00",
    },
    isEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ReportSettingDocument>("ReportSetting", reportSettingSchema);
