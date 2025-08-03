import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import ReportSettingModel from "../../models/report-setting.model";
import { UserDocument } from "../../models/user.model";
import mongoose from "mongoose";
import { generateReportService } from "../../services/report.service";
import ReportModel from "../../models/report.model";
import { calulateNextReportDate } from "../../utils/helper";
import { sendReportEmail } from "../../mailers/report.mailer";

export const processReportJob = async () => {
  const now = new Date();

  let processedCount = 0;
  let failedCount = 0;

  // Get Last Month because this will run on the first of the month
  const from = startOfMonth(subMonths(now, 1));
  const to = endOfMonth(subMonths(now, 1));

  try {
    const reportSettingCursor = ReportSettingModel.find({
      isActive: true,
    })
      .populate<{ userId: UserDocument }>("userId")
      .cursor();

    console.log("Running report job");

    for await (const setting of reportSettingCursor) {
      const user = setting.userId as UserDocument;
      if (!user) {
        console.log(`User not found for setting: ${setting._id}`);
        continue;
      }

      const session = await mongoose.startSession();

      try {
        const report = await generateReportService(user.id, { 
          start: from, 
          end: to 
        });

        console.log("Report data:", report);

        let emailSent = false;
        if (report) {
          try {
            await sendReportEmail({
              to: user.email!,
              reportData: report,
            });
            emailSent = true;
            console.log(`Email sent successfully to ${user.email}`);
          } catch (emailError) {
            console.error(`Email failed for ${user.email}:`, emailError);
          }
        }

        // Create report record
        await ReportModel.create({
          userId: user._id,
          title: `Monthly Report - ${format(from, "MMMM yyyy")}`,
          description: "Automated monthly financial report",
          type: "summary",
          dateRange: {
            start: from,
            end: to,
          },
          data: report || {},
          status: report ? (emailSent ? "completed" : "failed") : "pending",
          createdAt: now,
          updatedAt: now,
        });

        // Update report setting
        await ReportSettingModel.findByIdAndUpdate(
          setting._id,
          {
            $set: {
              updatedAt: now,
            },
          }
        );

        processedCount++;
        console.log(`✅ Processed report for user: ${user.email}`);

      } catch (error) {
        console.error(`❌ Failed to process report for user ${user.email}:`, error);
        failedCount++;
      } finally {
        await session.endSession();
      }
    }

    console.log(`✅ Processed: ${processedCount} reports`);
    console.log(`❌ Failed: ${failedCount} reports`);

    return {
      success: true,
      processedCount,
      failedCount,
    };
  } catch (error) {
    console.error("Error processing reports:", error);
    return {
      success: false,
      error: "Report process failed",
    };
  }
};
