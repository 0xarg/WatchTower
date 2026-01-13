export interface IncidentUI {
  id: string;
  started_at: string;
  resolved_at: string | null; // Nullable because it might still be open
  is_open: boolean;
  monitors: {
    id: string;
    name: string;
    url: string;
  };
}
