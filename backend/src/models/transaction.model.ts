import mongoose, { Document, Schema } from "mongoose";
import { convertToCents, convertToDollarUnit } from "../utils/format-currency";

export enum TransactionStatusEnum {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum RecurringIntervalEnum {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

export enum TransactionTypeEnum {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}

export enum PaymentMethodEnum {
  CARD = "CARD",
  BANK_TRANSFER = "BANK_TRANSFER",
  MOBILE_PAYMENT = "MOBILE_PAYMENT",
  AUTO_DEBIT = "AUTO_DEBIT",
  CASH = "CASH",
  OTHER = "OTHER",
}

export interface TransactionDocument extends Document {
  userId: string;
  title: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  date: Date;
  description?: string;
  isRecurring: boolean;
  recurringInterval?: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
  nextRecurringDate?: Date;
  lastProcessed?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<TransactionDocument>(
  {
    userId: {
      type: String,
      required: true,
      index: true, // Add index for user queries
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      set: (value: number) => convertToCents(value),
      get: (value: number) => convertToDollarUnit(value),
    },
    type: {
      type: String,
      required: true,
      enum: ["INCOME", "EXPENSE"],
      index: true, // Add index for type filtering
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true, // Add index for category filtering
    },
    date: {
      type: Date,
      required: true,
      index: true, // Add index for date range queries
    },
    description: {
      type: String,
      trim: true,
    },
    isRecurring: {
      type: Boolean,
      default: false,
      index: true, // Add index for recurring transactions
    },
    recurringInterval: {
      type: String,
      enum: ["DAILY", "WEEKLY", "MONTHLY", "YEARLY"],
    },
    nextRecurringDate: {
      type: Date,
      index: true, // Add index for cron job queries
    },
    lastProcessed: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for common query patterns
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, type: 1 });
transactionSchema.index({ userId: 1, category: 1 });
transactionSchema.index({ userId: 1, isRecurring: 1 });
transactionSchema.index({ nextRecurringDate: 1, isRecurring: 1 });

const TransactionModel = mongoose.model<TransactionDocument>(
  "Transaction",
  transactionSchema
);

export default TransactionModel;
