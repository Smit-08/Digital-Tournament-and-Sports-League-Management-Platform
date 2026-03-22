import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export const useLiveMatch = (matchId) => {
  const [match, setMatch] = useState(null)
  const [scores, setScores] = useState([])
  const [commentary, setCommentary] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!matchId) return

    const fetchData = async () => {
      // 1. Fetch match details with team names
      const { data: matchData } = await supabase
        .from('matches')
        .select(`
          *,
          team1:teams!matches_team1_id_fkey(name, logo),
          team2:teams!matches_team2_id_fkey(name, logo),
          venue:venues(name)
        `)
        .eq('id', matchId)
        .single()
      
      setMatch(matchData)

      // 2. Fetch scores
      const { data: scoreData } = await supabase
        .from('scores')
        .select('*')
        .eq('match_id', matchId)
      
      setScores(scoreData || [])

      // 3. Fetch commentary
      const { data: commData } = await supabase
        .from('match_commentary')
        .select('*')
        .eq('match_id', matchId)
        .order('created_at', { ascending: false })
      
      setCommentary(commData || [])
      setLoading(false)
    }

    fetchData()

    // 4. Real-time Subscriptions
    const scoreChannel = supabase
      .channel(`match_${matchId}_scores`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'scores',
        filter: `match_id=eq.${matchId}`
      }, (payload) => {
        setScores(prev => {
            const idx = prev.findIndex(s => s.id === payload.new.id)
            if (idx > -1) {
                const updated = [...prev]
                updated[idx] = payload.new
                return updated
            }
            return [...prev, payload.new]
        })
      })
      .subscribe()

    const commChannel = supabase
      .channel(`match_${matchId}_commentary`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'match_commentary',
        filter: `match_id=eq.${matchId}`
      }, (payload) => {
        setCommentary(prev => [payload.new, ...prev])
      })
      .subscribe()

    return () => {
        scoreChannel.unsubscribe()
        commChannel.unsubscribe()
    }
  }, [matchId])

  return { match, scores, commentary, loading }
}
