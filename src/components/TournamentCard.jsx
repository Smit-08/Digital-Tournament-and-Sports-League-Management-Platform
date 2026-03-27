import React from 'react'
import { Calendar, Users, MapPin, Play, Trophy, Globe, LayoutGrid, CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const TournamentCard = ({ tournament }) => {
  const navigate = useNavigate()
  const { id, name, sport, status, start_date, max_teams, venue, format, logo, isGlobal, organization } = tournament

  const statusColors = {
    upcoming: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    ongoing: 'text-[var(--color-success)] bg-[var(--color-success)]/10 border-[var(--color-success)]/20',
    ended: 'text-[var(--color-textMuted)] bg-black/5 border-[var(--color-border)]',
    completed: 'text-[var(--color-textMuted)] bg-black/5 border-[var(--color-border)]'
  }

  const displayStatus = status === 'ongoing' ? 'IN PROGRESS' : status?.toUpperCase()

  return (
    <div 
      onClick={() => navigate(`/tournament/${id}`)}
      className="glass-card p-6 flex flex-col group relative border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 transition-all duration-300 cursor-pointer"
    >
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)]/5 blur-3xl rounded-full -z-10 group-hover:bg-[var(--color-primary)]/10 transition-all duration-500" />
      
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${statusColors[status] || statusColors.upcoming}`}>
              {displayStatus}
            </span>
            {isGlobal && (
              <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 flex items-center gap-1">
                <Globe className="w-2.5 h-2.5" />
                GLOBAL
              </span>
            )}
          </div>
          <h3 className="text-xl font-black font-rajdhani text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors uppercase tracking-tight leading-tight mb-1">{name}</h3>
          <p className="text-[10px] text-[var(--color-textMuted)] uppercase tracking-widest italic font-bold flex items-center gap-2">
             <LayoutGrid className="w-3 h-3 text-[var(--color-primary)]" />
             {sport} • {organization || 'ARENA X'}
          </p>
        </div>
        
        <div className="w-14 h-14 rounded-2xl bg-[var(--color-surface)] flex items-center justify-center border border-[var(--color-border)] group-hover:border-[var(--color-primary)]/30 transition-all shadow-inner overflow-hidden flex-shrink-0 ml-4">
          {logo ? (
            <img src={logo} alt={name} className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform" />
          ) : (
            <Trophy className="w-7 h-7 text-[var(--color-primary)] group-hover:scale-110 transition-transform" />
          )}
        </div>
      </div>

      <div className="space-y-3 mb-6 flex-1">
        <div className="flex items-center gap-3 text-xs text-[var(--color-textMuted)] font-rajdhani font-bold bg-white/5 p-2 rounded-lg border border-white/5">
          <Calendar className="w-4 h-4 text-[var(--color-secondary)]" />
          <span className="text-[var(--color-text)] tracking-wider">
              {start_date ? new Date(start_date).toLocaleDateString() : 'TBD'}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-[10px] text-[var(--color-textMuted)] font-bold uppercase tracking-widest">
                <Users className="w-3 h-3 text-[var(--color-secondary)]" />
                <span>{max_teams} Teams</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-[var(--color-textMuted)] font-bold uppercase tracking-widest truncate">
                <MapPin className="w-3 h-3 text-[var(--color-secondary)]" />
                <span className="truncate">{venue || (isGlobal ? 'International' : 'Arena X Std.')}</span>
            </div>
        </div>
      </div>

      <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
        <div className="flex items-center gap-1.5">
            <CheckCircle2 className={`w-3 h-3 ${status === 'ended' || status === 'completed' ? 'text-[var(--color-success)]' : 'text-[var(--color-textMuted)]'}`} />
            <span className="text-[9px] font-black text-[var(--color-textMuted)] uppercase tracking-[0.2em]">{format}</span>
        </div>
        
        <div className="flex items-center gap-2 text-xs font-black font-rajdhani tracking-widest uppercase group/btn transition-all text-[var(--color-primary)] group-hover:text-[var(--color-text)]">
          <span>{isGlobal ? 'READ STATS' : 'VIEW DETAILS'}</span>
          <Play className="w-3 h-3 fill-current group-hover/btn:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  )
}

export default TournamentCard
