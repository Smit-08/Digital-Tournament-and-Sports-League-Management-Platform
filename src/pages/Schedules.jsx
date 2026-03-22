import React, { useState, useEffect } from 'react'
import { Calendar, Play, MapPin, Filter, MoreVertical, Timer, Swords } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'

const Schedules = () => {
    const [matches, setMatches] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchMatches = async () => {
            const { data } = await supabase
                .from('matches')
                .select(`
                    *,
                    team1:teams!matches_team1_id_fkey(name, logo),
                    team2:teams!matches_team2_id_fkey(name, logo),
                    venue:venues(name)
                `)
                .order('match_time', { ascending: true })
            
            if (data) setMatches(data)
            setLoading(false)
        }

        fetchMatches()

        // Real-time updates
        const channel = supabase
            .channel('schedules_realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, fetchMatches)
            .subscribe()

        return () => channel.unsubscribe()
    }, [])

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-4xl font-bold font-rajdhani arena-text-gradient">Battle Schedule</h2>
                    <p className="text-gray-400">Never miss a championship moment</p>
                </div>
                <div className="flex gap-3">
                    <button className="glass-panel p-3 hover:bg-white/10 transition-colors">
                        <Filter className="w-5 h-5 text-arena-accent" />
                    </button>
                    <button className="btn-premium px-6 font-bold flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>SYNC TO GOOGLE</span>
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="glass-panel p-10 h-32 animate-pulse" />
                    ))
                ) : matches.length === 0 ? (
                    <div className="p-20 text-center opacity-30 border-2 border-dashed border-white/5 rounded-3xl">
                        <Swords className="w-16 h-16 mx-auto mb-4" />
                        <p className="text-xl font-bold font-rajdhani">THE ARENA IS CURRENTLY QUIET</p>
                        <p className="text-gray-500 mt-2 italic font-rajdhani tracking-tighter">BE THE FIRST TO SCHEDULE A LEGENDARY BATTLE</p>
                    </div>
                ) : (
                    matches.map(match => (
                        <div key={match.id} className="glass-panel p-6 flex flex-col md:flex-row items-center gap-10 hover:border-arena-accent/30 transition-all group overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-1.5 h-full arena-gradient" />
                            
                            <div className="flex flex-col items-center gap-1 min-w-[120px]">
                                <span className="text-3xl font-bold font-rajdhani">{new Date(match.match_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{new Date(match.match_time).toLocaleDateString()}</span>
                                <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider mt-2 
                                    ${match.status === 'live' ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-white/5 text-gray-500'}`}>
                                    {match.status}
                                </span>
                            </div>

                            <div className="flex-1 flex items-center justify-between gap-6 px-10 border-x border-white/5 overflow-hidden">
                                <div className="flex-1 flex items-center gap-3 justify-end">
                                    <span className="font-bold font-rajdhani tracking-tighter text-xl text-right truncate group-hover:text-arena-accent transition-colors">
                                        {match.team1?.name}
                                    </span>
                                    <div className="w-10 h-10 rounded-full glass-card flex items-center justify-center font-bold text-xs">A</div>
                                </div>

                                <div className="w-12 h-12 flex items-center justify-center font-bold font-rajdhani text-gray-700 text-xl italic group-hover:scale-110 transition-transform">VS</div>

                                <div className="flex-1 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full glass-card flex items-center justify-center font-bold text-xs bg-white/5">B</div>
                                    <span className="font-bold font-rajdhani tracking-tighter text-xl truncate group-hover:text-arena-accent transition-colors">
                                        {match.team2?.name}
                                    </span>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col gap-2 min-w-[150px]">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <MapPin className="w-4 h-4 text-arena-accent" />
                                    <span className="truncate">{match.venue?.name || 'Olympic Arena X'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Timer className="w-4 h-4 text-arena-accent" />
                                    <span>BO5 SERIES | DUAL BRACKET</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Link 
                                  to={match.status === 'live' ? `/match/${match.id}` : `/match/${match.id}`} 
                                  className={`p-3 rounded-full border border-white/10 hover:bg-arena-accent/10 hover:border-arena-accent/50 transition-all text-arena-accent group-hover:scale-110`}
                                >
                                    <Play className={`w-5 h-5 ${match.status === 'live' ? 'animate-pulse fill-current' : ''}`} />
                                </Link>
                                <button className="p-3 text-gray-600 hover:text-white transition-colors">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Schedules
