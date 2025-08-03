import mongoose from "mongoose";
import { z } from "zod";
import Transaction from "../models/transaction.model";
import ReportSettingModel from "../models/report-setting.model";
import ReportModel from "../models/report.model";
import { AppError } from "../utils/app-error";
import { ErrorCode } from "../enums/error-code.enum";
import { calulateNextReportDate } from "../utils/helper";
import { sendReportEmail } from "../mailers/report.mailer";
import { NotFoundException } from "../utils/app-error";
import { UpdateReportSettingType } from "../validators/report.validator";
import { convertToDollarUnit } from "../utils/format-currency";
import { format } from "date-fns";
import { genAI, genAIModel } from "../config/google-ai.config";
import { createUserContent } from "@google/genai";
import { reportInsightPrompt } from "../utils/prompt";

export const getAllReportsService = async (
  userId: string,
  pagination: {
    pageSize: number;
    pageNumber: number;
  }
) => {
  const query: Record<string, any> = { userId };

  const { pageSize, pageNumber } = pagination;
  const skip = (pageNumber - 1) * pageSize;

  const [reports, totalCount] = await Promise.all([
    ReportModel.find(query).skip(skip).limit(pageSize).sort({ createdAt: -1 }),
    ReportModel.countDocuments(query),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    reports,
    pagination: {
      pageSize,
      pageNumber,
      totalCount,
      totalPages,
      skip,
    },
  };
};

export const updateReportSettingService = async (
  userId: string,
  updateData: any
): Promise<any> => {
  try {
    const existingReportSetting = await ReportSettingModel.findOne({ userId });

    if (!existingReportSetting) {
      // Create new report setting
      const newReportSetting = new ReportSettingModel({
        userId,
        ...updateData,
      });
      await newReportSetting.save();
      return {
        success: true,
        data: newReportSetting,
      };
    }

    // Update existing report setting
    const updatedReportSetting = await ReportSettingModel.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return {
      success: true,
      data: updatedReportSetting,
    };
  } catch (error) {
    console.error("Update report setting error:", error);
    throw new AppError(
      "Failed to update report setting",
      500,
      ErrorCode.INTERNAL_SERVER_ERROR
    );
  }
};

export const generateReportService = async (
  userId: string,
  dateRange: { start: Date; end: Date }
): Promise<any> => {
  try {
    const results = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: {
            $gte: dateRange.start,
            $lte: dateRange.end,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: {
              $cond: [
                { $eq: ["$type", "income"] },
                "$amount",
                0,
              ],
            },
          },
          totalExpense: {
            $sum: {
              $cond: [
                { $eq: ["$type", "expense"] },
                "$amount",
                0,
              ],
            },
          },
          transactionCount: { $sum: 1 },
        },
      },
    ]);

    const expenseBreakdown = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: {
            $gte: dateRange.start,
            $lte: dateRange.end,
          },
          type: "expense",
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { total: -1 },
      },
    ]);

    if (
      !results?.length ||
      (results[0]?.totalIncome === 0 && results[0]?.totalExpense === 0)
    )
      return null;

    const {
      totalIncome = 0,
      totalExpense = 0,
      transactionCount = 0,
    } = results[0] || {};

    console.log(results[0], "results");

    const byCategory = expenseBreakdown.reduce(
      (acc: any, { _id, total }: any) => {
        acc[_id] = {
          amount: convertToDollarUnit(total),
          percentage:
            totalExpense > 0 ? Math.round((total / totalExpense) * 100) : 0,
        };
        return acc;
      },
      {} as Record<string, { amount: number; percentage: number }>
    );

    const availableBalance = totalIncome - totalExpense;
    const savingsRate = calculateSavingRate(totalIncome, totalExpense);

    const periodLabel = `${format(dateRange.start, "MMMM d")} - ${format(dateRange.end, "d, yyyy")}`;

    const insights = await generateInsightsAI({
      totalIncome,
      totalExpense,
      availableBalance,
      savingsRate,
      categories: byCategory,
      periodLabel: periodLabel,
    });

    return {
      period: periodLabel,
      summary: {
        income: convertToDollarUnit(totalIncome),
        expenses: convertToDollarUnit(totalExpense),
        balance: convertToDollarUnit(availableBalance),
        savingsRate: Number(savingsRate.toFixed(1)),
        topCategories: Object.entries(byCategory)?.map(([name, cat]: any) => ({
          name,
          amount: cat.amount,
          percent: cat.percentage,
        })),
      },
      insights,
    };
  } catch (error) {
    console.error("Generate report error:", error);
    throw new AppError(
      "Failed to generate report",
      500,
      ErrorCode.INTERNAL_SERVER_ERROR
    );
  }
};

async function generateInsightsAI({
  totalIncome,
  totalExpense,
  availableBalance,
  savingsRate,
  categories,
  periodLabel,
}: {
  totalIncome: number;
  totalExpense: number;
  availableBalance: number;
  savingsRate: number;
  categories: Record<string, { amount: number; percentage: number }>;
  periodLabel: string;
}) {
  try {
    const prompt = reportInsightPrompt({
      totalIncome: convertToDollarUnit(totalIncome),
      totalExpenses: convertToDollarUnit(totalExpense),
      availableBalance: convertToDollarUnit(availableBalance),
      savingsRate: Number(savingsRate.toFixed(1)),
      categories,
      periodLabel,
    });

    const result = await genAI.models.generateContent({
      model: genAIModel,
      contents: [createUserContent([prompt])],
      config: {
        responseMimeType: "application/json",
      },
    });

    const response = result.text;
    const cleanedText = response?.replace(/```(?:json)?\n?/g, "").trim();

    if (!cleanedText) return [];

    const data = JSON.parse(cleanedText);
    return data;
  } catch (error) {
    return [];
  }
}

function calculateSavingRate(totalIncome: number, totalExpense: number) {
  if (totalIncome <= 0) return 0;
  const savingRate = ((totalIncome - totalExpense) / totalIncome) * 100;
  return parseFloat(savingRate.toFixed(2));
}
