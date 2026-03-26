import React, { useState, useEffect } from 'react'
import { Trophy, TrendingUp, Filter, Users } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
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

  const chartData = standings.slice(0, 5).map(s => ({
    name: s.team?.name || 'Unknown',
    pts: s.points,
    color: '#00d4ff'
  }))

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black font-rajdhani arena-text-gradient tracking-tighter italic">HALL OF FAME</h2>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">CURRENT GLOBAL TEAM AND TOURNAMENT RANKINGS</p>
        </div>
        <div className="flex gap-4">
            <button className="px-6 py-2 glass-panel hover:bg-white/10 transition-colors flex items-center gap-3 border-arena-secondary/30">
                <Users className="w-4 h-4 text-arena-secondary" />
                <span className="text-[10px] font-bold uppercase tracking-widest font-rajdhani">TEAMS</span>
            </button>
            <button className="px-6 py-2 glass-panel hover:bg-white/10 transition-colors flex items-center gap-3 border-arena-accent/30">
                <Filter className="w-4 h-4 text-arena-accent" />
                <span className="text-[10px] font-bold uppercase tracking-widest font-rajdhani">FILTERS</span>
            </button>
        </div>
      </div>

      {/* Analytical Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 glass-panel p-8 bg-gradient-to-br from-white/[0.02] to-transparent">
              <h3 className="text-sm font-bold font-rajdhani tracking-widest uppercase mb-8 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-arena-accent" />
                  POINTS PERFORMANCE ANALYTICS
              </h3>
              <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" vertical={false} />
                          <XAxis dataKey="name" stroke="#555" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#555" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip 
                              cursor={{fill: 'rgba(255,255,255,0.05)'}}
                              contentStyle={{ backgroundColor: '#0d0d14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                              itemStyle={{ color: '#00d4ff', fontSize: '12px', fontWeight: 'bold' }}
                          />
                          <Bar dataKey="pts" radius={[4, 4, 0, 0]}>
                              {chartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={index === 0 ? '#00d4ff' : '#8b5cf6'} fillOpacity={0.8} />
                              ))}
                          </Bar>
                      </BarChart>
                  </ResponsiveContainer>
              </div>
          </div>
          
          <div className="glass-panel p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-arena-accent/10 blur-3xl rounded-full" />
               <Trophy className="w-16 h-16 text-yellow-500 mb-6 animate-bounce" />
               <h4 className="text-xl font-bold font-rajdhani tracking-tighter uppercase mb-2">SEASON MVP TARGET</h4>
               <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-6">REACH 500 PTS TO UNLOCK ELITE STATUS</p>
               <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mb-2">
                   <div className="bg-arena-accent h-full w-[45%]" />
               </div>
               <p className="text-[10px] text-arena-accent font-bold uppercase tracking-widest">45% COMPLETION BY COMMUNITY</p>
          </div>
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
