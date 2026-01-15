import { supabaseAdmin } from "@/lib/supabase/admin";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const monitor = data.monitor;
  const axiosClient = axios.create({
    validateStatus: () => true,
  });

  const start = Date.now();
  try {
    const res = await axiosClient.get(monitor.url, {
      timeout: monitor.timeout_seconds * 1000,
    });
    const responseTime = Date.now() - start;
    const isUp = res.status < 400;
    await supabaseAdmin.from("check_results").insert({
      monitor_id: monitor.id,
      status: isUp ? "up" : "down",
      status_code: res.status,
      response_time_ms: responseTime,
      error: isUp ? null : `HTTP ${res.status}`,
    });

    await supabaseAdmin
      .from("monitors")
      .update({
        last_checked_at: new Date().toISOString(),
      })
      .eq("id", monitor.id);
    return NextResponse.json(
      {
        message: "Monitor Checked!",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.log(error);
    const responseTime = Date.now() - start;
    let errorMessage = "Unknown error";

    if (axios.isAxiosError(error)) {
      if (error.code === "ECONNABORTED") {
        errorMessage = "Timeout";
      } else if (error.message) {
        errorMessage = error.message;
      }
    }
    await supabaseAdmin.from("check_results").insert({
      monitor_id: monitor.id,
      status: "down",
      status_code: null,
      response_time_ms: responseTime,
      error: errorMessage,
    });
    await supabaseAdmin
      .from("monitors")
      .update({
        last_checked_at: new Date().toISOString(),
      })
      .eq("id", monitor.id);
    return NextResponse.json(
      {
        message: "Monitor is down",
      },
      { status: 500 }
    );
  }
}
