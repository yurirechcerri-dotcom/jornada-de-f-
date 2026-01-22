
export type ContentType = '7_days' | '21_days' | 'morning';

export interface ContentItem {
  id: string;
  journey_id: string; // Adicionado para identificar a jornada temática
  type: ContentType;
  day_number: number;
  title: string;
  verse: string;
  reference: string;
  reflection?: string;
  prayer?: string;
  task_json?: {
    task?: string;
    [key: string]: any;
  };
}

export interface UserTracking {
  id: string;
  user_id: string;
  content_id: string;
  completed_at: string;
  notes?: string;
  intention?: string;
}

export interface Profile {
  id: string;
  user_id: string;
  display_name: string;
  created_at: string;
}
