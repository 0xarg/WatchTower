export interface AlertUI {
  id: string;
  channel: string; // e.g., 'email', 'discord'
  sent_at: string;
  success: boolean;
  incidents: {
    monitors: {
      name: string;
    };
  };
}
