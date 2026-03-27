import { supabase } from './supabase';

const CACHE_DURATION = 60000; // 60 seconds
let cachedData = null;
let lastFetch = 0;

export const tournamentService = {
  /**
   * Fetches all tournaments from the unified backend (Supabase Edge Function)
   * This includes local Supabase tournaments and aggregated external API data.
   */
  async getAllTournaments() {
    const now = Date.now();
    
    // Check Cache
    if (cachedData && (now - lastFetch < CACHE_DURATION)) {
      console.log("Serving tournament data from cache (frontend)");
      return cachedData;
    }

    try {
      console.log("Invoking 'tournaments-all' Edge Function...");
      const { data, error } = await supabase.functions.invoke('tournaments-all', {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (error) throw error;

      console.log("Response Processed:", {
          live: data.live?.length,
          upcoming: data.upcoming?.length,
          completed: data.completed?.length
      });

      // Update Cache
      cachedData = data;
      lastFetch = now;
      
      return data;
    } catch (err) {
      console.error("Critical: Backend aggregation failed. Using local Supabase fallback.", err);
      
      // Fallback: Fetch directly from tournaments table if the edge function is down
      const { data: locals } = await supabase
        .from('tournaments')
        .select('*');
      
      const normalized = locals?.map(t => ({
          ...t,
          isLocal: true,
          status: this.classifyStatusLocal(t)
      })) || [];

      return {
          live: normalized.filter(t => t.status === 'live'),
          upcoming: normalized.filter(t => t.status === 'upcoming'),
          completed: normalized.filter(t => t.status === 'completed')
      };
    }
  },

  /**
   * Helper to classify a local tournament status based on current time.
   * UPCOMING: start_date > now
   * IN_PROGRESS: start_date <= now <= end_date
   * COMPLETED: end_date < now
   */
  classifyStatusLocal(t) {
    const now = new Date();
    const start = t.start_date ? new Date(t.start_date) : null;
    const end = t.end_date ? new Date(t.end_date) : null;
    
    if (!start) return 'upcoming';
    
    const nowTime = now.getTime();
    const startTime = start.getTime();
    const endTime = end ? end.getTime() : Infinity;
    
    if (nowTime < startTime) return 'upcoming';
    if (nowTime > endTime) return 'completed';
    return 'live';
  }
};
