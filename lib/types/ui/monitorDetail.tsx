// 1. Grandchild: Alert (inside Incident)
export interface Alert {
  id: string;
  channel: string; // e.g., 'email', 'discord'
  sent_at: string;
  success: boolean;
}

// 2. Child: Check Result
export interface CheckResult {
  id: string;
  status: string; // status_code usually, or text if you changed it
  response_time_ms: number;
  status_code: number;
  created_at: string;
  error: string | null;
}

// 3. Child: Incident
export interface Incident {
  id: string;
  started_at: string;
  resolved_at: string | null; // Nullable because it might still be open
  is_open: boolean;
  // Nested relation
  alerts: Alert[];
}

// 4. Main Parent: Monitor (The full object you get back)
export interface MonitorDetail {
  id: string;
  user_id: string;
  name: string;
  url: string;
  interval_seconds: number;
  timeout_seconds: number;
  is_paused: boolean;
  last_checked_at: string | null;
  created_at: string;

  // These come from the .select() joins
  check_results: CheckResult[];
  incidents: Incident[];
}
