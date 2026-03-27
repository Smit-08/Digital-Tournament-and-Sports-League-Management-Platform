import React from 'react'
import { useParams } from 'react-router-dom'
import { Play, MapPin, Users, Timer, Activity, MessageSquare, Trophy, Globe } from 'lucide-react'
import { useLiveMatch } from '../hooks/useLiveMatch'
import { useCricketLive } from '../hooks/useCricketLive'
import CricketScoreBoard from '../components/CricketScoreBoard'

const LiveMatch = () => {
  const { id } = useParams()
  const { match, scores, commentary, loading: baseLoading } = useLiveMatch(id)
  const isCricket = match?.tournament?.sport?.toLowerCase() === 'cricket'
  const { liveInfo, loading: cricketLoading } = useCricketLive(id, match?.isGlobal || match?.tournament?.name?.includes('IPL'), isCricket)

  const loading = baseLoading || (isCricket && cricketLoading)

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center font-rajdhani text-[var(--color-primary)] text-2xl animate-pulse">
        CONNECTING TO LIVE STREAM...
    </div>
  )

  if (!match) return <div className="p-10 text-center font-rajdhani">MATCH DATA UNAVAILABLE</div>

  return (
    <div className="space-y-8 pb-20">
      {/* Dynamic Header */}
      <div className="flex items-center justify-between mb-2">
         <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[var(--color-primary)]" />
            <h2 className="text-sm font-bold font-rajdhani text-[var(--color-textMuted)] uppercase tracking-[0.3em]">
               {match.tournament?.name || 'ARENA X ELITE SERIES'}
            </h2>
         </div>
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded text-[9px] font-black text-[var(--color-primary)] uppercase tracking-widest italic animate-pulse">
                <Globe className="w-3 h-3" />
                BROADCAST LIVE
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-textMuted)] uppercase tracking-widest">
                <Users className="w-3.5 h-3.5" />
                1,284
            </div>
         </div>
      </div>

      {isCricket ? (
        <CricketScoreBoard liveInfo={liveInfo} loading={cricketLoading} />
      ) : (
        /* Legacy Dynamic Scoreboard for other sports */
        <div className="glass-panel p-10 relative overflow-hidden bg-gradient-to-br from-white/[0.03] to-transparent">
          <div className="absolute inset-0 arena-gradient opacity-[0.02]" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
            <div className="text-center md:text-left flex-1">
              <div className="w-24 h-24 mb-4 mx-auto md:mx-0 glass-card rounded-full p-4 arena-gradient flex items-center justify-center text-3xl font-bold font-rajdhani">
                  {match.team1?.name?.charAt(0)}
              </div>
              <h3 className="text-3xl font-bold font-rajdhani uppercase tracking-tighter">{match.team1?.name}</h3>
              <p className="text-[var(--color-primary)] font-bold mt-2 uppercase tracking-widest text-[10px]">HOME TEAM</p>
            </div>

            <div className="text-center flex flex-col items-center gap-2">
              <div className="flex items-center gap-6 mb-2">
                <span className="text-7xl font-bold font-rajdhani arena-text-gradient">
                  {scores.find(s => s.team_id === match.team1_id)?.points || 0}
                </span>
                <span className="text-4xl text-[var(--color-border)] font-rajdhani">VS</span>
                <span className="text-7xl font-bold font-rajdhani arena-text-gradient">
                  {scores.find(s => s.team_id === match.team2_id)?.points || 0}
                </span>
              </div>
              <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2
                ${match.status === 'live' ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-white/5 text-[var(--color-textMuted)]'}`}>
                {match.status === 'live' && <div className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                {match.status}
              </div>
              <p className="text-sm text-[var(--color-textMuted)] font-medium flex items-center gap-2 mt-2">
                  <Timer className="w-4 h-4" /> 2nd HALF (65:12)
              </p>
            </div>

            <div className="text-center md:text-right flex-1">
              <div className="w-24 h-24 mb-4 mx-auto md:ml-auto glass-card rounded-full p-4 bg-white/5 border border-white/5 flex items-center justify-center text-3xl font-bold font-rajdhani">
                  {match.team2?.name?.charAt(0)}
              </div>
              <h3 className="text-3xl font-bold font-rajdhani uppercase tracking-tighter">{match.team2?.name}</h3>
              <p className="text-[var(--color-textMuted)] font-bold mt-2 uppercase tracking-widest text-[10px]">AWAY TEAM</p>
            </div>
          </div>
        </div>
      )}
        
        <div className="mt-10 pt-6 border-t border-white/5 flex gap-10 justify-center">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
                <MapPin className="w-4 h-4 text-arena-accent" />
                <span>{match.venue?.name || 'Grand Arena Stadium'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Activity className="w-4 h-4 text-arena-accent" />
                <span>TOURNAMENT QUARTERFINALS</span>
            </div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Commentary Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <Activity className="w-6 h-6 text-arena-accent" />
                    <h3 className="text-xl font-bold font-rajdhani tracking-widest">LIVE COMMENTARY</h3>
                </div>
                <div className="flex gap-2">
                    <button className="px-3 py-1 bg-white/5 rounded text-[10px] font-bold text-gray-400">KEY EVENTS ONLY</button>
                    <button className="px-3 py-1 bg-arena-accent/10 rounded text-[10px] font-bold text-arena-accent">ALL</button>
                </div>
            </div>

            <div className="space-y-8 relative before:absolute before:left-3 before:top-2 before:bottom-0 before:w-px before:bg-white/5">
                {commentary.length === 0 ? (
                    <div className="p-20 text-center opacity-20">WAITING FOR ACTION...</div>
                ) : (
                    commentary.map((c, i) => (
                        <div key={c.id} className={`flex gap-6 relative group animate-in slide-in-from-bottom-2 duration-300`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center relative z-10 transition-colors
                                ${c.is_important ? 'bg-arena-accent shadow-[0_0_10px_rgba(0,212,255,0.5)]' : 'bg-white/10 group-hover:bg-white/30'}`}>
                                {c.is_important && <Play className="w-2.5 h-2.5 text-black fill-current" />}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="font-bold font-rajdhani text-arena-accent text-sm tracking-wide">{c.event_time}</span>
                                    {c.is_important && <span className="text-[10px] font-bold bg-white/5 px-2 py-0.5 rounded text-gray-400 italic">CRITICAL MOMENT</span>}
                                </div>
                                <p className={`text-lg leading-relaxed ${c.is_important ? 'text-white font-medium' : 'text-gray-400'}`}>
                                    {c.commentary}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
          </div>
        </div>

        {/* Side Panel: Social Engagement & Chat */}
        <div className="space-y-6">
          <div className="glass-panel p-6 flex flex-col h-[500px]">
            <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="w-5 h-5 text-arena-secondary" />
                <h4 className="font-bold font-rajdhani tracking-widest">STADIUM CHAT</h4>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2">
                <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold font-rajdhani">JD</div>
                    <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none">
                        <p className="text-[10px] font-bold text-arena-secondary mb-1">JOHN_DOE</p>
                        <p className="text-sm">Incredible strike! What a match!</p>
                    </div>
                </div>
                <div className="flex gap-3 flex-row-reverse">
                    <div className="w-8 h-8 rounded-full arena-gradient bg-white flex items-center justify-center text-[10px] font-bold font-rajdhani">ME</div>
                    <div className="bg-arena-accent/10 p-3 rounded-2xl rounded-tr-none">
                        <p className="text-[10px] font-bold text-arena-accent mb-1 text-right">YOU</p>
                        <p className="text-sm">Tough defense though. Let's see...</p>
                    </div>
                </div>
            </div>

            <div className="relative">
                <input 
                  type="text" 
                  placeholder="SEND MESSAGE..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:border-arena-secondary font-rajdhani"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:text-arena-secondary transition-colors">
                    <Play className="w-4 h-4 fill-current rotate-0" />
                </button>
            </div>
          </div>

          <div className="glass-panel p-6">
            <h4 className="font-bold font-rajdhani tracking-widest mb-4">MATCH STATS</h4>
            <div className="space-y-4">
                {[
                    { label: 'POSSESSION', t1: 54, t2: 46 },
                    { label: 'SHOTS ON TARGET', t1: 8, t2: 5 },
                    { label: 'CORNERS', t1: 12, t2: 7 }
                ].map(stat => (
                    <div key={stat.label}>
                        <div className="flex justify-between items-center mb-1 text-[10px] font-bold text-gray-500 uppercase">
                            <span>{stat.t1}%</span>
                            <span>{stat.label}</span>
                            <span>{stat.t2}%</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden flex">
                            <div className="arena-gradient h-full" style={{ width: `${stat.t1}%` }} />
                            <div className="bg-white/20 h-full" style={{ width: `${stat.t2}%` }} />
                        </div>
                    </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveMatch
