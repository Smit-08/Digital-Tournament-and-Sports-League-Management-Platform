import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Gavel, Users, Timer, TrendingUp, History, Trophy, User } from 'lucide-react'
import { useAuction } from '../hooks/useAuction'
import { useAuth } from '../context/AuthContext'

const AuctionRoom = () => {
  const { id } = useParams()
  const { bids, currentBid, loading, placeBid } = useAuction(id)
  const { profile } = useAuth()
  const [bidAmount, setBidAmount] = useState('')

  const handleBid = async (e) => {
    e.preventDefault()
    if (!bidAmount || isNaN(bidAmount)) return
    
    const amount = parseFloat(bidAmount)
    if (currentBid && amount <= currentBid.bid_amount) {
        alert("Bid must be higher than current bid!")
        return
    }

    // In a real app, team_id would come from user's managed teams
    const { error } = await placeBid(1, 1, amount) // Dummy IDs for now
    if (error) console.error(error)
    else setBidAmount('')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Active Player Card */}
      <div className="lg:col-span-2 space-y-6">
        <div className="glass-panel p-8 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full arena-gradient" />
          
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-48 h-64 glass-card rounded-2xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 arena-gradient opacity-10" />
                <User className="w-24 h-24 text-arena-accent opacity-50" />
                <div className="absolute bottom-4 left-4 right-4 text-center">
                    <p className="text-xs font-bold font-rajdhani tracking-widest text-arena-accent">STAR ALL-ROUNDER</p>
                </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-5xl font-bold font-rajdhani mb-2 tracking-tight">V. KOHLI</h2>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-6">
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-gray-400">SR: 92.5</span>
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-gray-400">EXP: 8 YEARS</span>
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-gray-400">VERIFIED</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-4 rounded-xl">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Base Price</p>
                  <p className="text-2xl font-bold font-rajdhani">$2.50M</p>
                </div>
                <div className="glass-card p-4 rounded-xl border-arena-accent/30 bg-arena-accent/5">
                  <p className="text-[10px] text-arena-accent uppercase font-bold tracking-widest mb-1">Current Bid</p>
                  <p className="text-2xl font-bold font-rajdhani text-arena-accent">
                    ${currentBid ? (currentBid.bid_amount / 1000000).toFixed(2) : '2.50'}M
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bidding Controls */}
        <div className="glass-panel p-6">
          <form onSubmit={handleBid} className="flex gap-4">
            <div className="relative flex-1">
              <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-arena-accent" />
              <input 
                type="number" 
                placeholder="ENTER BID AMOUNT (IN MILLIONS)" 
                className="w-full bg-white/5 border border-white/10 rounded-lg py-4 pl-12 pr-4 focus:outline-none focus:border-arena-accent font-rajdhani text-lg"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-premium px-10 flex items-center gap-2 group">
              <Gavel className="w-5 h-5 group-hover:rotate-45 transition-transform" />
              <span className="font-bold">PLACE BID</span>
            </button>
          </form>
          <div className="flex gap-2 mt-4">
            {[0.1, 0.5, 1.0, 5.0].map(val => (
                <button 
                  key={val}
                  type="button"
                  onClick={() => setBidAmount(((currentBid?.bid_amount || 2500000) / 1000000 + val).toString())}
                  className="flex-1 py-2 glass-card rounded-lg text-xs font-bold text-gray-400 hover:text-white hover:border-white/20 transition-all"
                >
                    + ${val}M
                </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bid History & Stats */}
      <div className="space-y-6">
        <div className="glass-panel p-6 flex flex-col h-[600px]">
          <div className="flex items-center gap-2 mb-6 text-arena-accent">
            <History className="w-5 h-5" />
            <h3 className="font-bold font-rajdhani tracking-widest uppercase">Bid War Logs</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {bids.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                    <TrendingUp className="w-12 h-12 mb-2" />
                    <p className="font-rajdhani">WAITING FOR FIRST BID</p>
                </div>
            ) : (
                bids.map((bid, i) => (
                    <div key={bid.id} className={`p-4 rounded-xl border border-white/5 flex items-center justify-between animate-in slide-in-from-right duration-500
                        ${i === 0 ? 'bg-arena-accent/10 border-arena-accent/20' : 'bg-white/5'}`}>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full arena-gradient flex items-center justify-center text-[10px] font-bold">TC</div>
                            <div>
                                <p className="text-xs font-bold text-gray-300">TITAN STRIKERS</p>
                                <p className="text-[10px] text-gray-500">{new Date(bid.bid_time).toLocaleTimeString()}</p>
                            </div>
                        </div>
                        <p className="font-rajdhani font-bold text-arena-accent tracking-tighter">${(bid.bid_amount / 1000000).toFixed(2)}M</p>
                    </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuctionRoom
