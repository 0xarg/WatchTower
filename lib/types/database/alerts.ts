export interface alerts {
  id: string;
  incident_id: string;
  channel: string;
  sent_at: Date;
  success: boolean;
}
