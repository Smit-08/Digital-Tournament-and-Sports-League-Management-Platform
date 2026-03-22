import React, { useState, useEffect } from 'react'
import { Trophy, TrendingUp, Filter, Users } from 'lucide-react'
import { supabase } from '../lib/supabase'

const Leaderboards = () => {
  const [standings, setStandings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStandings = async () => {
      const { data, error } = await supabase
        .from('leaderboards')
        .select(`
          *,
          team:teams(name, logo)
        `)
        .order('points', { ascending: false })
        .order('net_run_rate', { ascending: false })
      
      if (data) setStandings(data)
      setLoading(false)
    }

    fetchStandings()

    // Real-time updates
    const channel = supabase
      .channel('leaderboard_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leaderboards' }, fetchStandings)
      .subscribe()

    return () => channel.unsubscribe()
  }, [])

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold font-rajdhani arena-text-gradient">Hall Of Fame</h2>
          <p className="text-gray-400">Current global team and tournament rankings</p>
        </div>
        <button className="p-3 glass-panel hover:bg-white/10 transition-colors flex items-center gap-3">
          <Filter className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-widest font-rajdhani">FILTER BY LEAGUE</span>
        </button>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="p-6 bg-white/[0.02] border-b border-white/5 grid grid-cols-12 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            <div className="col-span-1 text-center font-rajdhani">Rank</div>
            <div className="col-span-4 font-rajdhani">Team Entity</div>
            <div className="col-span-1 text-center font-rajdhani">P</div>
            <div className="col-span-1 text-center font-rajdhani">W</div>
            <div className="col-span-1 text-center font-rajdhani">L</div>
            <div className="col-span-1 text-center font-rajdhani">D</div>
            <div className="col-span-2 text-center font-rajdhani">NRR</div>
            <div className="col-span-1 text-center font-rajdhani">PTS</div>
        </div>

        <div className="divide-y divide-white/5 min-h-[400px]">
            {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="p-6 animate-pulse grid grid-cols-12 gap-4">
                        <div className="col-span-1 h-6 bg-white/5 rounded" />
                        <div className="col-span-4 h-6 bg-white/5 rounded" />
                        <div className="col-span-7 h-6 bg-white/5 rounded" />
                    </div>
                ))
            ) : standings.length === 0 ? (
                <div className="p-20 text-center opacity-30">
                    <Trophy className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-xl font-bold font-rajdhani">NO RANKINGS YET</p>
                    <p className="text-gray-500 mt-2">The battle is yet to begin. First match winner takes the top.</p>
                </div>
            ) : (
                standings.map((team, index) => (
                    <div key={team.id} className={`p-6 grid grid-cols-12 items-center hover:bg-white/5 transition-all group
                        ${index < 3 ? 'bg-gradient-to-r from-arena-accent/5 to-transparent' : ''}`}>
                        
                        <div className="col-span-1 text-center relative">
                            <span className={`text-2xl font-bold font-rajdhani 
                                ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-orange-400' : 'text-gray-600'}`}>
                                {index + 1}
                            </span>
                            {index === 0 && <Trophy className="w-4 h-4 text-yellow-500 absolute -top-4 left-1/2 -translate-x-1/2" />}
                        </div>

                        <div className="col-span-4 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full glass-card border border-white/10 flex items-center justify-center p-2 group-hover:border-arena-accent/30 transition-all">
                                <Users className="w-full h-full text-arena-accent opacity-50" />
                            </div>
                            <div>
                                <h4 className="font-bold font-rajdhani group-hover:text-arena-accent transition-colors truncate uppercase tracking-tighter text-lg">{team.team?.name}</h4>
                                <p className="text-[10px] text-gray-500 italic uppercase">ELITE LEAGUE DIV A</p>
                            </div>
                        </div>

                        <div className="col-span-1 text-center font-bold text-gray-300">{team.played}</div>
                        <div className="col-span-1 text-center font-bold text-arena-success">{team.won}</div>
                        <div className="col-span-1 text-center font-bold text-arena-error">{team.lost}</div>
                        <div className="col-span-1 text-center font-bold text-gray-500">{team.draw}</div>
                        <div className="col-span-2 text-center text-sm font-rajdhani font-bold flex items-center justify-center gap-1">
                            <TrendingUp className={`w-3 h-3 ${parseFloat(team.net_run_rate) >= 0 ? 'text-arena-success' : 'text-arena-error'}`} />
                            {team.net_run_rate}
                        </div>
                        <div className="col-span-1 text-center">
                            <span className="text-2xl font-bold font-rajdhani arena-text-gradient">{team.points}</span>
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  )
}

export default Leaderboards
