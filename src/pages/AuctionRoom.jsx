import React, { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  Gavel, Users, Timer, TrendingUp, History, Trophy, User, Zap, 
  MessageSquare, Heart, Shield, Award, ArrowUp, Info, Activity,
  ChevronRight, Filter, Wallet, BarChart2, ChevronLeft
} from 'lucide-react'
import { 
  AreaChart, Area, ResponsiveContainer, YAxis, Tooltip
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuction } from '../hooks/useAuction'
import { useAuth } from '../context/AuthContext'
import { AVAILABLE_PLAYERS } from '../lib/constants'

// --- MOCK DATA ---
const UPCOMING_PLAYERS = AVAILABLE_PLAYERS.slice(1, 4)

const TEAM_BUDGETS = [
  { id: 101, name: 'TITAN STRIKERS', budget: 42.5, spent: 12.5, players: 4, color: '#00d4ff' },
  { id: 102, name: 'EXCELSIOR XI', budget: 28.0, spent: 32.0, players: 6, color: '#8b5cf6' },
  { id: 103, name: 'NOVA KNIGHTS', budget: 55.0, spent: 5.0, players: 2, color: '#10b981' },
  { id: 104, name: 'RENEGADE ELITE', budget: 15.2, spent: 44.8, players: 8, color: '#f43f5e' }
]

const PERFORMANCE_DATA = [
  { name: 'M1', score: 45 }, { name: 'M2', score: 82 }, { name: 'M3', score: 61 },
  { name: 'M4', score: 95 }, { name: 'M5', score: 72 }, { name: 'M6', score: 110 }
]

const CHAT_MESSAGES = [
  { user: 'Fan_88', text: 'Auction in this arena? GAME OVER! 🔥', emoji: '🔥' },
  { user: 'Bider_Pro', text: 'Wait for Nova Knights to jump in.', emoji: '💰' },
  { user: 'Arena_Bot', text: 'Auction ending soon.', emoji: '⏳' }
]

// --- COMPONENTS ---

// 1. Counting animation for bid
const AnimatedPrice = ({ price }) => {
    const [displayPrice, setDisplayPrice] = useState(price)
    
    useEffect(() => {
        let start = displayPrice
        const end = price
        const duration = 500
        const stepTime = 10
        const steps = duration / stepTime
        const increment = (end - start) / steps
        
        let timer = setInterval(() => {
            start += increment
            if ((increment > 0 && start >= end) || (increment < 0 && start <= end)) {
                setDisplayPrice(end)
                clearInterval(timer)
            } else {
                setDisplayPrice(start)
            }
        }, stepTime)
        
        return () => clearInterval(timer)
    }, [price])

    return <span>${displayPrice.toFixed(2)}M</span>
}

const AuctionRoom = () => {
  const { id } = useParams()
  const player = AVAILABLE_PLAYERS.find(p => p.id === id) || AVAILABLE_PLAYERS[0]
  const { bids, currentBid, loading, placeBid } = useAuction(id || 'default_auction')
  const { profile } = useAuth()
  
  const basePriceNum = parseFloat(player.basePrice)
  const [bidAmount, setBidAmount] = useState(basePriceNum + 0.10)
  const [timeLeft, setTimeLeft] = useState(15)
  const [autoBid, setAutoBid] = useState(false)
  const [activeTab, setActiveTab] = useState('insights') // 'insights' | 'history' | 'chat'
  
  useEffect(() => {
    if (currentBid) {
        setBidAmount(currentBid.bid_amount / 1000000 + 0.10)
    }
  }, [currentBid])

  // Simulation: Countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  // Simulation: Auto-reset timer on new bid
  useEffect(() => {
    if (bids.length > 0) setTimeLeft(15)
  }, [bids])

  const handlePlaceBid = async (amount) => {
    const numericAmount = parseFloat(amount) * 1000000
    // Simplified team/player assignment for demo
    await placeBid(player.id, profile?.id || 101, numericAmount) 
  }

  if (loading) return <div className="p-20 text-center animate-pulse text-[var(--color-primary)] font-rajdhani uppercase tracking-[0.3em]">SYNCING ARENA NEURAL LINK...</div>

  const currentPrice = currentBid ? currentBid.bid_amount / 1000000 : basePriceNum

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-700">
      
      {/* Header Info Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-3 glass-panel border-l-4 border-l-[var(--color-primary)]">
        <div className="flex items-center gap-4">
            <Link to="/auctions" className="p-2 hover:bg-black/5 rounded-full transition-colors">
                <ChevronLeft className="w-5 h-5 text-[var(--color-textMuted)]" />
            </Link>
            <div>
                <h4 className="text-xs font-bold font-rajdhani text-[var(--color-textMuted)] tracking-widest uppercase">AUCTION ID: #{id || 'GEN-042'}</h4>
                <h2 className="text-xl font-black font-rajdhani tracking-tighter arena-text-gradient uppercase">MEGA DRAFT 2026</h2>
            </div>
        </div>
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--color-danger)] animate-pulse shadow-[0_0_10px_var(--color-danger)]" />
                <span className="text-xs font-bold font-rajdhani tracking-widest uppercase text-[var(--color-text)]">LIVE FEED</span>
            </div>
            <div className="px-4 py-2 bg-black/5 rounded-lg border border-[var(--color-border)] flex items-center gap-3">
                <Timer className={`w-5 h-5 ${timeLeft < 5 ? 'text-[var(--color-danger)] animate-bounce' : 'text-[var(--color-primary)]'}`} />
                <span className={`text-xl font-black font-rajdhani ${timeLeft < 5 ? 'text-[var(--color-danger)]' : 'text-[var(--color-text)]'}`}>
                    00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                </span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* LEFT COLUMN: Player Profile & Queue */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* PLAYER PANEL (DYNAMNIC PROFILE) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-8 relative overflow-hidden group min-h-[400px]"
          >
             {/* Background glow and graphics */}
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-primary)]/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
             <div className="absolute top-0 left-0 w-2 h-full bg-[var(--color-primary)]" />
             
             <div className="flex flex-col md:flex-row gap-10 relative z-10 h-full">
                
                {/* 1. Profile Avatar Visual */}
                <div className="relative shrink-0">
                    <div className="w-56 h-72 rounded-3xl arena-gradient p-[2px] shadow-2xl group-hover:scale-105 transition-transform duration-500">
                        <div className="w-full h-full bg-[var(--color-surface)] rounded-[calc(var(--card-radius)-2px)] flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)] via-transparent to-transparent opacity-80" />
                            <User className="w-32 h-32 text-[var(--color-primary)] opacity-20 group-hover:opacity-40 transition-opacity" />
                            {player.image && <img src={player.image} className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30 grayscale group-hover:grayscale-0 transition-all duration-700" alt={player.name} />}
                            
                            {/* Badges */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                {player.tags.map(tag => (
                                    <div key={tag} className="px-2 py-1 glass-panel bg-[var(--color-primary)]/20 border-[var(--color-primary)]/30 text-[8px] font-black text-[var(--color-primary)] rounded flex items-center gap-1 tracking-widest uppercase">
                                        {tag === 'Verified' ? <Shield className="w-2 h-2" /> : <Zap className="w-2 h-2 fill-current" />} {tag}
                                    </div>
                                ))}
                            </div>

                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-bold text-[var(--color-textMuted)] uppercase tracking-widest">Performance</span>
                                    <span className="text-xs font-black text-[var(--color-primary)]">{player.rating}/10</span>
                                </div>
                                <div className="w-full bg-black/10 h-1 rounded-full overflow-hidden">
                                    <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: `${player.rating * 10}%` }}
                                      transition={{ duration: 1, delay: 0.5 }}
                                      className="bg-[var(--color-primary)] h-full shadow-[0_0_10px_var(--color-primary)]" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Stats & Current Status */}
                <div className="flex-1 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                             <div className="w-8 h-8 rounded-lg bg-[var(--color-secondary)]/10 border border-[var(--color-secondary)]/20 flex items-center justify-center text-[var(--color-secondary)]">
                                <Award className="w-4 h-4" />
                             </div>
                             <span className="text-xs font-bold text-[var(--color-secondary)] tracking-[0.3em] uppercase italic">ELITE {player.role}</span>
                        </div>
                        <h2 className="text-6xl font-black font-rajdhani tracking-tighter mb-4 leading-none uppercase italic border-b border-[var(--color-border)] pb-4 text-[var(--color-text)]">
                            {player.name}
                        </h2>

                        <div className="grid grid-cols-3 gap-6 mb-8">
                            {[
                                { label: 'Strike Rate', value: player.stats.sr, icon: Activity },
                                { label: 'Matches', value: player.stats.matches, icon: History },
                                { label: 'Form Index', value: 'High', icon: TrendingUp }
                            ].map((stat, i) => (
                                <div key={i} className="space-y-1 text-[var(--color-text)]">
                                    <p className="text-[10px] font-bold text-[var(--color-textMuted)] uppercase tracking-widest flex items-center gap-1">
                                        <stat.icon className="w-3 h-3 text-[var(--color-primary)]/50" /> {stat.label}
                                    </p>
                                    <p className="text-xl font-black font-rajdhani">{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Recent Performance Sparkline */}
                        <div className="h-20 w-full glass-card p-4 rounded-xl border-dashed border-[var(--color-border)]">
                            <div className="flex items-center justify-between mb-2">
                                 <span className="text-[10px] font-bold text-[var(--color-textMuted)] uppercase tracking-widest">Recent Form</span>
                                 <ArrowUp className="w-3 h-3 text-[var(--color-success)]" />
                            </div>
                            <div className="h-full w-full opacity-50">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={PERFORMANCE_DATA}>
                                        <Area type="monotone" dataKey="score" stroke="var(--color-primary)" fill="rgba(var(--color-primary-rgb),0.1)" strokeWidth={2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Current Bid Display (Big) */}
                    <div className="flex items-end justify-between mt-auto pt-8 border-t border-[var(--color-border)]">
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-[var(--color-textMuted)] uppercase tracking-widest">Top Bidder Node</p>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-[var(--color-primary)]/20 flex items-center justify-center text-[10px] font-black text-[var(--color-primary)]">TC</div>
                                <span className="font-bold text-[var(--color-text)] uppercase font-rajdhani tracking-widest">{currentBid ? 'TITAN STRIKERS' : 'WAITING FOR BID'}</span>
                            </div>
                        </div>
                        <div className="text-right">
                             <p className="text-xs font-black text-[var(--color-primary)] uppercase tracking-[0.2em] mb-1 animate-pulse">CURRENT VALUATION</p>
                             <h3 className="text-5xl font-black font-rajdhani tracking-tighter arena-text-gradient">
                                <AnimatedPrice price={currentPrice} />
                             </h3>
                        </div>
                    </div>
                </div>
             </div>
          </motion.div>

          {/* PLAYER QUEUE & CONTROLS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             
             {/* Bidding Controls (Advanced) */}
             <div className="glass-panel p-6 border-t-2 border-t-[var(--color-primary)] space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold font-rajdhani tracking-widest uppercase flex items-center gap-2 text-[var(--color-text)]">
                        <Gavel className="w-4 h-4 text-[var(--color-primary)]" /> CONTROL TERMINAL
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-[var(--color-textMuted)] uppercase">Auto-Bid</span>
                        <button 
                          onClick={() => setAutoBid(!autoBid)}
                          className={`w-8 h-4 rounded-full p-0.5 transition-colors ${autoBid ? 'bg-[var(--color-primary)]' : 'bg-black/10'}`}
                        >
                            <div className={`w-3 h-3 rounded-full bg-white transition-transform ${autoBid ? 'translate-x-4' : ''}`} />
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between px-4 py-2 bg-black/5 rounded-lg border border-[var(--color-border)]">
                        <span className="text-[10px] font-bold text-[var(--color-textMuted)] uppercase">Set Increase</span>
                        <span className="text-lg font-black font-rajdhani text-[var(--color-primary)]">${bidAmount.toFixed(2)}M</span>
                    </div>
                    
                    {/* Slider Simulation */}
                    <div className="relative h-1 w-full bg-[var(--color-border)] rounded-full">
                        <div className="absolute top-0 left-0 h-full w-1/3 bg-[var(--color-primary)] rounded-full" />
                        <div className="absolute -top-1.5 left-1/3 w-4 h-4 rounded-full bg-[var(--color-text)] shadow-xl cursor-pointer" />
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                        {[0.1, 0.5, 1.0, 5.0].map(val => (
                            <button 
                              key={val}
                              onClick={() => setBidAmount(currentPrice + val)}
                              className="py-2 glass-card rounded border border-[var(--color-border)] text-[10px] font-black text-[var(--color-textMuted)] hover:text-[var(--color-text)] hover:border-[var(--color-primary)] transition-all"
                            >
                                + {val}M
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-3">
                        <button 
                          onClick={() => handlePlaceBid(bidAmount)}
                          className="flex-[3] btn-premium py-4 flex items-center justify-center gap-3 group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                            <span className="font-black font-rajdhani tracking-[0.2em] uppercase">EXECUTE BID</span>
                        </button>
                        <button className="flex-1 glass-card border-[var(--color-danger)]/20 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 flex items-center justify-center p-0" title="Aggressive Jump">
                             <Zap className="w-5 h-5" />
                        </button>
                    </div>
                </div>
             </div>

             {/* Upcoming Queue */}
             <div className="glass-panel p-6">
                <h3 className="text-sm font-bold font-rajdhani tracking-widest uppercase mb-4 flex items-center gap-2 text-[var(--color-text)]">
                    <History className="w-4 h-4 text-[var(--color-secondary)]" /> UPCOMING DRAFTS
                </h3>
                <div className="space-y-3">
                    {UPCOMING_PLAYERS.map((p, i) => (
                        <div key={p.id} className="p-3 glass-card rounded-lg flex items-center justify-between group hover:border-[var(--color-secondary)]/30 transition-all overflow-hidden relative border border-[var(--color-border)]">
                            {i === 0 && <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-secondary)]" />}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded bg-black/5 flex items-center justify-center text-xs font-black opacity-50 text-[var(--color-text)]">
                                    {p.name.split(' ')[0][0]}{p.name.split(' ')[1][0]}
                                </div>
                                <div>
                                    <p className="text-xs font-black font-rajdhani group-hover:text-[var(--color-secondary)] transition-colors uppercase text-[var(--color-text)]">{p.name}</p>
                                    <p className="text-[10px] text-[var(--color-textMuted)] font-bold uppercase tracking-widest">{p.role}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-[var(--color-textMuted)] font-black uppercase">BASE</p>
                                <p className="text-sm font-black font-rajdhani text-[var(--color-textMuted)] group-hover:text-[var(--color-text)]">${p.basePrice}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="w-full mt-4 py-2 text-[10px] font-bold text-[var(--color-textMuted)] hover:text-[var(--color-text)] uppercase tracking-[0.3em] transition-colors">
                    VIEW FULL ROSTER <ChevronRight className="w-3 h-3 inline ml-1" />
                </button>
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Team Stats, Budget & Analytics */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* BUDGETS & TEAMS */}
          <div className="glass-panel p-6 border-t-2 border-t-[var(--color-secondary)]">
            <h3 className="text-sm font-bold font-rajdhani tracking-widest uppercase mb-6 flex items-center gap-2 text-[var(--color-text)]">
                <Wallet className="w-4 h-4 text-[var(--color-secondary)]" /> TREASURY MONITOR
            </h3>
            <div className="space-y-6">
                {TEAM_BUDGETS.map((team, idx) => (
                    <div key={team.id} className="space-y-2 group">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full shadow-[0_0_5px_currentColor]" style={{ backgroundColor: team.color }} />
                                <span className="text-[11px] font-black font-rajdhani tracking-tight text-[var(--color-textMuted)] group-hover:text-[var(--color-text)] uppercase truncate">{team.name}</span>
                            </div>
                            <span className="text-xs font-bold text-[var(--color-text)] font-rajdhani">${team.budget.toFixed(1)}M</span>
                        </div>
                        <div className="relative h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(team.budget / (team.budget + team.spent)) * 100}%` }}
                              className="h-full rounded-full opacity-60 group-hover:opacity-100 transition-opacity"
                              style={{ backgroundColor: team.color }}
                            />
                        </div>
                        <div className="flex justify-between text-[9px] font-bold text-[var(--color-textMuted)] uppercase">
                             <span>{team.players} Players</span>
                             <span className={team.budget < 20 ? 'text-[var(--color-danger)]' : 'text-[var(--color-textMuted)]'}>
                                {team.budget < 20 ? 'CRITICAL BUDGET' : 'STABLE'}
                             </span>
                        </div>
                    </div>
                ))}
            </div>
          </div>

          {/* INSIGHTS & ENGAGEMENT TABS */}
          <div className="glass-panel flex flex-col h-[520px]">
             <div className="flex border-b border-[var(--color-border)]">
                {['insights', 'history', 'chat'].map(tab => (
                    <button 
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative
                        ${activeTab === tab ? 'text-[var(--color-primary)]' : 'text-[var(--color-textMuted)] hover:text-[var(--color-text)]'}`}
                    >
                        {tab}
                        {activeTab === tab && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--color-primary)]" />}
                    </button>
                ))}
             </div>

             <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                <AnimatePresence mode="wait">
                    {activeTab === 'insights' && (
                        <motion.div 
                          key="ins"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-6"
                        >
                            <div className="p-4 glass-card rounded-xl border-[var(--color-primary)]/20 border">
                                <p className="text-[10px] font-bold text-[var(--color-textMuted)] uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <BarChart2 className="w-3 h-3 text-[var(--color-primary)]" /> Win Probability
                                </p>
                                <div className="flex items-center gap-4">
                                     <div className="w-16 h-16 rounded-full border-4 border-[var(--color-primary)]/20 border-t-[var(--color-primary)] flex items-center justify-center text-lg font-black font-rajdhani text-[var(--color-text)]">
                                        82%
                                     </div>
                                     <p className="text-[10px] text-[var(--color-textMuted)] font-medium leading-relaxed italic">"Highly recommended for death-overs specialist role based on recent trend node analysis."</p>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-2">
                                     <span className="text-[10px] font-bold text-[var(--color-textMuted)] uppercase tracking-widest">Demand Indicator</span>
                                     <span className="text-[10px] font-black text-[var(--color-danger)] uppercase italic">EXTREME 🔥</span>
                                </div>
                                <div className="bg-black/5 h-3 rounded-full flex gap-1 p-0.5 border border-[var(--color-border)]">
                                    <div className="h-full w-1/4 bg-[var(--color-primary)] rounded-sm opacity-30" />
                                    <div className="h-full w-1/4 bg-[var(--color-primary)] rounded-sm opacity-50" />
                                    <div className="h-full w-1/4 bg-[var(--color-primary)] rounded-sm opacity-80" />
                                    <div className="h-full w-1/4 bg-[var(--color-primary)] rounded-sm shadow-[0_0_10px_var(--color-primary)]" />
                                </div>
                            </div>

                            <div className="p-4 glass-card bg-[var(--color-primary)]/5 rounded-xl border border-[var(--color-primary)]/20">
                                <h4 className="text-xs font-black text-[var(--color-text)] uppercase tracking-widest mb-2 flex items-center gap-2">
                                     <Zap className="w-3 h-3 text-[var(--color-primary)]" /> POPULARITY HEAT
                                </h4>
                                <p className="text-[10px] text-[var(--color-textMuted)] font-bold uppercase mb-3">Audience Sentiment: Positive (91%)</p>
                                <div className="flex gap-1 justify-between">
                                    {['👏', '🔥', '💰', '👑', '⚡'].map((emoji, i) => (
                                        <button 
                                          key={i} 
                                          onClick={() => {
                                              console.log("Reaction sent:", emoji)
                                          }}
                                          className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center hover:bg-[var(--color-primary)]/20 transition-all active:scale-90 border border-[var(--color-border)]"
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'history' && (
                        <motion.div 
                            key="hist"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            {bids.map((bid, i) => (
                                <div key={bid.id} className={`p-4 rounded-xl border flex items-center justify-between
                                    ${i === 0 ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)]/20 shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.1)]' : 'bg-black/5 border-[var(--color-border)] text-[var(--color-textMuted)]'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full arena-gradient flex items-center justify-center text-[10px] font-bold text-white">TC</div>
                                        <div>
                                            <p className="text-xs font-bold text-[var(--color-text)]">TITAN STRIKERS</p>
                                            <p className="text-[10px] text-[var(--color-textMuted)] uppercase">{new Date(bid.bid_time).toLocaleTimeString()}</p>
                                        </div>
                                    </div>
                                    <p className="font-rajdhani font-bold text-[var(--color-primary)] tracking-tighter text-lg">${(bid.bid_amount / 1000000).toFixed(2)}M</p>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {activeTab === 'chat' && (
                        <motion.div 
                            key="chat"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4 h-full flex flex-col"
                        >
                            <div className="space-y-4 mb-4 flex-1">
                                {CHAT_MESSAGES.map((msg, i) => (
                                    <div key={i} className="flex gap-3">
                                        <div className="w-8 h-8 rounded bg-black/10 shrink-0 flex items-center justify-center text-[9px] font-bold text-[var(--color-textMuted)] border border-[var(--color-border)] uppercase">{msg.user[0]}</div>
                                        <div className="flex-1">
                                            <p className="text-[9px] font-bold text-[var(--color-primary)] uppercase mb-1">{msg.user}</p>
                                            <div className="px-3 py-2 bg-black/5 border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-textMuted)] relative">
                                                {msg.text}
                                                <span className="absolute -right-2 -top-2 text-xs">{msg.emoji}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="sticky bottom-0 bg-[var(--color-surface)] pt-2">
                                <div className="relative">
                                    <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-textMuted)]" />
                                    <input placeholder="React to arena..." className="w-full bg-black/5 border border-[var(--color-border)] rounded-lg py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-text)]" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuctionRoom
