import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Users, Trophy, Zap, Shield, Award, Play, Filter, Search,
  TrendingUp, Activity, BarChart2, Star
} from 'lucide-react'
import { motion } from 'framer-motion'
import { AVAILABLE_PLAYERS } from '../lib/constants'

const PlayerSelectionCard = ({ player, onSelect }) => {
    return (
        <motion.div 
            whileHover={{ scale: 1.02, translateY: -5 }}
            className="glass-panel p-6 relative overflow-hidden group cursor-pointer border-l-4 border-l-transparent hover:border-l-[var(--color-primary)] transition-all duration-300 shadow-xl shadow-black/5"
            onClick={() => onSelect(player.id)}
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)]/5 blur-[40px] rounded-full pointer-events-none group-hover:bg-[var(--color-primary)]/10 transition-colors" />
            
            <div className="flex gap-6 relative z-10">
                {/* Image Section */}
                <div className="w-32 h-44 rounded-xl overflow-hidden relative shadow-2xl shrink-0">
                    <img src={player.image} alt={player.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-2 left-2 right-2 text-center">
                         <div className="px-2 py-0.5 bg-[var(--color-primary)]/20 backdrop-blur-md rounded text-[8px] font-black text-[var(--color-primary)] uppercase tracking-widest border border-[var(--color-primary)]/30">
                            {player.rating}/10 RATING
                         </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[8px] font-bold text-[var(--color-textMuted)] uppercase tracking-[0.2em]">{player.role}</span>
                            {player.tags.map(tag => (
                                <span key={tag} className="text-[7px] font-bold text-[var(--color-secondary)] uppercase px-1 border border-[var(--color-secondary)]/30 rounded">{tag}</span>
                            ))}
                        </div>
                        <h3 className="text-2xl font-black font-rajdhani tracking-tighter group-hover:text-[var(--color-primary)] transition-colors text-[var(--color-text)]">
                            {player.name}
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-4 mt-4 py-3 border-y border-[var(--color-border)]">
                            <div className="text-[var(--color-text)]">
                                <p className="text-[8px] font-bold text-[var(--color-textMuted)] uppercase">Avg SR</p>
                                <p className="text-sm font-black font-rajdhani">{player.stats.sr}</p>
                            </div>
                            <div className="text-[var(--color-text)]">
                                <p className="text-[8px] font-bold text-[var(--color-textMuted)] uppercase">Matches</p>
                                <p className="text-sm font-black font-rajdhani">{player.stats.matches}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        <div>
                            <p className="text-[8px] font-bold text-[var(--color-textMuted)] uppercase">Base Price</p>
                            <p className="text-xl font-black font-rajdhani text-[var(--color-primary)]">${player.basePrice}</p>
                        </div>
                        <button className="btn-premium w-10 h-10 p-0 flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-[var(--color-primary)]/20">
                            <Play className="w-5 h-5 fill-current" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

const AuctionSelection = () => {
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState('')
    const [activeFilter, setActiveFilter] = useState('ALL')

    const filteredPlayers = AVAILABLE_PLAYERS.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesFilter = activeFilter === 'ALL' || p.role === activeFilter
        return matchesSearch && matchesFilter
    })

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header / Intro */}
            <div className="glass-panel p-10 relative overflow-hidden border-b-4 border-b-[var(--color-secondary)]">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--color-secondary)]/5 blur-[120px] rounded-full pointer-events-none" />
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] text-[10px] font-bold tracking-[0.2em] mb-4 border border-[var(--color-secondary)]/20">
                        <Trophy className="w-3 h-3" />
                        OPEN DRAFT SEASON 2026
                    </div>
                    <h1 className="text-5xl font-black font-rajdhani arena-text-gradient tracking-tighter italic uppercase leading-tight mb-4">
                        CHOOSE YOUR <br/>BATTLE CHAMPION
                    </h1>
                    <p className="text-[var(--color-textMuted)] font-medium max-w-xl text-lg italic border-l-2 border-[var(--color-secondary)]/30 pl-6">
                        The arena waits for no one. Select a star player to initiate a high-stakes auction and claim dominance for your team.
                    </p>
                </div>
                <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-10">
                     <Users className="w-64 h-64 text-[var(--color-secondary)]" />
                </div>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
                <div className="flex gap-2 p-1 glass-panel bg-black/5 rounded-xl border border-[var(--color-border)]">
                    {['ALL', 'BATSMAN', 'BOWLER', 'ALL-ROUNDER'].map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-6 py-2 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all
                                ${activeFilter === filter ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20' : 'text-[var(--color-textMuted)] hover:text-[var(--color-text)]'}`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-textMuted)]" />
                    <input 
                        type="text" 
                        placeholder="ATHLETE SEARCH SCAN..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/5 border border-[var(--color-border)] rounded-xl py-3 pl-12 pr-4 text-xs font-rajdhani focus:border-[var(--color-primary)] transition-all focus:outline-none text-[var(--color-text)]"
                    />
                </div>
            </div>

            {/* Player Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {filteredPlayers.map(player => (
                    <PlayerSelectionCard 
                        key={player.id} 
                        player={player} 
                        onSelect={(id) => navigate(`/auctions/${id}`)}
                    />
                ))}
            </div>

            {/* Quick Stats Summary Footer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-[var(--color-border)]">
                {[
                    { label: 'Available Talents', value: '42 Active', icon: Star, color: 'text-yellow-400' },
                    { label: 'Bid War Index', value: 'High', icon: TrendingUp, color: 'text-red-400' },
                    { label: 'Arena Response', value: '98%', icon: Activity, color: 'text-[var(--color-primary)]' }
                ].map((stat, i) => (
                    <div key={i} className="flex items-center gap-4 px-6 py-4 glass-card border-[var(--color-border)] rounded-xl">
                        <div className={`p-2 rounded-lg bg-black/5 ${stat.color}`}>
                            <stat.icon className="w-5 h-5 shadow-sm" />
                        </div>
                        <div>
                             <p className="text-[9px] font-bold text-[var(--color-textMuted)] uppercase tracking-widest">{stat.label}</p>
                             <p className="text-lg font-black font-rajdhani tracking-tighter text-[var(--color-text)]">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AuctionSelection
