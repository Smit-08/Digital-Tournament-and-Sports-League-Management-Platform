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
      
      // Check if it's a global tournament
      if (id.startsWith('foot-') || id.startsWith('bask-') || id.startsWith('cricket-') || id.startsWith('esports-') || id.startsWith('ipl-')) {
        let globalData = null;
        const apiKey = import.meta.env.VITE_SPORTS_API_KEY;
        
        // Handle IP-2026 Injection
        if (id === 'ipl-2026-global') {
          globalData = {
            id: 'ipl-2026-global',
            name: 'IPL 2026 Season',
            sport: 'CRICKET',
            status: 'upcoming',
            isGlobal: true,
            max_teams: 10,
            format: 'League',
            venue: 'Multiple Venues (India)',
            created_by: 'system',
            logo: 'https://www.thesportsdb.com/images/media/league/logo/7v3v231557053538.png'
          };
        } else if (id.startsWith('cricket-')) {
          const leagueId = id.split('-')[1];
          const res = await fetch(`https://www.thesportsdb.com/api/v1/json/3/lookupleague.php?id=${leagueId}`);
          const data = await res.json();
          if (data.leagues && data.leagues[0]) {
            const l = data.leagues[0];
            globalData = {
              id, name: l.strLeague, sport: 'CRICKET', status: 'live',
              isGlobal: true, max_teams: 10, format: 'Tournament',
              venue: l.strCountry, created_by: 'system', logo: l.strLogo
            };
          }
        } else if (id.startsWith('foot-') || id.startsWith('bask-')) {
            if (!apiKey) throw new Error("API-SPORTS link required for global data.");
            const sportType = id.startsWith('foot-') ? 'football' : 'basketball';
            const leagueId = id.split('-')[1];
            const host = sportType === 'football' ? 'v3.football.api-sports.io' : 'v1.basketball.api-sports.io';
            const endpoint = `https://${host}/leagues?id=${leagueId}`;
            
            const res = await fetch(endpoint, {
                headers: { 'x-apisports-key': apiKey, 'x-rapidapi-host': host }
            });
            const data = await res.json();
            
            if (data.response && data.response[0]) {
                const item = data.response[0];
                const league = item.league || item;
                globalData = {
                    id, 
                    name: league.name, 
                    sport: sportType.toUpperCase(),
                    status: 'ongoing',
                    isGlobal: true, 
                    max_teams: 20, 
                    format: 'League',
                    venue: item.country?.name || 'Global', 
                    created_by: 'system', 
                    logo: league.logo || league.image
                };
            }
        } else if (id.startsWith('esports-')) {
          const pandaKey = import.meta.env.VITE_ESPORTS_API_KEY;
          const leagueId = id.split('-')[1];
          if (pandaKey) {
            const res = await fetch(`https://api.pandascore.co/leagues/${leagueId}`, {
                headers: { 'Authorization': `Bearer ${pandaKey}` }
            });
            const data = await res.json();
            globalData = {
              id, name: data.name, sport: 'ESPORTS', status: 'live',
              isGlobal: true, max_teams: 16, format: 'Championship',
              venue: 'Global Digital Arena', created_by: 'system', logo: data.image_url
            };
          }
        }

        if (globalData) {
          setTournament(globalData);
          return;
        }
      }

      // Default to Supabase for numeric IDs
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setTournament(data)
    } catch (err) {
      console.error("Fetch Match Failed:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center font-rajdhani text-2xl tracking-[0.5em] text-[var(--color-primary)] animate-pulse uppercase">
            PENETRATING TOURNAMENT NEURAL CORE...
        </div>
    )
  }

  if (!tournament) return <div className="p-20 text-center font-black text-[var(--color-danger)] uppercase tracking-widest">Tournament Not Found</div>

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Back Button */}
      <button 
          onClick={() => navigate('/tournaments')}
          className="flex items-center gap-2 text-[var(--color-textMuted)] hover:text-[var(--color-primary)] transition-colors font-black uppercase tracking-widest text-[10px]"
      >
          <ChevronLeft className="w-4 h-4" />
          <span>RETURN TO ARENA LOBBY</span>
      </button>

      {/* Hero Section */}
      <div className="glass-panel p-10 relative overflow-hidden group border border-[var(--color-border)]">
          <div className="absolute inset-0 arena-gradient opacity-[0.03] group-hover:opacity-[0.05] transition-opacity" />
          <div className="relative z-10 flex flex-col lg:flex-row gap-10 items-center lg:items-end justify-between">
              <div className="space-y-6 text-center lg:text-left">
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] italic shadow-2xl border ${
                          tournament.status === 'live' ? 'bg-[var(--color-danger)]/10 text-[var(--color-danger)] border-[var(--color-danger)]/20 animate-pulse' :
                          'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/20'
                      }`}>
                          {tournament.status} OPERATION
                      </span>
                      <span className="text-[var(--color-textMuted)] font-black font-rajdhani uppercase tracking-widest text-xs italic opacity-50">
                           SERIAL NO: #{tournament.id.toString().padStart(4, '0')}
                      </span>
                  </div>

                  <h1 className="text-6xl font-black font-rajdhani arena-text-gradient uppercase tracking-tighter italic leading-none truncate-multiline">
                      {tournament.name}
                  </h1>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-[10px] font-black uppercase tracking-widest text-[var(--color-textMuted)] font-rajdhani">
                      <div className="flex items-center gap-2">
                           <Target className="w-4 h-4 text-[var(--color-primary)]" />
                           <span>SPORT: {tournament.sport}</span>
                      </div>
                      <div className="flex items-center gap-2">
                           <MapPin className="w-4 h-4 text-[var(--color-secondary)]" />
                           <span>VENUE: {tournament.venue || 'TBD'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                           <Users className="w-4 h-4 text-[var(--color-success)]" />
                           <span>ENLISTED: {tournament.max_teams} MAX</span>
                      </div>
                      <div className="flex items-center gap-2">
                           <Layout className="w-4 h-4 text-[var(--color-textMuted)] opacity-60" />
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
                                <span className="font-black tracking-widest text-xs">WATCH LIVE FEED</span>
                            </button>
                        )}
                        <button className="flex-1 px-8 py-3 glass-panel hover:bg-black/5 transition-colors font-black font-rajdhani flex items-center justify-center gap-2 uppercase tracking-widest text-xs border border-[var(--color-border)] text-[var(--color-text)]">
                            <ShieldCheck className="w-5 h-5" />
                            <span>JOIN THE FORCE</span>
                        </button>
                  </div>
                  {isOrganizer && (
                        <button className="w-full py-4 glass-panel border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 hover:bg-[var(--color-primary)]/10 transition-colors font-black font-rajdhani flex items-center justify-center gap-3 uppercase tracking-[0.3em] italic text-[var(--color-primary)] border">
                            <Settings className="w-5 h-5" />
                            <span>INITIALIZE COMMAND</span>
                        </button>
                  )}
              </div>
          </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto gap-2 p-1 glass-panel bg-black/[0.02] border-[var(--color-border)] border no-scrollbar scroll-smooth rounded-xl">
          {tabs.map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.4em] italic transition-all whitespace-nowrap rounded-lg border border-transparent ${
                    activeTab === tab 
                    ? 'bg-[var(--color-primary)] text-white shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.3)] border-[var(--color-primary)]/50' 
                    : 'text-[var(--color-textMuted)] hover:text-[var(--color-text)] hover:bg-black/5'
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
