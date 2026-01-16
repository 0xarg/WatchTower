import { sendEmailAlert } from "@/lib/alerts/email";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { MonitorDB } from "@/lib/types/database/monitors";
import axios from "axios";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let isUp;
  const secret = req.headers.get("x-watchtower-secret");

  if (secret !== process.env.WORKER_SECRET) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const { data: monitors, error } = await supabaseAdmin
    .from("monitors")
    .select("*")
    .eq("is_paused", false);

  if (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Failed",
      },
      { status: 500 }
    );
  }

  const now = Date.now();
  let claimedMonitor = 0;

  const dueMonitors = monitors.filter((m) => {
    if (!m.last_checked_at) return true;

    const last = new Date(m.last_checked_at).getTime();

    return now - last >= m.interval_seconds * 1000;
  });

  const axiosClient = axios.create({
    validateStatus: () => true,
  });

  for (const monitor of dueMonitors) {
    let query = supabaseAdmin
      .from("monitors")
      .update({
        last_checked_at: new Date().toISOString(),
      })
      .eq("id", monitor.id);

    if (monitor.last_checked_at) {
      query = query.eq("last_checked_at", monitor.last_checked_at);
    } else {
      query = query.is("last_checked_at", null);
    }

    const { error: claimError, data: claimed } = await query.select("id");

    if (claimError || !claimed || claimed.length === 0) {
      console.log(
        `Monitor ${monitor.id} was already claimed by another worker.`
      );
      continue;
    }

    claimedMonitor++;

    const start = Date.now();
    try {
      const res = await axiosClient.get(monitor.url, {
        timeout: monitor.timeout_seconds * 1000,
      });
      const responseTime = Date.now() - start;
      isUp = res.status < 400;
      await supabaseAdmin.from("check_results").insert({
        monitor_id: monitor.id,
        status: isUp ? "up" : "down",
        status_code: res.status,
        response_time_ms: responseTime,
        error: isUp ? null : `HTTP ${res.status}`,
      });
    } catch (error: unknown) {
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
    }

    const { data: recentChecks } = await supabaseAdmin
      .from("check_results")
      .select("status")
      .eq("monitor_id", monitor.id)
      .order("created_at", { ascending: false })
      .limit(2);
    const { data: openIncident } = await supabaseAdmin
      .from("incidents")
      .select("*")
      .eq("monitor_id", monitor.id)
      .eq("is_open", true)
      .maybeSingle();

    if (!recentChecks) {
      continue;
    }

    const allDown =
      recentChecks.length === 2 &&
      recentChecks.every((c) => c.status === "down");

    if (allDown && !openIncident) {
      const { data: incident } = await supabaseAdmin
        .from("incidents")
        .insert({
          monitor_id: monitor.id,
          started_at: new Date().toISOString(),
          is_open: true,
        })
        .select("*")
        .single();
      if (incident) {
        const { data: user, error: userError } =
          await supabaseAdmin.auth.admin.getUserById(monitor.user_id);
        if (userError || !user || !user.user.email) {
          console.log("Failed to fetch user email", userError);
          continue;
        }
        const email = user.user.email;
        const { data: existingAlert } = await supabaseAdmin
          .from("alerts")
          .select("id")
          .eq("incident_id", incident.id)
          .eq("channel", "email")
          .eq("success", true)
          .maybeSingle();
        if (!existingAlert) {
          try {
            const results = await sendEmailAlert({
              message: "Your application is down1, please take action",
              email,
              monitorName: monitor.name,
              monitorUrl: monitor.url,
              status: isUp ? "up" : "down",
              startedAt: incident.started_at,
            });
            await supabaseAdmin.from("alerts").insert({
              incident_id: incident.id,
              channel: "email",
              success: results.success,
            });
          } catch (error) {
            console.error("Error sending email", error);
            continue;
          }
        }
      }
    }

    if (openIncident && recentChecks.length > 0) {
      if (recentChecks[0].status === "up") {
        const { data: resolvedIncident } = await supabaseAdmin
          .from("incidents")
          .update({
            is_open: false,
            resolved_at: new Date().toISOString(),
          })
          .eq("id", openIncident.id)
          .select("*")
          .single();

        if (resolvedIncident) {
          const { data: user, error: userError } =
            await supabaseAdmin.auth.admin.getUserById(monitor.user_id);
          if (userError || !user || !user.user.email) {
            console.error("Failed to fetch user email", userError);
            continue;
          }

          const email = user.user.email;
          try {
            const results = await sendEmailAlert({
              message: "Your application is Up, don't worry",
              email,
              monitorName: monitor.name,
              monitorUrl: monitor.url,
              status: isUp ? "up" : "down",
              startedAt: openIncident.started_at,
            });
            await supabaseAdmin.from("alerts").insert({
              incident_id: resolvedIncident.id,
              channel: "email",
              success: results.success,
            });
          } catch (error) {
            console.error("Failed to sent resolved mail", error);
            continue;
          }
        }
      } else if (recentChecks[0].status === "down") {
        const { data: user, error: userError } =
          await supabaseAdmin.auth.admin.getUserById(monitor.user_id);
        if (userError || !user || !user.user.email) {
          console.log("Failed to fetch user email", userError);
          continue;
        }
        const email = user.user.email;
        const { data: existingAlert } = await supabaseAdmin
          .from("alerts")
          .select("id")
          .eq("incident_id", openIncident.id)
          .eq("channel", "email")
          .eq("success", true)
          .maybeSingle();
        if (!existingAlert) {
          try {
            const results = await sendEmailAlert({
              message: "Your application is down2, please take action",
              email,
              monitorName: monitor.name,
              monitorUrl: monitor.url,
              status: recentChecks[0].status,
              startedAt: openIncident.started_at,
            });
            await supabaseAdmin.from("alerts").insert({
              incident_id: openIncident.id,
              channel: "email",
              success: results.success,
            });
          } catch (error) {
            console.error("Error sending email", error);
            continue;
          }
        }
      }
    }
  }

  return NextResponse.json({
    message: `Checked ${monitors.length}, claimed ${claimedMonitor}`,
  });
}
