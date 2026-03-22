import React from 'react'
import { Plus, Filter, Trophy } from 'lucide-react'
import { useTournaments } from '../hooks/useTournaments'
import TournamentCard from '../components/TournamentCard'
import { useAuth } from '../context/AuthContext'
import CreateTournamentModal from '../components/CreateTournamentModal'
import { useNavigate } from 'react-router-dom'

const Tournaments = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { tournaments, loading, error, refresh } = useTournaments()
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  const handleCreateClick = () => {
    if (!user) {
      navigate('/login')
      return
    }
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-8">
      {/* Header Area */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold font-rajdhani arena-text-gradient">Tournament Arena</h2>
          <p className="text-gray-400">Discover and join elite championships</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-3 glass-panel hover:bg-white/10 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
          <button 
            onClick={handleCreateClick}
            className="btn-premium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>CREATE CHAMPIONSHIP</span>
          </button>
        </div>
      </div>

      <CreateTournamentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => refresh()} 
      />

      {/* Main Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="glass-card h-72 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="glass-panel p-10 text-center border-red-500/20">
          <p className="text-red-400 font-rajdhani text-xl mb-2">OPERATIONAL ERROR</p>
          <p className="text-gray-500">{error}</p>
        </div>
      ) : tournaments.length === 0 ? (
        <div className="glass-panel p-20 text-center">
            <Trophy className="w-20 h-20 text-gray-700 mx-auto mb-4 opacity-50" />
          <h3 className="text-2xl font-bold font-rajdhani text-gray-500">NO ACTIVE TOURNAMENTS</h3>
          <p className="text-gray-600 mt-2">The arena is currently quiet. Be the first to start a legacy.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map(t => (
            <TournamentCard key={t.id} tournament={t} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Tournaments
