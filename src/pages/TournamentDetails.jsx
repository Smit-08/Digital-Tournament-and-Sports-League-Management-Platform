import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Trophy, Calendar, MapPin, Users, Play, Gavel, Layout, Settings, ShieldCheck, ChevronLeft, Target } from 'lucide-react'

// Tab Components
import OverviewTab from '../components/tournament/OverviewTab'
import TeamsTab from '../components/tournament/TeamsTab'
import ScheduleTab from '../components/tournament/ScheduleTab'
import LiveTab from '../components/tournament/LiveTab'
import LeaderboardTab from '../components/tournament/LeaderboardTab'
import AuctionTab from '../components/tournament/AuctionTab'

const TournamentDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [tournament, setTournament] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Overview')
  const [isOrganizer, setIsOrganizer] = useState(false)

  const tabs = ['Overview', 'Teams', 'Schedule', 'Live', 'Leaderboard', 'Auction']

  useEffect(() => {
    fetchTournament()
  }, [id])

  useEffect(() => {
    if (tournament && profile) {
        setIsOrganizer(profile.id === tournament.created_by || profile.role === 'admin')
    }
  }, [tournament, profile])

  const fetchTournament = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setTournament(data)
    } catch (err) {
      console.error(err)
      // If error, redirect back to tournaments
      // navigate('/tournaments')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center font-rajdhani text-2xl tracking-[0.5em] text-arena-accent animate-pulse">
            PENETRATING TOURNAMENT NEURAL CORE...
        </div>
    )
  }

  if (!tournament) return <div>Tournament Not Found</div>

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Back Button */}
      <button 
          onClick={() => navigate('/tournaments')}
          className="flex items-center gap-2 text-gray-500 hover:text-arena-accent transition-colors font-bold uppercase tracking-widest text-[10px]"
      >
          <ChevronLeft className="w-4 h-4" />
          <span>RETURN TO ARENA LOBBY</span>
      </button>

      {/* Hero Section */}
      <div className="glass-panel p-10 relative overflow-hidden group">
          <div className="absolute inset-0 arena-gradient opacity-[0.03] group-hover:opacity-[0.05] transition-opacity" />
          <div className="relative z-10 flex flex-col lg:flex-row gap-10 items-center lg:items-end justify-between">
              <div className="space-y-6 text-center lg:text-left">
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] italic shadow-2xl ${
                          tournament.status === 'live' ? 'bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse' :
                          'bg-arena-accent/10 text-arena-accent border border-arena-accent/20'
                      }`}>
                          {tournament.status} OPERATION
                      </span>
                      <span className="text-gray-600 font-black font-rajdhani uppercase tracking-widest text-xs italic">
                           SERIAL NO: #{tournament.id.toString().padStart(4, '0')}
                      </span>
                  </div>

                  <h1 className="text-6xl font-black font-rajdhani arena-text-gradient uppercase tracking-tighter italic leading-none truncate-multiline">
                      {tournament.name}
                  </h1>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-[10px] font-black uppercase tracking-widest text-gray-500 font-rajdhani">
                      <div className="flex items-center gap-2">
                           <Target className="w-4 h-4 text-arena-accent" />
                           <span>SPORT: {tournament.sport}</span>
                      </div>
                      <div className="flex items-center gap-2">
                           <MapPin className="w-4 h-4 text-arena-secondary" />
                           <span>VENUE: {tournament.venue || 'TBD'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                           <Users className="w-4 h-4 text-arena-success" />
                           <span>ENLISTED: {tournament.max_teams} MAX</span>
                      </div>
                      <div className="flex items-center gap-2">
                           <Layout className="w-4 h-4 text-gray-400" />
                           <span>FORMAT: {tournament.format}</span>
                      </div>
                  </div>
              </div>

              {/* Action Sidebar */}
              <div className="flex flex-col gap-4 w-full lg:w-auto shrink-0">
                  <div className="flex gap-4">
                        {tournament.status === 'live' && (
                            <button className="flex-1 btn-premium px-8 flex items-center justify-center gap-2 group italic animate-pulse">
                                <Play className="w-5 h-5 fill-current" />
                                <span>WATCH LIVE FEED</span>
                            </button>
                        )}
                        <button className="flex-1 px-8 py-3 glass-panel hover:bg-white/10 transition-colors font-bold font-rajdhani flex items-center justify-center gap-2 uppercase tracking-widest">
                            <ShieldCheck className="w-5 h-5" />
                            <span>JOIN THE FORCE</span>
                        </button>
                  </div>
                  {isOrganizer && (
                        <button className="w-full py-4 glass-panel border-arena-accent/20 bg-arena-accent/5 hover:bg-arena-accent/10 transition-colors font-black font-rajdhani flex items-center justify-center gap-3 uppercase tracking-[0.3em] italic text-arena-accent">
                            <Settings className="w-5 h-5" />
                            <span>INITIALIZE COMMAND</span>
                        </button>
                  )}
              </div>
          </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto gap-4 p-1 glass-panel bg-white/[0.02] border-white/5 no-scrollbar scroll-smooth">
          {tabs.map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 text-[11px] font-black uppercase tracking-[0.4em] italic transition-all whitespace-nowrap rounded-lg ${
                    activeTab === tab 
                    ? 'arena-gradient text-white shadow-[0_0_20px_rgba(0,212,255,0.3)]' 
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
              >
                  {tab}
              </button>
          ))}
      </div>

      {/* Dynamic Tab Content */}
      <div className="min-h-[400px]">
          {activeTab === 'Overview' && <OverviewTab tournament={tournament} />}
          {activeTab === 'Teams' && <TeamsTab tournamentId={tournament.id} canJoin={!!user} />}
          {activeTab === 'Schedule' && <ScheduleTab tournamentId={tournament.id} />}
          {activeTab === 'Live' && <LiveTab tournamentId={tournament.id} />}
          {activeTab === 'Leaderboard' && <LeaderboardTab tournamentId={tournament.id} />}
          {activeTab === 'Auction' && <AuctionTab tournamentId={tournament.id} />}
      </div>

    </div>
  )
}

export default TournamentDetails
