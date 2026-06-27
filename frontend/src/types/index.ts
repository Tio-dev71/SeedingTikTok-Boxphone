export interface User {
  id: string;
  email: string;
  full_name: string;
  role: "admin" | "coordinator" | "operator";
  is_active: boolean;
  created_at: string;
}

export interface LiveSession {
  id: string;
  title: string;
  tiktok_live_url: string | null;
  start_time: string | null;
  note: string | null;
  status: "preparing" | "live" | "paused" | "ended";
  created_by: string;
  created_at: string;
  ended_at: string | null;
}

export interface CommentTemplate {
  id: string;
  content: string;
  target_group: string;
  reminder_interval_seconds: number;
  priority: "low" | "medium" | "high";
  note: string | null;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}
