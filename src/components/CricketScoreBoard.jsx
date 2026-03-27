import React from 'react'
import { Activity, Clock, Zap } from 'lucide-react'

const CricketScoreBoard = ({ liveInfo, loading }) => {
  if (loading) return <div className="animate-pulse h-40 bg-white/5 rounded-2xl" />

  const { runs, wickets, overs, target, batsmen = [], bowlers = [], lastEvents = [] } = liveInfo

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Main Score Display */}
        <div className="flex-1 glass-card p-6 bg-gradient-to-br from-[var(--color-primary)]/10 to-transparent border-[var(--color-primary)]/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
              <Zap className="w-16 h-16 text-[var(--color-primary)]" />
          </div>
          
          <div className="flex items-end gap-3 mb-2">
            <h2 className="text-6xl font-black font-rajdhani text-[var(--color-text)] tracking-tighter">
              {runs}<span className="text-[var(--color-primary)]">/</span>{wickets}
            </h2>
            <div className="pb-2">
              <span className="text-sm font-bold text-[var(--color-textMuted)] uppercase tracking-widest">{overs} OVERS</span>
            </div>
          </div>
          
          {target && (
            <p className="text-xs font-bold text-[var(--color-primary)]/80 uppercase tracking-widest flex items-center gap-2">
               <Clock className="w-3 h-3" />
               Target: {target} (Need {target - runs} more to win)
            </p>
          )}

          {/* Recent Balls */}
          <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {lastEvents.map((event, i) => (
              <div 
                key={i} 
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border
                  ${event === '4' ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' : 
                    event === '6' ? 'bg-purple-500/20 border-purple-500/30 text-purple-400 font-black' : 
                    event === 'w' ? 'bg-red-500/20 border-red-500/30 text-red-500' : 
                    'bg-white/5 border-white/10 text-[var(--color-textMuted)]'}`}
              >
                {event}
              </div>
            ))}
            <span className="text-[10px] font-black text-[var(--color-textMuted)] uppercase tracking-[0.2em] ml-2">THIS OVER</span>
          </div>
        </div>

        {/* Batsmen Info */}
        <div className="flex-1 glass-card p-6 border-[var(--color-border)] hover:border-[var(--color-primary)]/30 transition-all">
          <h4 className="text-[10px] font-black text-[var(--color-textMuted)] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
             <Activity className="w-3 h-3 text-[var(--color-primary)]" />
             CURRENT PARTNERSHIP
          </h4>
          <div className="space-y-4">
             {batsmen.map((b, i) => (
               <div key={i} className="flex justify-between items-center group/player">
                 <div>
                   <span className="text-sm font-bold font-rajdhani text-[var(--color-text)] group-hover/player:text-[var(--color-primary)] transition-colors">{b.name}*</span>
                   <p className="text-[10px] text-[var(--color-textMuted)] uppercase tracking-widest font-bold">SR: {b.strikeRate}</p>
                 </div>
                 <div className="text-right">
                   <span className="text-lg font-black font-rajdhani text-[var(--color-text)]">{b.runs}</span>
                   <span className="text-xs text-[var(--color-textMuted)] ml-1">({b.balls})</span>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Bowler & More Stats Card */}
      <div className="glass-panel p-4 flex flex-wrap gap-8 items-center justify-between border-dashed border-[var(--color-border)]">
        <div className="flex items-center gap-4">
           {bowlers.map((b, i) => (
             <div key={i} className="flex flex-col border-r border-[var(--color-border)] pr-6 last:border-0">
               <span className="text-[9px] font-black text-[var(--color-primary)] uppercase tracking-widest italic mb-0.5">CURRENT BOWLER</span>
               <span className="text-xs font-bold font-rajdhani text-[var(--color-text)]">{b.name}</span>
               <span className="text-[10px] font-bold text-[var(--color-textMuted)]">{b.figures}</span>
             </div>
           ))}
        </div>
        
        <div className="flex items-center gap-6">
           <div className="text-center">
             <p className="text-[8px] font-black text-[var(--color-textMuted)] uppercase tracking-widest mb-1">RUN RATE</p>
             <p className="text-sm font-black font-rajdhani text-[var(--color-secondary)]">9.84</p>
           </div>
           <div className="text-center">
             <p className="text-[8px] font-black text-[var(--color-textMuted)] uppercase tracking-widest mb-1">REQ RATE</p>
             <p className="text-sm font-black font-rajdhani text-[var(--color-primary)]">11.6</p>
           </div>
        </div>
      </div>
    </div>
  )
}

export default CricketScoreBoard
