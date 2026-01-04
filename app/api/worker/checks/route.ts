import { supabaseAdmin } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST() {
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
      query.is("last_checked_at", null);
    }

    const { error: claimError, data: claimed } = await query.select("id");

    if (claimError || !claimed || claimed.length === 0) {
      console.log(
        `Monitor ${monitor.id} was already claimed by another worker.`
      );
      continue;
    }
    claimedMonitor++;
  }

  return NextResponse.json({
    message: `Checked ${monitors.length}, claimed ${claimedMonitor}`,
  });
}
