import React from 'react'
import { Calendar, Users, MapPin, Play, Trophy } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const TournamentCard = ({ tournament }) => {
  const navigate = useNavigate()
  const { id, name, sport, status, start_date, max_teams, venue, format } = tournament

  const statusColors = {
    upcoming: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    ongoing: 'text-[var(--color-success)] bg-[var(--color-success)]/10 border-[var(--color-success)]/20',
    completed: 'text-[var(--color-textMuted)] bg-black/5 border-[var(--color-border)]'
  }

  return (
    <div className="glass-card p-6 flex flex-col group relative border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 transition-all duration-300">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)]/5 blur-3xl rounded-full -z-10 group-hover:bg-[var(--color-primary)]/10 transition-all duration-500" />
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest mb-2 inline-block border ${statusColors[status] || statusColors.upcoming}`}>
            {status}
          </span>
          <h3 className="text-xl font-black font-rajdhani text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors uppercase tracking-tight">{name}</h3>
          <p className="text-[10px] text-[var(--color-textMuted)] uppercase tracking-widest italic font-bold">{sport}</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-black/5 flex items-center justify-center border border-[var(--color-border)] group-hover:border-[var(--color-primary)]/30 transition-all shadow-inner">
          <Trophy className="w-6 h-6 text-[var(--color-primary)] group-hover:scale-110 transition-transform" />
        </div>
      </div>

      <div className="space-y-3 mb-6 flex-1">
        <div className="flex items-center gap-2 text-sm text-[var(--color-textMuted)] font-rajdhani font-bold">
          <Calendar className="w-4 h-4 text-[var(--color-secondary)]" />
          <span>{new Date(start_date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--color-textMuted)] font-rajdhani font-bold">
          <Users className="w-4 h-4 text-[var(--color-secondary)]" />
          <span>{max_teams} Teams Max</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--color-textMuted)] font-rajdhani font-bold">
          <MapPin className="w-4 h-4 text-[var(--color-secondary)]" />
          <span className="truncate">{venue || 'Arena X Stadium'}</span>
        </div>
      </div>

      <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
        <span className="text-[9px] font-black text-[var(--color-textMuted)] uppercase tracking-[0.2em]">{format}</span>
        <button 
          onClick={() => navigate(`/tournament/${id}`)}
          className="flex items-center gap-2 text-[var(--color-primary)] hover:text-[var(--color-text)] transition-colors text-xs font-black font-rajdhani tracking-widest uppercase group/btn"
        >
          <span>VIEW DETAILS</span>
          <Play className="w-3 h-3 fill-current group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  )
}

export default TournamentCard
