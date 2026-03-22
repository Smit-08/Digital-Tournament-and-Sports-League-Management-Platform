import React from 'react'
import { Routes, Route, Navigate, Link } from 'react-router-dom'
import Layout from './components/Layout'
import { useAuth } from './context/AuthContext'
import { Swords, Gavel, Trophy, Play, BarChart } from 'lucide-react'

import Tournaments from './pages/Tournaments'
import AuctionRoom from './pages/AuctionRoom'
import LiveMatch from './pages/LiveMatch'
import Leaderboards from './pages/Leaderboards'
import Schedules from './pages/Schedules'
import Profile from './pages/Profile'
import Auth from './pages/Auth'
import Admin from './pages/Admin'
import TournamentDetails from './pages/TournamentDetails'

// Dashboard Preview Component (Agent 3)
const Dashboard = () => {
    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Hero Section */}
            <div className="glass-panel p-12 relative overflow-hidden group">
                <div className="absolute inset-0 arena-gradient opacity-[0.03] group-hover:opacity-[0.05] transition-opacity" />
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-6xl font-black font-rajdhani arena-text-gradient mb-4 uppercase tracking-tighter leading-none italic">
                        THE ARENA <br/>AWAKENS
                    </h2>
                    <p className="text-gray-400 text-lg leading-relaxed mb-8 border-l-2 border-arena-accent/30 pl-6 italic">
                        Join the next evolution of esport championships. Build teams, bid on star players, and dominate the global rankings in real-time.
                    </p>
                    <div className="flex gap-4">
                        <Link to="/tournaments" className="btn-premium px-8 flex items-center gap-2 group">
                            <Swords className="w-5 h-5" />
                            <span>JOIN THE BATTLE</span>
                        </Link>
                        <Link to="/auctions" className="px-8 py-3 glass-panel hover:bg-white/10 transition-colors font-bold font-rajdhani flex items-center gap-2 uppercase">
                            <Gavel className="w-5 h-5" />
                            <span>LIVE AUCTIONS</span>
                        </Link>
                    </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-10">
                    <Trophy className="w-64 h-64 text-arena-accent" />
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="glass-card p-8 group hover:scale-[1.02] transition-all cursor-pointer">
                    <div className="w-12 h-12 rounded-xl arena-gradient flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(0,212,255,0.3)]">
                        <Swords className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold font-rajdhani mb-2">LIVE TOURNAMENTS</h3>
                    <p className="text-gray-500 text-sm mb-6">4 active championships in progress.</p>
                    <div className="flex items-center gap-2 text-arena-accent text-xs font-bold font-rajdhani underline tracking-widest">
                        ENTER ARENA <Play className="w-3 h-3 fill-current" />
                    </div>
                </div>

                <div className="glass-card p-8 group hover:scale-[1.02] transition-all cursor-pointer">
                    <div className="w-12 h-12 rounded-xl bg-arena-secondary flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                        <Gavel className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold font-rajdhani mb-2">HOT AUCTIONS</h3>
                    <p className="text-gray-500 text-sm mb-6">Pro Player Pool open for bidding.</p>
                    <div className="flex items-center gap-2 text-arena-secondary text-xs font-bold font-rajdhani underline tracking-widest">
                        ENTER BID ROOM <Play className="w-3 h-3 fill-current" />
                    </div>
                </div>

                <div className="glass-card p-8 group hover:scale-[1.02] transition-all cursor-pointer">
                    <div className="w-12 h-12 rounded-xl bg-arena-success flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                        <BarChart className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold font-rajdhani mb-2">ELITE RANKINGS</h3>
                    <p className="text-gray-500 text-sm mb-6">Check your standing globally.</p>
                    <div className="flex items-center gap-2 text-arena-success text-xs font-bold font-rajdhani underline tracking-widest">
                        VIEW LEADERS <Play className="w-3 h-3 fill-current" />
                    </div>
                </div>
            </div>
        </div>
    )
}

function App() {
  const { loading, user } = useAuth()

  if (loading) {
    return (
      <div className="bg-[#0a0a0f] min-h-screen flex items-center justify-center font-rajdhani text-2xl tracking-[0.3em] text-arena-accent animate-pulse">
        CONNECTING TO ARENA X NEURAL LINK...
      </div>
    )
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tournaments" element={<Tournaments />} />
        <Route path="/tournament/:id" element={<TournamentDetails />} />
        <Route path="/auctions" element={<AuctionRoom />} />
        <Route path="/auctions/:id" element={<AuctionRoom />} />
        <Route path="/match/:id" element={<LiveMatch />} />
        <Route path="/leaderboards" element={<Leaderboards />} />
        <Route path="/schedules" element={<Schedules />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" replace />} />
        <Route path="/admin" element={user ? <Admin /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Auth />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Auth />} />
        {/* Placeholder for other routes */}
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </Layout>
  )
}

export default App
