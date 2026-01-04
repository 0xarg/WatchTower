export interface check_results {
  id: string;
  monitor_id: string;
  status: string;
  status_code: number;
  response_time_ms: number;
  error: string;
  created_at: Date;
}
