import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Trophy, Activity, Zap, Clock, Star, PlayCircle } from 'lucide-react'

// Mock data to show what it LOOKS LIKE before connecting a real key
const MOCK_LIVESCORES = [
  { id: 1, sport: 'Football', league: 'Premier League', home: 'Liverpool', away: 'Man City', score: '2 - 2', time: '82\'', status: 'Live' },
  { id: 5, sport: 'Cricket', league: 'IPL 2026', home: 'CSK', away: 'RCB', score: 'Starts Tomorrow', time: '19:30', status: 'Upcoming' },
  { id: 2, sport: 'Basketball', league: 'NBA', home: 'Lakers', away: 'Warriors', score: '102 - 98', time: 'Q4', status: 'Live' },
  { id: 3, sport: 'Cricket', league: 'IPL', home: 'Mumbai Indians', away: 'LSG', score: '184/4 (18.2)', time: 'Innings 1', status: 'Live' },
]

const GlobalSportsPulse = () => {
    const [matches, setMatches] = useState(MOCK_LIVESCORES)
    const [loading, setLoading] = useState(true)
    const [apiKeyExists, setApiKeyExists] = useState(!!import.meta.env.VITE_SPORTS_API_KEY)

    useEffect(() => {
        const fetchGlobalScores = async () => {
            if (!apiKeyExists) {
                setTimeout(() => setLoading(false), 1500)
                return
            }

            try {
                // Fetch live football matches as the primary "pulse"
                const res = await fetch('https://v3.football.api-sports.io/fixtures?live=all', {
                    headers: { 
                      'x-apisports-key': import.meta.env.VITE_SPORTS_API_KEY,
                      'x-rapidapi-host': 'v3.football.api-sports.io'
                    }
                })
                const data = await res.json()
                
                if (data.results > 0) {
                    const mapped = data.response.slice(0, 5).map(m => ({
                        id: m.fixture.id,
                        sport: 'Football',
                        league: m.league.name,
                        home: m.teams.home.name,
                        away: m.teams.away.name,
                        score: `${m.goals.home} - ${m.goals.away}`,
                        time: `${m.fixture.status.elapsed}'`,
                        status: m.fixture.status.short
                    }))
                    setMatches(mapped)
                }
                setLoading(false)
            } catch (err) {
                console.error("Pulse Link Failed:", err)
                setLoading(false)
            }
        }

        fetchGlobalScores()
        
        // Polling for "Real-time" effect every 60 seconds (API limits)
        const interval = setInterval(() => {
            if (apiKeyExists) fetchGlobalScores()
            else {
                setMatches(prev => prev.map(m => {
                    if (m.status === 'Live' && Math.random() > 0.8) {
                        const scoreParts = m.score.split(' - ')
                        const h = parseInt(scoreParts[0])
                        const a = parseInt(scoreParts[1])
                        if (!isNaN(h)) return { ...m, score: `${h + (Math.random() > 0.5 ? 1 : 0)} - ${a + (Math.random() > 0.5 ? 1 : 0)}` }
                    }
                    return m
                }))
            }
        }, 60000)

        return () => clearInterval(interval)
    }, [apiKeyExists])

    return (
        <div className="glass-panel overflow-hidden border-t-2 border-t-[var(--color-primary)] relative group">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)]/10 blur-3xl -mr-16 -mt-16 group-hover:bg-[var(--color-primary)]/20 transition-all duration-700" />
            
            <div className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-black font-rajdhani tracking-tighter flex items-center gap-2 text-[var(--color-text)]">
                            <Activity className="w-5 h-5 text-[var(--color-primary)] animate-pulse" />
                            GLOBAL SPORTS PULSE
                        </h3>
                        <p className="text-[10px] text-[var(--color-textMuted)] font-bold uppercase tracking-[0.2em] mt-1">
                            Real-time broadcast satellite link • {apiKeyExists ? 'ENCRYPTED' : 'DEMO MODE'}
                        </p>
                    </div>
                    {!apiKeyExists && (
                         <div className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded text-[9px] font-bold text-yellow-500 uppercase tracking-widest animate-pulse">
                             Add API Key for Real Global Link
                         </div>
                    )}
                </div>

                {loading ? (
                    <div className="space-y-4 py-8">
                         {[1, 2, 3].map(i => (
                             <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse border border-white/5" />
                         ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {matches.map((match, idx) => (
                                <motion.div 
                                    key={match.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/30 transition-all group/match cursor-pointer relative overflow-hidden"
                                >
                                    <div className="flex items-center justify-between relative z-10">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-[var(--color-primary)]/10 text-[var(--color-primary)] uppercase tracking-tighter italic">
                                                    {match.sport}
                                                </span>
                                                <span className="text-[9px] font-bold text-[var(--color-textMuted)] uppercase tracking-widest opacity-60">
                                                    {match.league}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex-1 text-right font-rajdhani font-bold text-sm tracking-tight group-hover/match:text-[var(--color-primary)] transition-colors">
                                                    {match.home}
                                                </div>
                                                <div className="px-3 py-1 rounded bg-black/40 border border-white/5 font-black font-rajdhani text-lg min-w-[3.5rem] text-center arena-text-gradient italic shadow-inner">
                                                    {match.score}
                                                </div>
                                                <div className="flex-1 text-left font-rajdhani font-bold text-sm tracking-tight group-hover/match:text-[var(--color-primary)] transition-colors">
                                                    {match.away}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="ml-6 flex flex-col items-center justify-center min-w-[3rem]">
                                            <div className="flex items-center gap-1.5 text-[var(--color-primary)] text-[10px] font-black italic uppercase animate-pulse">
                                                <div className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
                                                {match.time}
                                            </div>
                                            <span className="text-[8px] font-bold text-[var(--color-textMuted)] uppercase tracking-[0.2em] mt-1">{match.status}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Hover Action */}
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/match:opacity-100 transition-opacity">
                                        <Star className="w-4 h-4 text-[var(--color-primary)] fill-current" />
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                <button className="w-full mt-8 py-3 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-primary)]/5 hover:border-[var(--color-primary)] transition-all font-rajdhani font-bold text-[10px] tracking-[0.4em] text-[var(--color-textMuted)] hover:text-[var(--color-text)] uppercase group/btn">
                    <span className="flex items-center justify-center gap-3">
                        DISCOVER WORLD HUB
                        <PlayCircle className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </span>
                </button>
            </div>
        </div>
    )
}

export default GlobalSportsPulse
