export interface MonitorDB {
  id: string;
  user_id: string;
  name: string;
  url: string;
  latest_status: string;
  avg_response_time: number;
  interval_seconds: number;
  timeout_seconds: number;
  is_paused: boolean;
  last_checked_at: Date;
  created_at: Date;
}
