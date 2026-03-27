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
import Dashboard from './pages/Dashboard'
import AuctionSelection from './pages/AuctionSelection'
import GlobalHub from './pages/GlobalHub'
import RealtimeCenter from './pages/RealtimeCenter'
import { useAnalytics } from './hooks/useAnalytics'

function App() {
  const { loading, user } = useAuth()
  useAnalytics() // Initialize analytics tracking

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
        <Route path="/auctions" element={<AuctionSelection />} />
        <Route path="/auctions/:id" element={<AuctionRoom />} />
        <Route path="/match/:id" element={<LiveMatch />} />
        <Route path="/leaderboards" element={<Leaderboards />} />
        <Route path="/schedules" element={<Schedules />} />
        <Route path="/global-hub" element={<GlobalHub />} />
        <Route path="/realtime" element={<RealtimeCenter />} />
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
