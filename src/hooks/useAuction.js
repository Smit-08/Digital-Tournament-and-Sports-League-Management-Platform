import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export const useAuction = (auctionId) => {
  const [bids, setBids] = useState([])
  const [currentBid, setCurrentBid] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!auctionId) return

    // 1. Fetch initial bids
    const fetchBids = async () => {
      const { data, error } = await supabase
        .from('bids')
        .select('*')
        .eq('auction_id', auctionId)
        .order('bid_time', { ascending: false })
      
      if (data) {
        setBids(data)
        setCurrentBid(data[0] || null)
      }
      setLoading(false)
    }

    fetchBids()

    // 2. Real-time Subscription
    const channel = supabase
      .channel(`auction_${auctionId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'bids',
        filter: `auction_id=eq.${auctionId}`
      }, (payload) => {
        setBids(prev => [payload.new, ...prev])
        setCurrentBid(payload.new)
      })
      .subscribe()

    return () => channel.unsubscribe()
  }, [auctionId])

  const placeBid = async (player_id, team_id, amount) => {
    const { data, error } = await supabase
      .from('bids')
      .insert({
        auction_id: auctionId,
        player_id,
        team_id,
        bid_amount: amount
      })
    
    return { data, error }
  }

  return { bids, currentBid, loading, placeBid }
}
