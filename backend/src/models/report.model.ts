import mongoose, { Document, Schema } from "mongoose";

export interface ReportDocument extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  type: "expense" | "income" | "summary";
  dateRange: {
    start: Date;
    end: Date;
  };
  data: any;
  status: "pending" | "completed" | "failed";
  fileUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema = new Schema<ReportDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    type: {
      type: String,
      enum: ["expense", "income", "summary"],
      default: "summary",
    },
    dateRange: {
      start: {
        type: Date,
        required: true,
      },
      end: {
        type: Date,
        required: true,
      },
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    fileUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ReportDocument>("Report", reportSchema);

