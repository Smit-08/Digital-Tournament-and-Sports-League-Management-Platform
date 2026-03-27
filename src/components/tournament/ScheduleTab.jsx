import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Gavel, Calendar, MapPin, Users, HelpCircle, ShieldCheck, Play, ArrowRight, Target, Activity } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const ScheduleTab = ({ tournamentId }) => {
  const navigate = useNavigate()
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMatches()
    const channel = supabase
      .channel('matches_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'matches', filter: `tournament_id=eq.${tournamentId}` }, () => {
        fetchMatches()
      })
      .subscribe()

    return () => channel.unsubscribe()
  }, [tournamentId])

  const fetchMatches = async () => {
    try {
      setLoading(true)
      
      // Handle Global IDs
      if (typeof tournamentId === 'string' && (tournamentId.startsWith('global-') || tournamentId.startsWith('cricket-') || tournamentId.startsWith('ipl-'))) {
        if (tournamentId.includes('ipl')) {
           // Inject IPL Opening Match
           setMatches([{
             id: 'match-ipl-1',
             match_time: '2026-03-28T19:30:00Z',
             status: 'scheduled',
             team1: { name: 'Chennai Super Kings' },
             team2: { name: 'Royal Challengers Bengaluru' },
             venue: { name: 'M. A. Chidambaram Stadium' }
           }]);
        } else {
           // For other global ones, show a single placeholder or fetch from TheSportsDB
           setMatches([]);
        }
        return;
      }

      const { data, error } = await supabase
        .from('matches')
        .select('*, team1:teams!matches_team1_id_fkey(name, logo), team2:teams!matches_team2_id_fkey(name, logo), venue:venues(name)')
        .eq('tournament_id', tournamentId)
        .order('match_time', { ascending: true })

      if (error) throw error
      setMatches(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Action Header */}
      <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black font-rajdhani flex items-center gap-3">
              <Calendar className="w-6 h-6 text-arena-accent" />
              DEPLOYMENT SCHEDULE <span className="text-gray-600 font-normal">({matches.length})</span>
          </h3>
          <div className="flex gap-4">
              <button className="px-6 py-2 glass-panel hover:bg-white/5 transition-colors text-xs font-black uppercase tracking-widest text-gray-400">BRACKET VIEW</button>
              <button className="btn-premium flex items-center gap-2 group">
                  <Calendar className="w-5 h-5" />
                  <span>NEW ENGAGEMENT</span>
              </button>
          </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          {[1,2,3].map(i => (
            <div key={i} className="glass-panel h-48 animate-pulse bg-white/5 shadow-inner" />
          ))}
        </div>
      ) : matches.length === 0 ? (
        <div className="glass-panel p-20 text-center border-dashed border-white/10 opacity-60">
            <Activity className="w-16 h-16 text-gray-700 mx-auto mb-4 opacity-50" />
            <h4 className="text-xl font-bold font-rajdhani text-gray-500 uppercase">NO DEPLOYMENTS SCHEDULED</h4>
            <p className="text-gray-600 mt-2 font-rajdhani text-sm uppercase tracking-widest">Waiting for tournament organizers to finalize strategic engagements.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {matches.map(match => (
            <div key={match.id} className="glass-panel overflow-hidden group hover:border-arena-accent/30 transition-all bg-white/[0.01]">
                <div className="flex flex-col md:flex-row items-stretch">
                   
                    {/* Time Indicator */}
                    <div className="w-full md:w-32 bg-white/5 flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r border-white/5">
                        <p className="text-[10px] font-black text-gray-500 tracking-[0.3em] uppercase mb-1">Engage at</p>
                        <p className="text-2xl font-black font-rajdhani tracking-tighter">
                            {new Date(match.match_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-[10px] font-bold text-arena-accent uppercase font-rajdhani opacity-50 tracking-wider">
                             {new Date(match.match_time).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </p>
                    </div>

                    {/* Main Match Body */}
                    <div className="flex-1 p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center">
                            
                            {/* Team 1 */}
                            <div className="flex items-center gap-6 justify-end">
                                <span className="text-xl font-black font-rajdhani uppercase tracking-tighter group-hover:text-arena-accent transition-colors">{match.team1?.name}</span>
                                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-3 group-hover:bg-white/10 transition-colors shadow-2xl">
                                    <Shield className="w-10 h-10 text-arena-accent opacity-50" />
                                </div>
                            </div>

                            {/* Versus Section */}
                            <div className="flex flex-col items-center justify-center">
                                <div className="text-[10px] font-black text-gray-600 tracking-[0.5em] uppercase mb-4 italic">VERSUS</div>
                                <div className="px-4 py-1.5 rounded-full bg-arena-accent/10 border border-arena-accent/20 text-arena-accent text-[9px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                                    {match.status}
                                </div>
                            </div>

                            {/* Team 2 */}
                            <div className="flex items-center gap-6 justify-start">
                                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-3 group-hover:bg-white/10 transition-colors shadow-2xl">
                                    <Shield className="w-10 h-10 text-arena-secondary opacity-50" />
                                </div>
                                <span className="text-xl font-black font-rajdhani uppercase tracking-tighter group-hover:text-arena-secondary transition-colors">{match.team2?.name}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Info & CTA */}
                    <div className="w-full md:w-64 bg-black/40 p-8 flex flex-col justify-center gap-4">
                        <div className="flex items-center gap-2 text-xs text-gray-500 uppercase font-black tracking-widest italic overflow-hidden whitespace-nowrap">
                            <MapPin className="w-3 h-3 shrink-0" />
                            <span>{match.venue?.name || match.referee_name || "CENTRAL STADIUM"}</span>
                        </div>
                        <button 
                          onClick={() => navigate(`/live/${match.id}`)}
                          className="w-full py-3 glass-panel hover:bg-white/10 transition-colors text-[10px] font-black tracking-[0.2em] uppercase italic flex items-center justify-center gap-2"
                        >
                             INITIALIZE LINK <ArrowRight className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const Shield = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
)

export default ScheduleTab
