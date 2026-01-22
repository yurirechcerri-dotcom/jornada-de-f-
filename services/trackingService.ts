
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserTracking } from '../types';

export const trackingService = {
  async getCompletions(userId: string): Promise<UserTracking[]> {
    if (!isSupabaseConfigured()) {
      const stored = localStorage.getItem(`tracking_${userId}`);
      return stored ? JSON.parse(stored) : [];
    }

    const { data, error } = await supabase
      .from('user_tracking')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  },

  async completeDay(userId: string, contentId: string, intention?: string, notes?: string): Promise<void> {
    if (!isSupabaseConfigured()) {
      const stored = localStorage.getItem(`tracking_${userId}`);
      const tracking: UserTracking[] = stored ? JSON.parse(stored) : [];
      
      const exists = tracking.some(t => t.content_id === contentId);
      if (!exists) {
        tracking.push({
          id: Math.random().toString(36).substr(2, 9),
          user_id: userId,
          content_id: contentId,
          completed_at: new Date().toISOString(),
          notes,
          intention
        });
        localStorage.setItem(`tracking_${userId}`, JSON.stringify(tracking));
      }
      return;
    }

    const { error } = await supabase
      .from('user_tracking')
      .upsert({ 
        user_id: userId, 
        content_id: contentId, 
        intention, 
        notes,
        completed_at: new Date().toISOString()
      }, { onConflict: 'user_id,content_id' });

    if (error) throw error;
  }
};
