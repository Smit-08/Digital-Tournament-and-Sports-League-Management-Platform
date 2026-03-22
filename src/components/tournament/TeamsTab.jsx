import React, { useState, useEffect } from 'react'
import { Plus, Users, Shield, Target, User, ChevronRight, Activity } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const TeamsTab = ({ tournamentId, canJoin = true, onJoinSuccess }) => {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTeams()
    const channel = supabase
      .channel('teams_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'teams', filter: `tournament_id=eq.${tournamentId}` }, () => {
        fetchTeams()
      })
      .subscribe()

    return () => channel.unsubscribe()
  }, [tournamentId])

  const fetchTeams = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('teams')
        .select('*, owner:users(name, role)')
        .eq('tournament_id', tournamentId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTeams(data || [])
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
              <Users className="w-6 h-6 text-arena-accent" />
              DEPLOYED BATTALIONS <span className="text-gray-600 font-normal">({teams.length})</span>
          </h3>
          {canJoin && (
              <button 
                  onClick={onJoinSuccess}
                  className="btn-premium flex items-center gap-2 group"
              >
                  <Plus className="w-5 h-5" />
                  <span>REGISTER NEW BATTALION</span>
              </button>
          )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="glass-panel h-64 animate-pulse bg-white/5 shadow-inner" />
          ))}
        </div>
      ) : teams.length === 0 ? (
        <div className="glass-panel p-20 text-center border-dashed border-white/10 opacity-60">
            <Shield className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <h4 className="text-xl font-bold font-rajdhani text-gray-500 uppercase">NO BATTALIONS DEPLOYED</h4>
            <p className="text-gray-600 mt-2 font-rajdhani text-sm">Waiting for tactical units to enlist in this championship.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map(team => (
            <div key={team.id} className="glass-panel p-6 group hover:border-arena-accent/30 transition-all cursor-pointer bg-white/[0.01]">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-arena-accent/10 border border-arena-accent/20 flex items-center justify-center p-2 group-hover:bg-arena-accent/20 transition-colors">
                    <Shield className="w-6 h-6 text-arena-accent" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black font-rajdhani uppercase tracking-tight group-hover:text-arena-accent transition-colors">{team.name}</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">COMMANDER: {team.owner?.name || 'TBD'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-gray-600">
                      <span>CAPITAL ASSETS</span>
                      <span className="text-arena-success font-rajdhani tracking-normal">${team.budget?.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full arena-gradient shadow-[0_0_10px_rgba(0,212,255,0.4)] transition-all duration-500" 
                        style={{ width: '65%' }}
                      />
                  </div>
              </div>

              <div className="flex items-center justify-between py-4 border-t border-white/5 opacity-60 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-4">
                      <div className="text-center">
                          <p className="text-[10px] text-gray-500 font-bold uppercase">WINS</p>
                          <p className="text-sm font-black font-rajdhani">24</p>
                      </div>
                      <div className="text-center">
                          <p className="text-[10px] text-gray-500 font-bold uppercase">LOSES</p>
                          <p className="text-sm font-black font-rajdhani">4</p>
                      </div>
                      <div className="text-center">
                          <p className="text-[10px] text-gray-500 font-bold uppercase">K/D</p>
                          <p className="text-sm font-black font-rajdhani">1.82</p>
                      </div>
                  </div>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-arena-accent" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TeamsTab
