import { Resend } from "resend";
import { Env } from "../config/env.config";
import { reportTemplate } from "./templates/report.template";

const resend = new Resend(Env.RESEND_API_KEY);

interface ReportEmailData {
  to: string;
  reportData: any;
}

export const sendReportEmail = async (emailData: ReportEmailData): Promise<any> => {
  try {
    const { data, error } = await resend.emails.send({
      from: Env.RESEND_MAILER_SENDER,
      to: emailData.to,
      subject: "Your FinGenius Financial Report",
      html: reportTemplate(emailData.reportData),
    });

    if (error) {
      console.error("Report email sending error:", error);
      throw new Error("Failed to send report email");
    }

    return data;
  } catch (error) {
    console.error("Report email service error:", error);
    throw new Error("Report email service unavailable");
  }
};
