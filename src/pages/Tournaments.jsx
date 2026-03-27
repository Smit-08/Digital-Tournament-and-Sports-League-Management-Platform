import React, { useState, useEffect, useMemo } from 'react'
import { Plus, Filter, Trophy, Calendar, Clock, CheckCircle2, Globe, Activity, LayoutGrid } from 'lucide-react'
import TournamentCard from '../components/TournamentCard'
import { useAuth } from '../context/AuthContext'
import { tournamentService } from '../lib/tournamentService'
import CreateTournamentModal from '../components/CreateTournamentModal'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const Tournaments = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('live') // live, upcoming, completed
  const [selectedSport, setSelectedSport] = useState('ALL')
  const [data, setData] = useState({ live: [], upcoming: [], completed: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCategorizedTournaments = async () => {
    try {
      setLoading(true)
      console.log("ARENA_SCAN: Initializing Unified Data Uplink...")
      const res = await tournamentService.getAllTournaments()
      setData(res)
      console.log("ARENA_SCAN_SUCCESS:", {
          LIVE: res.live?.length,
          UPCOMING: res.upcoming?.length,
          COMPLETED: res.completed?.length
      })
    } catch (err) {
      console.error("ARENA_SCAN_ERROR:", err)
      setError("FAILED TO RETRIEVE BATTLEFIELD INTEL")
    } finally {
      setLoading(false)
    }
  }

  const refresh = fetchCategorizedTournaments

  useEffect(() => {
    fetchCategorizedTournaments()
  }, [])

  const filteredTournaments = useMemo(() => {
    const rawPool = data[activeTab] || []
    
    // Log for debugging
    console.log(`BATTLE_TRACE: Tab [${activeTab}] Raw Pool Count:`, rawPool.length)
    if (rawPool.length > 0) {
        console.log(`BATTLE_TRACE: First Tournament in Pool:`, rawPool[0])
    }

    const filtered = rawPool.filter(t => {
      // Sport Filter logic: If 'ALL', show all. Else, match sport field case-insensitively.
      const sportMatch = selectedSport === 'ALL' || 
                        (t.sport && t.sport.toUpperCase() === selectedSport.toUpperCase())
      
      return sportMatch
    })

    console.log(`BATTLE_TRACE: Tab [${activeTab}] Filtered Result [${selectedSport}]:`, filtered.length)
    if (filtered.length === 0 && rawPool.length > 0) {
        console.log(`BATTLE_TRACE: CRITICAL - Filtered out all items in pool. 
                     Target Sport: ${selectedSport}. 
                     Pool Sport Samples:`, rawPool.slice(0, 3).map(p => p.sport))
    }
    return filtered
  }, [data, activeTab, selectedSport])

  const handleCreateClick = () => {
    if (!user) {
      navigate('/login')
      return
    }
    setIsModalOpen(true)
  }

  const tabs = [
    { id: 'live', label: 'In Progress', icon: Activity, color: 'text-[var(--color-primary)]' },
    { id: 'upcoming', label: 'Upcoming', icon: Calendar, color: 'text-[var(--color-secondary)]' },
    { id: 'completed', label: 'Completed', icon: CheckCircle2, color: 'text-[var(--color-success)]' }
  ]

  const sports = ['ALL', 'FOOTBALL', 'BASKETBALL', 'CRICKET', 'ESPORTS']

  return (
    <div className="space-y-10">
      {/* Header Area */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[10px] font-bold tracking-[0.2em] mb-4 border border-[var(--color-primary)]/20">
            <Trophy className="w-3 h-3" />
            ELITE COMPETITION CIRCUIT
          </div>
          <h2 className="text-5xl font-black font-rajdhani arena-text-gradient uppercase tracking-tighter leading-none italic">
            TOURNAMENT <br/>ARENA
          </h2>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {sports.map(sport => (
            <button 
              key={sport}
              onClick={() => setSelectedSport(sport)}
              className={`px-4 py-2 rounded-lg font-rajdhani font-bold text-xs tracking-widest transition-all border
                ${selectedSport === sport 
                  ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/20' 
                  : 'glass-panel text-[var(--color-textMuted)] border-[var(--color-border)] hover:border-[var(--color-primary)]/30'}`}
            >
              {sport}
            </button>
          ))}
          <div className="w-px h-8 bg-[var(--color-border)] mx-2 hidden lg:block" />
          <button 
            onClick={handleCreateClick}
            className="btn-premium flex items-center gap-3 px-6 py-3"
          >
            <Plus className="w-4 h-4" />
            <span className="font-bold tracking-widest text-xs">HOST CHAMPIONSHIP</span>
          </button>
        </div>
      </div>

      {/* Categories Tabs */}
      <div className="flex items-center gap-8 border-b border-[var(--color-border)] pb-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 pb-4 px-2 font-rajdhani font-black text-sm tracking-widest uppercase transition-all relative
              ${activeTab === tab.id ? 'text-[var(--color-text)]' : 'text-[var(--color-textMuted)] hover:text-[var(--color-text)]'}`}
          >
            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? tab.color : ''}`} />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--color-primary)] shadow-[0_0_10px_var(--color-primary)]"
              />
            )}
          </button>
        ))}
      </div>

      <CreateTournamentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => refresh()} 
      />

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
           key={`${activeTab}-${selectedSport}`}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -10 }}
           transition={{ duration: 0.2 }}
        >
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="glass-card h-80 animate-pulse border border-[var(--color-border)] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="glass-panel p-16 text-center border-2 border-dashed border-[var(--color-danger)]/20">
              <div className="w-16 h-16 bg-[var(--color-danger)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Trophy className="w-8 h-8 text-[var(--color-danger)]" />
              </div>
              <p className="text-[var(--color-danger)] font-black font-rajdhani text-2xl mb-2 uppercase tracking-widest italic">LINK_FAILED</p>
              <p className="text-[var(--color-textMuted)] font-medium">{error}</p>
            </div>
          ) : filteredTournaments.length === 0 ? (
            <div className="glass-panel p-24 text-center border-2 border-dashed border-[var(--color-border)] relative overflow-hidden group">
                <div className="absolute inset-0 bg-[var(--color-primary)]/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Trophy className="w-24 h-24 text-[var(--color-textMuted)] mx-auto mb-6 opacity-30 group-hover:scale-110 group-hover:rotate-6 transition-transform" />
                <h3 className="text-3xl font-black font-rajdhani text-[var(--color-text)] uppercase tracking-tighter italic">NO {activeTab.toUpperCase()} DATA</h3>
                <p className="text-[var(--color-textMuted)] mt-3 font-medium max-w-sm mx-auto tracking-wide">
                    The arena scanners are currently clear for this category. Start a local championship or try another sport filter.
                </p>
                <button 
                  onClick={handleCreateClick}
                  className="mt-8 px-8 py-3 glass-panel hover:bg-[var(--color-primary)]/10 border-[var(--color-primary)]/20 text-[var(--color-primary)] font-bold font-rajdhani tracking-widest text-xs uppercase"
                >
                    INITIALIZE NEW SECTOR
                </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTournaments.map((t, idx) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <TournamentCard tournament={t} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Legend / Info */}
      <div className="flex items-center gap-6 pt-10 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[var(--color-primary)]" />
              <span className="text-[10px] font-bold text-[var(--color-textMuted)] uppercase tracking-widest">Global Data Active</span>
          </div>
          <div className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-[var(--color-textMuted)]" />
              <span className="text-[10px] font-bold text-[var(--color-textMuted)] uppercase tracking-widest">{filteredTournaments.length} Records Detected</span>
          </div>
      </div>
    </div>
  )
}

export default Tournaments
