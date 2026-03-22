import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export const useTournaments = () => {
  const [tournaments, setTournaments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTournaments = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setTournaments(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTournaments()

    // Real-time updates
    const channel = supabase
      .channel('tournaments_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tournaments' }, () => {
        fetchTournaments()
      })
      .subscribe()

    return () => channel.unsubscribe()
  }, [])

  return { tournaments, loading, error, refresh: fetchTournaments }
}
