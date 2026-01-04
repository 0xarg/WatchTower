export interface Monitors {
  id: string;
  user_id: string;
  name: string;
  url: string;
  interval_seconds: number;
  timeout_seconds: number;
  is_paused: boolean;
  last_checked_at: Date;
  created_at: Date;
}
