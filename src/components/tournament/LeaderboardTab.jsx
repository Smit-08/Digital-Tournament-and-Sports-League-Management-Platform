import React, { useState, useEffect } from 'react'
import { Trophy, TrendingUp, Medal, Star, Shield, Activity, BarChart3, TrendingDown } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const LeaderboardTab = ({ tournamentId }) => {
  const [rankings, setRankings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRankings()
    const channel = supabase
      .channel('rankings_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leaderboards', filter: `tournament_id=eq.${tournamentId}` }, () => {
        fetchRankings()
      })
      .subscribe()

    return () => channel.unsubscribe()
  }, [tournamentId])

  const fetchRankings = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('leaderboards')
        .select('*, team:teams(name, logo)')
        .eq('tournament_id', tournamentId)
        .order('points', { ascending: false })
        .order('net_run_rate', { ascending: false })

      if (error) throw error
      setRankings(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 border-l-4 border-l-arena-accent bg-arena-accent/5">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-arena-accent/10 rounded-lg text-arena-accent shadow-inner">
                    <Trophy className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="text-[10px] font-black text-gray-500 tracking-[0.3em] uppercase mb-1 italic">CURRENT LEADER</h4>
                    <p className="text-xl font-black font-rajdhani tracking-tighter uppercase">{rankings[0]?.team?.name || 'TBD'}</p>
                </div>
            </div>
        </div>
        <div className="glass-panel p-6 border-l-4 border-l-arena-secondary bg-arena-secondary/5">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-arena-secondary/10 rounded-lg text-arena-secondary shadow-inner">
                    <Medal className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="text-[10px] font-black text-gray-500 tracking-[0.3em] uppercase mb-1 italic">MVP STATUS</h4>
                    <p className="text-xl font-black font-rajdhani tracking-tighter uppercase">STRIKER_42</p>
                </div>
            </div>
        </div>
        <div className="glass-panel p-6 border-l-4 border-l-arena-success bg-arena-success/5">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-arena-success/10 rounded-lg text-arena-success shadow-inner">
                    <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="text-[10px] font-black text-gray-500 tracking-[0.3em] uppercase mb-1 italic">TOP FORMIDABILITY</h4>
                    <p className="text-xl font-black font-rajdhani tracking-tighter uppercase">86.2% WIN RATE</p>
                </div>
            </div>
        </div>
      </div>

      {/* Main Rankings Table */}
      <div className="glass-panel overflow-hidden border-white/5 bg-white/[0.01]">
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                <h3 className="text-xl font-black font-rajdhani flex items-center gap-2 italic">
                    <BarChart3 className="w-5 h-5 text-arena-accent" />
                    BATTLEGROUND STANDINGS
                </h3>
                <div className="flex items-center gap-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><TrendingUp className="w-3 h-3 text-arena-success" /> GAINING</span>
                    <span className="flex items-center gap-1.5"><TrendingDown className="w-3 h-3 text-arena-error" /> DECAYING</span>
                </div>
          </div>
          
          <div className="overflow-x-auto">
              <table className="w-full text-left">
                  <thead>
                      <tr className="border-b border-white/5 text-[9px] uppercase tracking-[0.4em] text-gray-500 italic">
                          <th className="px-6 py-6 font-black w-20">Rank</th>
                          <th className="px-6 py-6 font-black">Battalion Unit</th>
                          <th className="px-6 py-6 font-black text-center">P</th>
                          <th className="px-6 py-6 font-black text-center">W</th>
                          <th className="px-6 py-6 font-black text-center">L</th>
                          <th className="px-6 py-6 font-black text-center">D</th>
                          <th className="px-6 py-6 font-black text-center">NRR</th>
                          <th className="px-6 py-6 font-black text-center bg-white/10 w-24">TOTAL COMP</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-rajdhani text-sm">
                      {rankings.map((rank, index) => (
                          <tr key={rank.id} className="group hover:bg-white/5 transition-colors cursor-pointer">
                              <td className="px-6 py-6">
                                  <div className="flex items-center gap-2">
                                      <span className={`text-2xl font-black tracking-tighter italic ${index === 0 ? 'text-arena-accent' : 'text-gray-500'}`}>
                                          #{index + 1}
                                      </span>
                                      {index < 3 && <Medal className={`w-4 h-4 ${index === 0 ? 'text-amber-400' : index === 1 ? 'text-gray-400' : 'text-amber-700'}`} />}
                                  </div>
                              </td>
                              <td className="px-6 py-6 font-black">
                                  <div className="flex items-center gap-4">
                                      <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                          <Shield className="w-6 h-6 text-arena-accent opacity-50" />
                                      </div>
                                      <span className="text-base tracking-widest group-hover:text-arena-accent transition-colors uppercase">{rank.team?.name}</span>
                                  </div>
                              </td>
                              <td className="px-6 py-6 text-center font-bold text-gray-400 text-lg">{rank.played}</td>
                              <td className="px-6 py-6 text-center font-bold text-arena-success text-lg">{rank.won}</td>
                              <td className="px-6 py-6 text-center font-bold text-arena-error text-lg">{rank.lost}</td>
                              <td className="px-6 py-6 text-center font-bold text-gray-400 text-lg">{rank.draw}</td>
                              <td className="px-6 py-6 text-center font-bold text-gray-500 font-inter text-xs tracking-tighter">
                                  <span className={rank.net_run_rate >= 0 ? 'text-arena-success' : 'text-arena-error'}>
                                      {rank.net_run_rate >= 0 ? '+' : ''}{rank.net_run_rate?.toFixed(3)}
                                  </span>
                              </td>
                              <td className="px-6 py-6 text-center bg-white/5">
                                  <span className="text-2xl font-black text-white italic tracking-tighter">
                                      {Math.floor(rank.points)}
                                  </span>
                              </td>
                          </tr>
                      ))}
                      {rankings.length === 0 && !loading && (
                          <tr>
                              <td colSpan="8" className="px-6 py-20 text-center font-rajdhani text-gray-600 text-xl tracking-[0.3em]">RANKING DATA OFFLINE</td>
                          </tr>
                      )}
                  </tbody>
              </table>
          </div>
      </div>
    </div>
  )
}

export default LeaderboardTab
