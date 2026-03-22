import React, { useState } from 'react'
import { Plus, Trophy, Settings, Users, Activity } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTournaments } from '../hooks/useTournaments'
import { useNavigate } from 'react-router-dom'
import CreateTournamentModal from '../components/CreateTournamentModal'

const Admin = () => {
  const { profile, loading: authLoading } = useAuth()
  const { tournaments, loading: tournamentsLoading, refresh } = useTournaments()
  const [isCreating, setIsCreating] = useState(false)
  const navigate = useNavigate()

  if (authLoading) return <div className="p-10 text-center animate-pulse text-gray-400 font-rajdhani">LOADING OVERSEER MODULE...</div>

  // Protection: only allow admin or organizer for this managed view
  if (profile?.role !== 'admin' && profile?.role !== 'organizer') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-10">
        <div className="p-6 glass-panel border-red-500/20 max-w-md animate-in fade-in zoom-in duration-300">
          <Trophy className="w-16 h-16 text-red-500 mx-auto mb-4 opacity-50" />
          <h2 className="text-3xl font-bold font-rajdhani text-red-400 leading-none">ACCESS DENIED</h2>
          <p className="text-gray-400 mt-4 font-rajdhani tracking-widest text-sm uppercase">Unauthorized personnel detected. Admin clearance required.</p>
          <button onClick={() => navigate('/')} className="mt-6 btn-premium">RETURN TO BASE</button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black font-rajdhani arena-text-gradient">COMMAND CENTER</h2>
          <p className="text-gray-400 tracking-wider">SYSTEM ADMINISTRATOR: <span className="text-arena-accent font-bold uppercase">{profile.name}</span></p>
        </div>
        
        <button 
          onClick={() => setIsCreating(true)}
          className="btn-premium flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>LAUNCH NEW CHAMPIONSHIP</span>
        </button>
      </div>

      <CreateTournamentModal 
        isOpen={isCreating} 
        onClose={() => setIsCreating(false)} 
        onSuccess={() => refresh()} 
      />

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 border-l-4 border-l-blue-500 bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Active Tourneys</p>
              <h3 className="text-2xl font-bold font-rajdhani">{tournaments.filter(t => t.status === 'live').length}</h3>
            </div>
          </div>
        </div>
        <div className="glass-panel p-6 border-l-4 border-l-amber-500 bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-amber-500/10 text-amber-500">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Global Status</p>
              <h3 className="text-2xl font-bold font-rajdhani uppercase text-amber-500">Standby</h3>
            </div>
          </div>
        </div>
        <div className="glass-panel p-6 border-l-4 border-l-emerald-500 bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Total Athletes</p>
              <h3 className="text-2xl font-bold font-rajdhani">124</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Tournament List Table */}
      <div className="glass-panel overflow-hidden bg-white/[0.01]">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-xl font-bold font-rajdhani flex items-center gap-2 tracking-tighter italic">
            <Settings className="w-5 h-5 text-arena-accent" />
            OPERATIONAL ARCHIVES
          </h3>
        </div>
        
        {tournamentsLoading ? (
            <div className="p-20 text-center animate-pulse text-gray-600 font-rajdhani tracking-widest">COLLECTING DATA...</div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-white/5 text-[10px] uppercase tracking-widest text-gray-400">
                            <th className="px-6 py-4">Championship</th>
                            <th className="px-6 py-4">Sport</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {tournaments.map(t => (
                            <tr key={t.id} className="hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${t.status === 'live' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-arena-accent shadow-[0_0_10px_rgba(34,211,238,0.5)]'}`}></div>
                                        <span className="font-bold text-gray-200 uppercase font-rajdhani">{t.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-xs text-gray-500 font-bold uppercase tracking-widest">{t.sport}</td>
                                <td className="px-6 py-4">
                                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest ${
                                        t.status === 'live' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                        t.status === 'upcoming' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                                        'bg-gray-500/10 text-gray-500 border border-gray-500/20'
                                    }`}>
                                        {t.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-[10px] font-bold text-arena-accent hover:text-white transition-colors uppercase tracking-widest">Manage</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  )
}

export default Admin
