import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Globe, Trophy, Activity, Zap, Clock, Star, PlayCircle, Newspaper, Calendar, Search, Filter } from 'lucide-react'
import GlobalSportsPulse from '../components/GlobalSportsPulse'

const MOCK_NEWS = [
  { id: 1, title: 'IPL 2026: Defending Champions CSK to Face RCB in Season Opener Tomorrow', category: 'Cricket', time: '1h ago', img: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=200&fit=crop' },
  { id: 2, title: 'Champions League Final Venue Confirmed for 2026', category: 'Football', time: '5h ago', img: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=400&h=200&fit=crop' },
  { id: 3, title: 'NBA All-Star Voting Opens Tuesday; Bronny in Top 10?', category: 'Basketball', time: '8h ago', img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=200&fit=crop' },
  { id: 4, title: 'Wimbledon Announces Record Prize Pool for 2025', category: 'Tennis', time: '12h ago', img: 'https://images.unsplash.com/photo-1595435063523-86e00ca36e57?w=400&h=200&fit=crop' },
]

const GlobalHub = () => {
    const [news, setNews] = useState(MOCK_NEWS)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Simulate loading news
        setTimeout(() => setLoading(false), 1200)
    }, [])

    return (
        <div className="space-y-10">
            {/* Header Section */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[10px] font-bold tracking-[0.2em] mb-6 border border-[var(--color-primary)]/20">
                    <Globe className="w-3 h-3 animate-spin-slow" />
                    SATELLITE DOWNLINK ACTIVE • WORLD UPDATES
                </div>
                <h1 className="text-6xl font-black font-rajdhani arena-text-gradient mb-4 uppercase tracking-tighter leading-none italic">
                    GLOBAL SPORTS <br/>INTELLIGENCE
                </h1>
                <p className="text-[var(--color-textMuted)] text-lg border-l-2 border-[var(--color-primary)]/30 pl-6 italic max-w-lg">
                    Real-time data feeds from over 2,000 leagues world-wide. Experience the pulse of global sports in the Arena.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* News Feed - Left Column */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-black font-rajdhani tracking-tighter flex items-center gap-2 text-[var(--color-text)]">
                            <Newspaper className="w-6 h-6 text-[var(--color-secondary)]" />
                            WORLD SPORTS NEWS
                        </h3>
                        <div className="flex gap-4">
                             <div className="glass-panel px-4 py-2 flex items-center gap-2 border-[var(--color-border)]">
                                 <Search className="w-4 h-4 text-[var(--color-textMuted)]" />
                                 <input type="text" placeholder="Search News..." className="bg-transparent border-none text-xs focus:ring-0 font-medium" />
                             </div>
                             <button className="glass-panel p-2 hover:bg-white/5 transition-all">
                                 <Filter className="w-5 h-5" />
                             </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {loading ? (
                            [1, 2, 3, 4].map(i => (
                                <div key={i} className="h-64 rounded-2xl bg-white/5 animate-pulse border border-white/5" />
                            ))
                        ) : (
                            news.map((item, i) => (
                                <motion.div 
                                    key={item.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="glass-card group cursor-pointer overflow-hidden border-b-2 border-b-transparent hover:border-b-[var(--color-secondary)] transition-all flex flex-col"
                                >
                                    <div className="relative h-44 overflow-hidden">
                                        <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute top-4 left-4 px-2 py-0.5 rounded bg-[var(--color-secondary)]/90 text-white font-bold text-[9px] uppercase tracking-widest">
                                            {item.category}
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col justify-between">
                                        <h4 className="text-lg font-bold font-rajdhani mb-4 leading-tight group-hover:text-[var(--color-secondary)] transition-colors">
                                            {item.title}
                                        </h4>
                                        <div className="flex items-center justify-between text-[10px] font-bold text-[var(--color-textMuted)] uppercase tracking-widest">
                                             <div className="flex items-center gap-2">
                                                 <Clock className="w-3 h-3" />
                                                 {item.time}
                                             </div>
                                             <span className="group-hover:translate-x-1 transition-transform">READ FULL REPORT &rarr;</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

                {/* Score Pulse & API Tutorial - Right Column */}
                <div className="space-y-8">
                    <GlobalSportsPulse />

                    {/* API Tutorial Widget */}
                    <div className="glass-panel p-8 border border-dashed border-[var(--color-primary)]/30 relative group bg-[var(--color-primary)]/5">
                        <Zap className="w-8 h-8 text-[var(--color-primary)] mb-6 animate-pulse" />
                        <h3 className="text-xl font-black font-rajdhani tracking-tight mb-3 text-[var(--color-text)]">
                            CONNECT REAL DATA
                        </h3>
                        <p className="text-xs text-[var(--color-textMuted)] leading-relaxed mb-6 font-medium">
                            To enable real-time updates for over 600 leagues and global Esports, please add your API keys to the environment.
                        </p>
                        
                        <div className="space-y-4 mb-8">
                             {[
                                 { name: 'API-SPORTS', task: 'Football, NBA, Cricket (100 req/day)', url: 'api-sports.io', var: 'VITE_SPORTS_API_KEY' },
                                 { name: 'PandaScore', task: 'LoL, CS:GO, Dota 2 (1,000 req/hr)', url: 'pandascore.co', var: 'VITE_ESPORTS_API_KEY' }
                             ].map((api, i) => (
                                 <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/5 group-hover:border-[var(--color-primary)]/20 transition-all">
                                     <div className="flex justify-between items-start mb-1">
                                         <span className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest">{api.name}</span>
                                         <span className="text-[8px] font-bold text-[var(--color-textMuted)]">{api.url}</span>
                                     </div>
                                     <p className="text-[9px] text-[var(--color-textMuted)] mb-2">{api.task}</p>
                                     <code className="text-[8px] block p-1.5 bg-black/40 rounded border border-white/5 text-[var(--color-text)] font-mono truncate">
                                         {api.var}=your_key
                                     </code>
                                 </div>
                             ))}
                        </div>

                        <button className="w-full btn-premium py-2 text-xs tracking-[0.2em] font-black italic">
                            ACTIVATE NEURAL LINK
                        </button>
                    </div>

                    {/* Upcoming Big Events */}
                    <div className="glass-panel p-6 border-l-4 border-l-[var(--color-success)]">
                        <h3 className="text-lg font-black font-rajdhani tracking-tight mb-6 flex items-center gap-2 text-[var(--color-text)]">
                            <Calendar className="w-5 h-5 text-[var(--color-success)]" />
                            CRITICAL FIXTURES
                        </h3>
                        <div className="space-y-4">
                            {[
                                { match: 'Real Madrid vs Barcelona', time: 'Tomorrow, 21:00', league: 'La Liga' },
                                { match: 'Lakers vs Suns', time: 'Wednesday, 04:30', league: 'NBA' },
                                { match: 'Australia vs India', time: 'Thursday, 09:30', league: 'Test Series' }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col border-b border-[var(--color-border)] pb-3 last:border-0 hover:translate-x-1 transition-transform cursor-pointer group">
                                    <span className="text-[9px] font-black text-[var(--color-success)] uppercase tracking-widest mb-1 italic">
                                        {item.league}
                                    </span>
                                    <span className="text-sm font-bold font-rajdhani text-[var(--color-text)]">{item.match}</span>
                                    <span className="text-[10px] font-bold text-[var(--color-textMuted)] uppercase mt-1">{item.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GlobalHub
