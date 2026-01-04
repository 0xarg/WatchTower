export interface incidents {
  id: string;
  monitor_id: string;
  started_at: Date;
  resolved_at?: Date;
  is_open: boolean;
}
