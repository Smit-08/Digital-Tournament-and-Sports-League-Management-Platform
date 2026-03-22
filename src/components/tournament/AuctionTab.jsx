import React, { useState, useEffect } from 'react'
import { Gavel, Wallet, Users, Target, Activity, Shield, ArrowUpRight, TrendingUp } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const AuctionTab = ({ tournamentId }) => {
  const [auction, setAuction] = useState(null)
  const [bids, setBids] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAuction()
    const auctionChannel = supabase
      .channel('auction_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'auctions', filter: `tournament_id=eq.${tournamentId}` }, () => {
        fetchAuction()
      })
      .subscribe()

    return () => auctionChannel.unsubscribe()
  }, [tournamentId])

  const fetchAuction = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('auctions')
        .select('*')
        .eq('tournament_id', tournamentId)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      setAuction(data)
      if (data) fetchBids(data.id)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchBids = async (auctionId) => {
    const { data, error } = await supabase
      .from('bids')
      .select('*, player:players(user_id, age, sport, skill_rating, users(name)), team:teams(name, logo)')
      .eq('auction_id', auctionId)
      .order('bid_time', { ascending: false })
    
    if (data) setBids(data)
  }

  if (loading) return <div className="p-20 text-center animate-pulse text-gray-600 font-rajdhani text-xl tracking-widest uppercase italic">SYNCING WITH AUCTION NEURAL LINK...</div>

  if (!auction) return (
    <div className="glass-panel p-20 text-center border-dashed border-white/10 opacity-60">
        <Gavel className="w-16 h-16 text-gray-700 mx-auto mb-4 opacity-50" />
        <h4 className="text-xl font-bold font-rajdhani text-gray-500 uppercase">NO AUCTION SCHEDULED</h4>
        <p className="text-gray-600 mt-2 font-rajdhani text-sm uppercase tracking-widest italic">Recruitment phase for this championship is currently suspended.</p>
    </div>
  )

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Auction Status Banner */}
      <div className={`glass-panel p-8 flex items-center justify-between border-l-4 ${auction.status === 'live' ? 'border-l-red-500 bg-red-500/5' : 'border-l-arena-success bg-arena-success/5'}`}>
        <div className="flex items-center gap-6">
            <div className={`p-4 rounded-xl ${auction.status === 'live' ? 'bg-red-500/10 text-red-500 animate-pulse' : 'bg-arena-success/10 text-arena-success'} shadow-inner`}>
                <Gavel className="w-8 h-8" />
            </div>
            <div>
                <h3 className="text-2xl font-black font-rajdhani arena-text-gradient uppercase italic leading-none">{auction.status === 'live' ? 'DEPLOYMENT RECRUITMENT LIVE' : 'RECRUITMENT PHASE COMPLETE'}</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-1 italic">Auction Status: {auction.status}</p>
            </div>
        </div>
        <div className="text-right hidden md:block">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest tracking-widest mb-1 italic">TIME REMAINING</p>
            <p className="text-3xl font-black font-rajdhani text-white uppercase italic tracking-tighter">04:12:45</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity Column */}
          <div className="lg:col-span-2 space-y-6">
              <div className="glass-panel p-6 bg-white/[0.01]">
                  <h4 className="text-sm font-black text-gray-500 tracking-[0.5em] mb-6 uppercase flex items-center gap-2 italic">
                      <Activity className="w-4 h-4 text-red-500" />
                      Neural Bid Stream
                  </h4>
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                      {bids.map((bid, index) => (
                          <div key={bid.id} className={`glass-panel p-4 flex items-center justify-between border-white/5 hover:bg-white/5 transition-colors ${index === 0 ? 'border-arena-accent/30 shadow-[0_0_15px_rgba(0,212,255,0.05)]' : ''}`}>
                               <div className="flex items-center gap-4">
                                   <div className="w-10 h-10 rounded-lg bg-arena-accent/10 border border-arena-accent/20 flex items-center justify-center text-arena-accent">
                                       <Target className="w-5 h-5" />
                                   </div>
                                   <div>
                                       <h5 className="font-black text-sm text-gray-200 uppercase tracking-tight">{bid.player?.users?.name}</h5>
                                       <p className="text-[10px] text-gray-500 font-bold uppercase italic tracking-widest">UNIT: {bid.team?.name}</p>
                                   </div>
                               </div>
                               <div className="text-right">
                                   <div className="flex items-start gap-1 justify-end">
                                        <span className="text-sm font-bold text-arena-success font-inter mt-1 tracking-tighter italic">$</span>
                                        <span className="text-2xl font-black font-rajdhani text-white tracking-widest leading-none">{bid.bid_amount?.toLocaleString()}</span>
                                   </div>
                                   <p className="text-[9px] text-gray-600 font-bold uppercase italic tracking-widest mt-1">2.4m ago</p>
                               </div>
                          </div>
                      ))}
                      {bids.length === 0 && (
                          <div className="p-10 text-center font-rajdhani text-gray-600 tracking-widest uppercase text-sm italic">NO ENGAGEMENT DETECTED</div>
                      )}
                  </div>
              </div>
          </div>

          {/* Player Portfolio / Sidebar */}
          <div className="space-y-6">
              <div className="glass-panel p-6 space-y-6 bg-arena-accent/5 border-arena-accent/10">
                  <h4 className="text-xs font-black text-arena-accent tracking-[0.3em] uppercase italic">ACTIVE RECRUIT PROFILE</h4>
                  <div className="w-24 h-24 rounded-2xl bg-white/5 mx-auto border border-white/10 flex items-center justify-center p-4 shadow-inner">
                        <Users className="w-12 h-12 text-arena-accent opacity-50" />
                  </div>
                  <div className="text-center space-y-1">
                      <h4 className="text-xl font-black font-rajdhani text-white uppercase tracking-tighter italic italic">XENON_PULSE</h4>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest italic tracking-widest leading-none">Global Rank: #42</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                      <div className="glass-panel flex flex-col items-center justify-center p-3 bg-black/40 border-white/5">
                          <p className="text-[9px] text-gray-500 font-bold uppercase italic tracking-widest mb-1">SKILL RATING</p>
                          <p className="text-lg font-black font-rajdhani text-arena-accent tracking-tighter">9.2/10</p>
                      </div>
                      <div className="glass-panel flex flex-col items-center justify-center p-3 bg-black/40 border-white/5">
                          <p className="text-[9px] text-gray-500 font-bold uppercase italic tracking-widest mb-1">BOUNTY UNIT</p>
                          <p className="text-lg font-black font-rajdhani text-arena-success tracking-tighter">$4,2k</p>
                      </div>
                  </div>
                  <button className="w-full btn-premium py-4 flex items-center justify-center gap-2 group italic">
                        <TrendingUp className="w-4 h-4" />
                        <span>PLACE TACTICAL BID</span>
                  </button>
              </div>

              <div className="glass-panel p-6 bg-white/[0.02]">
                   <h4 className="text-[10px] font-black font-rajdhani text-gray-500 tracking-[0.4em] uppercase mb-4 italic italic">MARKET TRENDS</h4>
                   <div className="space-y-4">
                       <div className="flex items-center justify-between">
                           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic italic">AVERAGE RECRUIT COST</span>
                           <span className="text-sm font-black font-rajdhani text-white">$1,245</span>
                       </div>
                        <div className="flex items-center justify-between">
                           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic italic">HIGHEST BID TODAY</span>
                           <span className="text-sm font-black font-rajdhani text-arena-success">$12,800</span>
                       </div>
                   </div>
              </div>
          </div>
      </div>
    </div>
  )
}

export default AuctionTab
