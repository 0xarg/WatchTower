import { MonitorDB } from "./types/database/monitors";
import { MonitorUI } from "./types/ui/monitors";
import { formatDistanceToNow } from "date-fns";

export const mapToUI = (data: MonitorDB[]): MonitorUI[] => {
  return data.map((monitor) => ({
    id: monitor.id,
    name: monitor.name,
    url: monitor.url,
    isPaused: monitor.is_paused,

    // Default to 0 if null
    avgResponseTime: monitor.avg_response_time || 0,

    // Default to 'pending' or 'down' if no check found yet
    status: monitor.latest_status || "pending",

    // Convert timestamp to relative time
    lastChecked: monitor.last_checked_at
      ? formatDistanceToNow(new Date(monitor.last_checked_at), {
          addSuffix: true,
        })
      : "Never",
  }));
};
