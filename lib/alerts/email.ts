import { EmailTemplate } from "@/components/email-template";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmailAlert(params: {
  email: string;
  subject: string;
  message: string;
  monitorName: string;
  monitorUrl: string;
}) {
  const email = params.email;
  const message = params.message;
  const monitorName = params.monitorName;
  const monitorUrl = params.monitorUrl;
  const subject = params.subject;

  try {
    const { data, error } = await resend.emails.send({
      from: "WatchTower <no-reply@send.anuragx.dev",
      to: [email],
      subject,
      react: EmailTemplate({ message, monitorName, monitorUrl }),
    });
    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
}
