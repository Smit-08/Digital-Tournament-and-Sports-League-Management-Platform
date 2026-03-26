import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Swords, Gavel, Trophy, Play, BarChart, TrendingUp, Users, Activity, Zap, Globe } from 'lucide-react'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts'
import { motion } from 'framer-motion'

// Mock Data for the chart
const generateData = () => {
  const data = []
  for (let i = 0; i < 7; i++) {
    data.push({
      name: `Day ${i + 1}`,
      visits: Math.floor(Math.random() * 500) + 200,
      bids: Math.floor(Math.random() * 100) + 20,
    })
  }
  return data
}

const Dashboard = () => {
    const [chartData, setChartData] = useState(generateData())
    const [liveUsers, setLiveUsers] = useState(1284)
    const [loading, setLoading] = useState(true)
    const [tokenPrice, setTokenPrice] = useState(1.42)

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => setLoading(false), 800)
        
        // Fetch real-time token price (using CoinGecko as a placeholder for Arena Token)
        const fetchPrice = async () => {
            try {
                const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
                const data = await res.json()
                // Use ETH price scale but divided for "Arena Token" feel
                setTokenPrice((data.ethereum.usd / 2000).toFixed(2))
            } catch (e) {
                console.error("Token price feed offline")
            }
        }
        fetchPrice()

        // Simulate real-time updates
        const interval = setInterval(() => {
            setLiveUsers(prev => prev + Math.floor(Math.random() * 5) - 2)
            setChartData(prev => {
                const newData = [...prev.slice(1)]
                newData.push({
                    name: `Day ${prev.length + 1}`,
                    visits: Math.floor(Math.random() * 500) + 200,
                    bids: Math.floor(Math.random() * 100) + 20,
                })
                return newData
            })
        }, 5000)

        return () => {
            clearTimeout(timer)
            clearInterval(interval)
        }
    }, [])

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[var(--color-primary)]/20 border-t-[var(--color-primary)] rounded-full animate-spin" />
                    <p className="font-rajdhani text-[var(--color-textMuted)] animate-pulse tracking-widest uppercase">SYNCHRONIZING ANALYTICS...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-10">
            {/* Hero Section */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-12 relative overflow-hidden group border-l-4 border-l-[var(--color-primary)] shadow-2xl"
            >
                <div className="absolute inset-0 bg-[var(--color-primary)] opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-500" />
                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[10px] font-bold tracking-[0.2em] mb-6 border border-[var(--color-primary)]/20">
                        <Zap className="w-3 h-3 fill-current" />
                        SYSTEMS STABLE • SEASON 04 ACTIVE
                    </div>
                    <h2 className="text-6xl font-black font-rajdhani arena-text-gradient mb-4 uppercase tracking-tighter leading-none italic">
                        THE ARENA <br/>AWAKENS
                    </h2>
                    <p className="text-[var(--color-textMuted)] text-lg leading-relaxed mb-8 border-l-2 border-[var(--color-primary)]/30 pl-6 italic max-w-lg">
                        Dive into the high-stakes world of elite esports. Manage teams, engage in real-time bidding, and track live tournament metrics globally.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link to="/tournaments" className="btn-premium px-10 py-4 flex items-center gap-3 group">
                            <Swords className="w-5 h-5" />
                            <span className="tracking-widest font-bold">JOIN THE BATTLE</span>
                        </Link>
                        <Link to="/auctions" className="px-10 py-4 glass-panel hover:bg-black/5 transition-all font-bold font-rajdhani flex items-center gap-3 uppercase group border-[var(--color-border)] hover:border-[var(--color-primary)]">
                            <Gavel className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            <span>LIVE AUCTIONS</span>
                        </Link>
                    </div>
                </div>
                
                {/* Decorative Background Elements */}
                <div className="absolute right-0 bottom-0 top-0 w-1/3 pointer-events-none overflow-hidden opacity-20">
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--color-primary)] blur-[100px] rounded-full" />
                </div>
                <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Trophy className="w-72 h-72 text-[var(--color-primary)] rotate-12" />
                </div>
            </motion.div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Live Spectators', value: liveUsers.toLocaleString(), icon: Users, color: 'primary', trend: '+12%' },
                    { label: 'Arena Token ($ART)', value: `$${tokenPrice}`, icon: Zap, color: 'secondary', trend: '+4.2%' },
                    { label: 'Active Prize Pool', value: '$25,480', icon: Trophy, color: 'success', trend: 'UP' },
                    { label: 'Global Servers', value: '14/14', icon: Globe, color: 'primary', trend: 'OPTIMAL' }
                ].map((stat, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-6 flex items-center gap-5 group"
                    >
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-primary)] group-hover:scale-110 transition-all duration-300 shadow-sm" style={{ color: `var(--color-${stat.color})` }}>
                            <stat.icon className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-[var(--color-textMuted)] tracking-widest mb-1">{stat.label}</p>
                            <div className="flex items-center gap-2">
                                <h4 className="text-2xl font-black font-rajdhani tracking-tight text-[var(--color-text)]">{stat.value}</h4>
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[var(--color-border)]" style={{ color: `var(--color-${stat.color})` }}>
                                    {stat.trend}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Dashboard Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Analytics Chart */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="xl:col-span-2 glass-panel p-8"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black font-rajdhani tracking-tighter flex items-center gap-2 text-[var(--color-text)]">
                                <TrendingUp className="w-5 h-5 text-[var(--color-primary)]" />
                                ENGAGEMENT NEURAL BRIDGE
                            </h3>
                            <p className="text-xs text-[var(--color-textMuted)] font-bold uppercase tracking-widest mt-1">Real-time engagement & bidding metrics</p>
                        </div>
                        <div className="flex gap-2 items-center">
                             <div className="w-3 h-3 rounded-full bg-[var(--color-primary)] shadow-[0_0_10px_var(--color-primary)]" />
                             <span className="text-[10px] font-bold text-[var(--color-textMuted)] uppercase tracking-widest">Node Traffic</span>
                        </div>
                    </div>

                    <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} opacity={0.5} />
                                <XAxis dataKey="name" stroke="var(--color-textMuted)" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--color-textMuted)" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', boxShadow: 'var(--theme-shadow)' }}
                                    itemStyle={{ color: 'var(--color-primary)', fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="visits" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Sidebar Widget (Live Status) */}
                <div className="space-y-6">
                    <div className="glass-panel p-6 border-t-2 border-t-[var(--color-secondary)]">
                        <h3 className="text-lg font-black font-rajdhani tracking-tight mb-6 flex items-center gap-2 text-[var(--color-text)]">
                            <Activity className="w-5 h-5 text-[var(--color-secondary)]" />
                            NETWORK FEED
                        </h3>
                        <div className="space-y-5">
                            {[
                                { user: 'X_Ghost', action: 'placed a $4,200 bid', time: '2m ago' },
                                { user: 'Titan_Admin', action: 'started Tournament #42', time: '5m ago' },
                                { user: 'Nebula', action: 'updated team roster', time: '12m ago' },
                                { user: 'Viper_SQ', action: 'achieved Rank #5', time: '15m ago' }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 items-start group">
                                    <div className="w-2 h-2 rounded-full bg-[var(--color-secondary)] mt-1.5 group-hover:scale-150 transition-transform" />
                                    <div>
                                        <p className="text-xs text-[var(--color-text)]">
                                            <span className="font-bold text-[var(--color-secondary)]">{item.user}</span>
                                            <span className="text-[var(--color-textMuted)]"> {item.action}</span>
                                        </p>
                                        <p className="text-[10px] text-[var(--color-textMuted)] font-bold uppercase mt-1">{item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-2 rounded border border-[var(--color-border)] hover:bg-black/5 transition-colors text-[10px] font-bold tracking-[0.3em] text-[var(--color-textMuted)] uppercase">
                            VIEW FULL LOGS
                        </button>
                    </div>

                    <div className="glass-panel p-6 overflow-hidden relative group">
                        <div className="absolute inset-0 bg-[var(--color-primary)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <h3 className="text-lg font-black font-rajdhani tracking-tight mb-4 flex items-center gap-2 text-[var(--color-text)]">
                            <Zap className="w-5 h-5 text-[var(--color-primary)]" />
                            ARENA NEWS
                        </h3>
                        <div className="p-4 bg-[var(--color-background)] rounded-lg border border-[var(--color-border)] italic text-sm text-[var(--color-textMuted)] border-dashed">
                            "Season 05 recruitment begins next week. Star players from the APAC region are already queuing for the draft room."
                        </div>
                        <Link to="/tournaments" className="mt-4 flex items-center justify-between text-[var(--color-primary)] group-hover:translate-x-1 transition-transform">
                            <span className="text-[10px] font-bold tracking-widest">ENTER NEWS TERMINAL</span>
                            <Play className="w-3 h-3 fill-current" />
                        </Link>
                    </div>
                </div>
            </div>
            
            {/* Featured Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { title: 'LIVE TOURNAMENTS', desc: '4 active championships in progress.', icon: Swords, color: 'primary', action: 'ENTER ARENA' },
                    { title: 'HOT AUCTIONS', desc: 'Pro Player Pool open for bidding.', icon: Gavel, color: 'secondary', action: 'ENTER BID ROOM' },
                    { title: 'ELITE RANKINGS', desc: 'Check your standing globally.', icon: BarChart, color: 'success', action: 'VIEW LEADERS' }
                ].map((item, i) => (
                    <motion.div 
                        key={i}
                        whileHover={{ scale: 1.02 }}
                        className="glass-card p-8 group cursor-pointer border-t-2"
                        style={{ borderTopColor: `var(--color-${item.color})` }}
                    >
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-lg transition-transform group-hover:rotate-12" style={{ backgroundColor: `var(--color-${item.color})`, shadowColor: `var(--color-${item.color}-rgb)` }}>
                            <item.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold font-rajdhani mb-2 text-[var(--color-text)]">{item.title}</h3>
                        <p className="text-[var(--color-textMuted)] text-sm mb-6">{item.desc}</p>
                        <div className="flex items-center gap-2 text-xs font-bold font-rajdhani underline tracking-widest decoration-dotted underline-offset-4" style={{ color: `var(--color-${item.color})` }}>
                            {item.action} <Play className="w-3 h-3 fill-current" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default Dashboard
