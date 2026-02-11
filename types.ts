
export type ContentType = '7_days' | '21_days' | 'morning' | 'bible_reading';

export interface ContentItem {
  id: string;
  journey_id: string;
  type: ContentType;
  day_number: number;
  title: string;
  verse: string;
  reference: string;
  reflection?: string;
  prayer?: string; // Mapeado como Oração Final
  initial_prayer?: string; // Nova propriedade
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

export interface BibleBook {
  id: string;
  name: string;
  abbreviation: string;
  chapters: number;
  testament: 'old' | 'new';
}
