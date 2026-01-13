import { EmailTemplate } from "@/components/email-template";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmailAlert(params: {
  email: string;
  status: string;
  message: string;
  monitorName: string;
  monitorUrl: string;
  startedAt: string;
}) {
  const email = params.email;
  const message = params.message;
  const monitorName = params.monitorName;
  const monitorUrl = params.monitorUrl;
  const status = params.status;
  const started_at = params.startedAt;

  try {
    let subject;
    if (status === "down") {
      subject = ` WatchTower Alert: ${monitorName} is DOWN`;
    } else if (status === "up") {
      subject = ` WatchTower: ${monitorName} is UP`;
    } else {
      subject = `WatchTower: ${monitorName} status update`;
    }
    const { data, error } = await resend.emails.send({
      from: "WatchTower <no-reply@anuragx.dev>",
      to: [email],
      subject,
      react: EmailTemplate({
        message,
        monitorName,
        monitorUrl,
        status: status,
        startedAt: started_at,
      }),
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
