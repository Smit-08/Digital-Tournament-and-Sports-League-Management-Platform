import React from 'react'
import { Calendar, Users, MapPin, Play, Trophy } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const TournamentCard = ({ tournament }) => {
  const navigate = useNavigate()
  const { id, name, sport, status, start_date, max_teams, venue, format } = tournament

  const statusColors = {
    upcoming: 'text-blue-400 bg-blue-400/10',
    ongoing: 'text-arena-success bg-arena-success/10',
    completed: 'text-gray-400 bg-gray-400/10'
  }

  return (
    <div className="glass-card p-6 flex flex-col group relative">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-arena-accent/5 blur-3xl rounded-full -z-10 group-hover:bg-arena-accent/20 transition-all duration-500" />
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider mb-2 inline-block ${statusColors[status] || statusColors.upcoming}`}>
            {status}
          </span>
          <h3 className="text-xl font-bold font-rajdhani text-white group-hover:text-arena-accent transition-colors">{name}</h3>
          <p className="text-xs text-gray-400 uppercase tracking-tighter italic">{sport}</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-arena-accent/30 transition-all">
          <Trophy className="w-6 h-6 text-arena-accent group-hover:scale-110 transition-transform" />
        </div>
      </div>

      <div className="space-y-3 mb-6 flex-1">
        <div className="flex items-center gap-2 text-sm text-gray-400 font-inter">
          <Calendar className="w-4 h-4 text-arena-secondary" />
          <span>{new Date(start_date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400 font-inter">
          <Users className="w-4 h-4 text-arena-secondary" />
          <span>{max_teams} Teams Max</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400 font-inter">
          <MapPin className="w-4 h-4 text-arena-secondary" />
          <span className="truncate">{venue || 'Arena X Stadium'}</span>
        </div>
      </div>

      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{format}</span>
        <button 
          onClick={() => navigate(`/tournament/${id}`)}
          className="flex items-center gap-2 text-arena-accent hover:text-white transition-colors text-sm font-bold font-rajdhani"
        >
          <span>VIEW DETAILS</span>
          <Play className="w-3 h-3 fill-current" />
        </button>
      </div>
    </div>
  )
}

export default TournamentCard
