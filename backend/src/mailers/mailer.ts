import { Resend } from "resend";
import { Env } from "../config/env.config";

const resend = new Resend(Env.RESEND_API_KEY);

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (emailData: EmailData): Promise<any> => {
  try {
    const { data, error } = await resend.emails.send({
      from: Env.RESEND_MAILER_SENDER,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
    });

    if (error) {
      console.error("Email sending error:", error);
      throw new Error("Failed to send email");
    }

    return data;
  } catch (error) {
    console.error("Email service error:", error);
    throw new Error("Email service unavailable");
  }
};
