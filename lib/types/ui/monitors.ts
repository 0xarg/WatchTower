export interface MonitorUI {
  id: string;
  name: string;
  url: string;
  status: string;
  lastChecked: string;
  avgResponseTime: number;
  isPaused: boolean;
}
