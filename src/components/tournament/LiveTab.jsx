import React, { useState, useEffect } from 'react'
import { Play, Activity, Target, Users, Layout, Shield, TrendingUp, ArrowRight, MessageSquare, Send } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const LiveTab = ({ tournamentId }) => {
  const [liveMatches, setLiveMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLiveMatches()
    const channel = supabase
      .channel('live_matches_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'matches', filter: `tournament_id=eq.${tournamentId}` }, () => {
        fetchLiveMatches()
      })
      .subscribe()

    return () => channel.unsubscribe()
  }, [tournamentId])

  const fetchLiveMatches = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *, 
          team1:teams!matches_team1_id_fkey(name, logo), 
          team2:teams!matches_team2_id_fkey(name, logo),
          commentary:match_commentary(id, commentary, event_time, is_important)
        `)
        .eq('tournament_id', tournamentId)
        .eq('status', 'live')
        .order('match_time', { ascending: false })

      if (error) throw error
      setLiveMatches(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-20 text-center animate-pulse text-gray-600 font-rajdhani text-xl tracking-widest uppercase italic uppercase tracking-tighter italic">TUNING INTO LIVE NEURAL FEED...</div>

  if (liveMatches.length === 0) return (
    <div className="glass-panel p-20 text-center border-dashed border-white/10 opacity-60">
        <Play className="w-16 h-16 text-gray-700 mx-auto mb-4 opacity-50" />
        <h4 className="text-xl font-bold font-rajdhani text-gray-500 uppercase">NO ACTIVE OPERATIONS</h4>
        <p className="text-gray-600 mt-2 font-rajdhani text-sm uppercase tracking-widest italic">The battlefield is currently silent. Check the schedule for upcoming engagements.</p>
    </div>
  )

  const activeMatch = liveMatches[0]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-fadeIn">
      {/* Main Broadcaster Area */}
      <div className="lg:col-span-3 space-y-6">
          <div className="glass-panel relative aspect-video overflow-hidden group">
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-10 text-center">
                    <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-6 animate-pulse border border-red-500/30">
                        <Play className="w-10 h-10 text-red-500 fill-current" />
                    </div>
                    <h3 className="text-4xl font-black font-rajdhani text-white uppercase italic tracking-tighter leading-none italic mb-4">TACTICAL BROADCAST <br/>IN PROGRESS</h3>
                    <div className="flex items-center gap-4 text-xs font-bold font-rajdhani tracking-widest uppercase text-gray-400">
                         <span>STRIKER_CAM_01</span>
                         <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                         <span className="text-red-500 font-black animate-pulse">LIVE REPLAY</span>
                         <span className="w-1.5 h-1.5 rounded-full bg-gray-700" />
                         <span>BITRATE: 42.8 MB/S</span>
                    </div>
                </div>
                {/* Score HUD Overlay */}
                <div className="absolute bottom-6 left-6 right-6 glass-panel p-6 border-white/10 bg-black/60 backdrop-blur-md flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4">
                             <span className="text-3xl font-black font-rajdhani text-white tracking-widest italic">{activeMatch.team1?.name}</span>
                             <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-2">
                                <Shield className="w-6 h-6 text-arena-accent opacity-50" />
                            </div>
                        </div>
                        <div className="px-6 py-2 bg-red-500/10 border border-red-500/30 text-red-500 text-6xl font-black font-rajdhani tracking-tighter italic">
                             124 - 108
                        </div>
                        <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-2">
                                <Shield className="w-6 h-6 text-arena-secondary opacity-50" />
                            </div>
                            <span className="text-3xl font-black font-rajdhani text-white tracking-widest italic">{activeMatch.team2?.name}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest italic italic">TIME REMAINING</p>
                        <p className="text-2xl font-black font-rajdhani text-white uppercase italic tracking-tighter">14:42</p>
                    </div>
                </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel p-6 bg-white/[0.01]">
                   <h4 className="text-xs font-black text-gray-500 tracking-[0.5em] mb-6 uppercase flex items-center gap-2 italic italic">
                        <Activity className="w-4 h-4 text-arena-accent" />
                        EVENT TIMELINE
                    </h4>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar italic font-rajdhani font-medium tracking-tight">
                        {activeMatch.commentary?.map(event => (
                            <div key={event.id} className={`flex gap-4 p-3 border-l-2 ${event.is_important ? 'border-arena-success bg-arena-success/5' : 'border-white/5 bg-white/5'}`}>
                                <span className="text-[10px] font-black text-gray-500 italic mt-0.5">{event.event_time}</span>
                                <p className="text-sm text-gray-200">{event.commentary}</p>
                            </div>
                        ))}
                    </div>
              </div>
              <div className="glass-panel p-6 bg-white/[0.01]">
                   <h4 className="text-xs font-black text-gray-500 tracking-[0.5em] mb-6 uppercase flex items-center gap-2 italic italic">
                        <Target className="w-4 h-4 text-arena-success" />
                        TACTICAL ANALYSIS
                    </h4>
                    <div className="space-y-6">
                        <StatBar label="POSSESSION" val1={58} val2={42} />
                        <StatBar label="SHOTS ON TARGET" val1={14} val2={8} />
                        <StatBar label="NEURAL EFFICIENCY" val1={92} val2={88} color="arena-accent" />
                    </div>
              </div>
          </div>
      </div>

      {/* Engagement Sidebar */}
      <div className="space-y-6">
            <div className="glass-panel h-[600px] flex flex-col bg-black/40 border-white/5 overflow-hidden">
                <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                    <h4 className="text-[10px] font-black font-rajdhani text-arena-accent tracking-[0.4em] uppercase italic italic">NEURAL LINK CHAT</h4>
                    <div className="flex items-center gap-2 text-[9px] text-gray-500 font-bold">
                        <Users className="w-3 h-3" /> 16.2K LIVE
                    </div>
                </div>
                <div className="flex-1 p-4 overflow-y-auto custom-scrollbar italic font-rajdhani">
                     <div className="space-y-6">
                         <ChatMessage user="DRAGON_SLAYER" msg="Team Alpha looking unstoppable today! 🔥" color="text-arena-accent" />
                         <ChatMessage user="NEON_WAVE" msg="Stats don't lie, Beta team needs a tactical shift." color="text-arena-secondary" />
                         <ChatMessage user="STRIKER_42" msg="What a goal! Did you see that neural flip? 🤯" color="text-arena-success" />
                     </div>
                </div>
                <div className="p-4 bg-white/5 border-t border-white/5 flex gap-2">
                    <input 
                        type="text"
                        placeholder="TRANSMIT MESSAGE..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-rajdhani focus:outline-none focus:border-arena-accent italic uppercase tracking-widest text-[#fff]"
                    />
                    <button className="p-2 bg-arena-accent rounded-lg text-black hover:brightness-110 transition-all shadow-[0_0_15px_rgba(0,212,255,0.4)]">
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
      </div>
    </div>
  )
}

const StatBar = ({ label, val1, val2, color = 'arena-accent' }) => (
    <div className="space-y-2">
        <div className="flex justify-between items-end">
            <span className="text-[9px] font-black text-gray-500 tracking-widest uppercase italic">{label}</span>
            <div className="flex gap-4 font-black font-rajdhani text-xs tracking-widest uppercase tracking-widest">
                <span className={`text-arena-accent`}>{val1}%</span>
                <span className="text-gray-700">/</span>
                <span className={`text-arena-secondary`}>{val2}%</span>
            </div>
        </div>
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden flex">
            <div className={`h-full bg-arena-accent opacity-80`} style={{ width: `${val1}%` }} />
            <div className={`h-full bg-arena-secondary opacity-60`} style={{ width: `${val2}%` }} />
        </div>
    </div>
)

const ChatMessage = ({ user, msg, color }) => (
    <div className="space-y-1">
        <span className={`text-[10px] font-black uppercase tracking-widest ${color}`}>{user}</span>
        <p className="text-xs text-gray-400 font-medium tracking-tight truncate-multiline leading-relaxed uppercase">{msg}</p>
    </div>
)

export default LiveTab
