import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useCricketLive = (matchId, isGlobal = false, enabled = true) => {
  const [liveInfo, setLiveInfo] = useState({
    runs: 0,
    wickets: 0,
    overs: '0.0',
    target: null,
    batsmen: [],
    bowlers: [],
    lastEvents: []
  });
  const [loading, setLoading] = useState(enabled);

  useEffect(() => {
    if (!matchId || !enabled) return;

    const fetchLiveStats = async () => {
      if (isGlobal) {
        const apiKey = import.meta.env.VITE_CRICKET_DATA_API_KEY;
        if (!apiKey) {
          // Provide a realistic mock for IPL 2026 if no key
          setLiveInfo({
            runs: 164, wickets: 3, overs: '16.4', target: 182,
            batsmen: [
              { name: 'Ruturaj Gaikwad', runs: 58, balls: 42, strikeRate: 138.1 },
              { name: 'Shivam Dube', runs: 24, balls: 12, strikeRate: 200.0 }
            ],
            bowlers: [{ name: 'Mohammed Siraj', figures: '1/32 (3.4)' }],
            lastEvents: ['4', '1', '6', 'wd', '0', '1']
          });
          setLoading(false);
          return;
        }

        try {
          const res = await fetch(`https://api.cricapi.com/v1/match_info?apikey=${apiKey}&id=${matchId}`);
          const data = await res.json();
          
          if (data.status === "success" && data.data) {
            const m = data.data;
            // Map CricAPI data to our local liveInfo structure
            setLiveInfo({
              runs: m.score?.find(s => s.inning === "Inning 1")?.r || 0,
              wickets: m.score?.find(s => s.inning === "Inning 1")?.w || 0,
              overs: m.score?.find(s => s.inning === "Inning 1")?.o || '0.0',
              target: m.score?.find(s => s.inning === "Inning 2") ? m.score[0].r : null,
              batsmen: m.bbb?.slice(0, 2).map(b => ({ name: b.batsman, runs: b.runs, balls: b.balls, strikeRate: ((b.runs/b.balls)*100).toFixed(1) })) || [],
              bowlers: m.bbb?.slice(0, 1).map(b => ({ name: b.bowler, figures: `${b.wickets}/${b.runs} (${b.overs})` })) || [],
              lastEvents: m.bbb?.slice(0, 6).map(b => b.runs.toString()) || ['0', '1', '4', '0', 'w', '1']
            });
          }
        } catch (err) {
          console.error("Cricket API Error:", err);
        }
        setLoading(false);
      } else {
        // Fetch from Supabase scores table
        const { data } = await supabase
          .from('scores')
          .select('stats_json')
          .eq('match_id', matchId)
          .single();
        
        if (data?.stats_json) {
          setLiveInfo(data.stats_json);
        }
        setLoading(false);
      }
    };

    fetchLiveStats();

    // Subscribe to real-time updates if local
    if (!isGlobal) {
      const channel = supabase
        .channel(`cricket_live_${matchId}`)
        .on('postgres_changes', { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'scores',
          filter: `match_id=eq.${matchId}`
        }, (payload) => {
          if (payload.new.stats_json) {
            setLiveInfo(payload.new.stats_json);
          }
        })
        .subscribe();

      return () => channel.unsubscribe();
    }
  }, [matchId, isGlobal, enabled]);

  return { liveInfo, loading };
};
