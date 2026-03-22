import React, { useState, useEffect } from 'react'
import { User, Mail, Shield, Award, Edit3, Target, TrendingUp, Zap, History, Camera } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const Profile = () => {
    const { user, profile } = useAuth()
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPlayerStats = async () => {
            if (!profile?.id) return
            
            setLoading(true)
            const { data } = await supabase
                .from('player_statistics')
                .select('*')
                .eq('player_id', profile.id) // Assuming profile.id corresponds to user_id or linked player record
            
            if (data && data.length > 0) setStats(data[0])
            setLoading(false)
        }

        fetchPlayerStats()
    }, [profile])

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Profile Header Card */}
            <div className="glass-panel p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-arena-accent/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
                
                <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                    <div className="relative group">
                        <div className="w-40 h-40 rounded-2xl arena-gradient p-1 shadow-[0_0_30px_rgba(0,212,255,0.3)]">
                            <div className="w-full h-full bg-[#0a0a0f] rounded-2xl flex items-center justify-center overflow-hidden">
                                <User className="w-20 h-20 text-arena-accent opacity-30" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                    <Camera className="w-8 h-8 text-white" />
                                </div>
                            </div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-arena-accent text-black p-2 rounded-lg shadow-lg">
                            <Award className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-4">
                        <div className="flex items-center justify-center md:justify-start gap-4">
                            <h2 className="text-5xl font-black font-rajdhani tracking-tighter uppercase">{profile?.name || user?.user_metadata?.display_name || 'COMMENCING ID...'}</h2>
                            {profile?.role === 'admin' && (
                                <span className="bg-arena-accent/10 border border-arena-accent/30 text-arena-accent px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase">
                                    OVERSEER
                                </span>
                            )}
                        </div>
                        
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-gray-400 font-medium">
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-arena-accent" />
                                <span>{user?.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-arena-secondary" />
                                <span className="capitalize">{profile?.role || 'Spectator'} Participant</span>
                            </div>
                        </div>

                        <div className="pt-4 flex gap-4 justify-center md:justify-start">
                            <button className="btn-premium px-8 py-2.5 flex items-center gap-2 group">
                                <Edit3 className="w-4 h-4" />
                                <span>MODIFY PROTOCOL</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Combat Statistics */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-panel p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <Target className="w-6 h-6 text-arena-accent" />
                                <h3 className="text-xl font-bold font-rajdhani tracking-widest uppercase">Combat Effectiveness</h3>
                            </div>
                            <div className="px-3 py-1 bg-white/5 rounded text-[10px] font-bold text-gray-500 tracking-widest uppercase">Global Rank: #422</div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { label: 'Matches', value: stats?.matches_played || 12, icon: History, color: 'text-blue-400' },
                                { label: 'Total Score', value: stats?.runs || stats?.goals || 450, icon: TrendingUp, color: 'text-arena-accent' },
                                { label: 'Win Rate', value: '68%', icon: Zap, color: 'text-yellow-400' },
                                { label: 'Skill Rating', value: '4.8/5.0', icon: Award, color: 'text-arena-secondary' }
                            ].map((stat, idx) => (
                                <div key={idx} className="glass-card p-6 border-white/5 hover:border-white/10 transition-all text-center">
                                    <stat.icon className={`w-6 h-6 mx-auto mb-3 ${stat.color}`} />
                                    <p className="text-3xl font-black font-rajdhani">{stat.value}</p>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Progress Chart Placeholder */}
                    <div className="glass-panel p-8">
                        <h4 className="font-bold font-rajdhani tracking-widest uppercase mb-6 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-arena-accent" /> Performance Trajectory
                        </h4>
                        <div className="h-64 flex items-end gap-4 px-4 overflow-hidden">
                            {[40, 70, 45, 90, 65, 85, 55, 75, 95, 80].map((h, i) => (
                                <div 
                                    key={i} 
                                    className="flex-1 arena-gradient transition-all duration-1000 origin-bottom"
                                    style={{ height: `${h}%`, opacity: 0.2 + (h/100) }}
                                />
                            ))}
                        </div>
                        <div className="flex justify-between mt-4 px-2 text-[10px] font-bold text-gray-600 font-rajdhani tracking-widest">
                            <span>MAR 10</span>
                            <span>MAR 15</span>
                            <span>MAR 20</span>
                            <span>TODAY</span>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-8">
                    <div className="glass-panel p-6">
                        <h4 className="font-bold font-rajdhani tracking-widest mb-6 uppercase text-sm border-b border-white/5 pb-4">Specialization</h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Primary Sport</span>
                                <span className="text-sm font-rajdhani font-bold text-arena-accent">CRICKET</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Preferred Role</span>
                                <span className="text-sm font-rajdhani font-bold text-arena-secondary">ALL-ROUNDER</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Affiliation</span>
                                <span className="text-sm font-rajdhani font-bold">TITAN STRIKERS</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6">
                        <h4 className="font-bold font-rajdhani tracking-widest mb-6 uppercase text-sm border-b border-white/5 pb-4">Achievements</h4>
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center gap-4 group cursor-pointer">
                                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-arena-accent/20 transition-colors">
                                        <Award className="w-5 h-5 text-gray-500 group-hover:text-arena-accent transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold font-rajdhani tracking-wider">FIRST BLOOD</p>
                                        <p className="text-[10px] text-gray-600 uppercase">Won first championship</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
