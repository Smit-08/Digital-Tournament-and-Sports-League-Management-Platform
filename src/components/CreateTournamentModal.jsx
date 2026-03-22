import React, { useState } from 'react'
import { Save, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const CreateTournamentModal = ({ isOpen, onClose, onSuccess }) => {
  const { profile } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    sport: 'Cricket',
    format: 'round-robin',
    max_teams: 16,
    start_date: '',
    end_date: '',
    venue: '',
    players_per_team: 11
  })

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('tournaments')
        .insert([{
          ...formData,
          created_by: profile?.id,
          status: 'upcoming'
        }])
        .select()

      if (error) throw error

      onSuccess(data[0])
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-scaleIn shadow-2xl bg-[#0d0d14]">
        <div className="absolute inset-0 arena-gradient opacity-[0.02] pointer-events-none" />
        <div className="p-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0d0d14]/95 backdrop-blur-md z-10">
          <h3 className="text-2xl font-black font-rajdhani text-arena-accent uppercase italic">INITIALIZE CHAMPIONSHIP</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg font-rajdhani">
                    SYSTEM ERROR: {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Tournament Name</label>
                    <input 
                        required
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="input-field"
                        placeholder="e.g. VALORANT CHAMPIONS"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Sport / Game</label>
                    <select 
                        value={formData.sport}
                        onChange={e => setFormData({...formData, sport: e.target.value})}
                        className="input-field"
                    >
                        <option>Cricket</option>
                        <option>Football</option>
                        <option>Basketball</option>
                        <option>Esports</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Tournament Format</label>
                    <select 
                        value={formData.format}
                        onChange={e => setFormData({...formData, format: e.target.value})}
                        className="input-field"
                    >
                        <option value="round-robin">Round Robin</option>
                        <option value="knockout">Knockout</option>
                        <option value="leagues">League + Playoffs</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Max Teams</label>
                    <input 
                        type="number"
                        value={formData.max_teams}
                        onChange={e => setFormData({...formData, max_teams: parseInt(e.target.value)})}
                        className="input-field"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Start Date</label>
                    <input 
                        type="date"
                        value={formData.start_date}
                        onChange={e => setFormData({...formData, start_date: e.target.value})}
                        className="input-field"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">End Date</label>
                    <input 
                        type="date"
                        value={formData.end_date}
                        onChange={e => setFormData({...formData, end_date: e.target.value})}
                        className="input-field"
                    />
                </div>
                <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Venue / Location</label>
                    <input 
                        type="text"
                        value={formData.venue}
                        onChange={e => setFormData({...formData, venue: e.target.value})}
                        className="input-field"
                        placeholder="Stadium or Server Region"
                    />
                </div>
            </div>

            <div className="flex gap-4 pt-6">
                <button 
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-6 py-4 glass-panel border-white/10 hover:bg-white/5 font-bold uppercase tracking-widest transition-all"
                >
                    ABORT
                </button>
                <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-2 btn-premium flex items-center justify-center gap-3 disabled:opacity-50"
                >
                    {isSubmitting ? (
                         <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Save className="w-5 h-5" />
                    )}
                    <span>INITIALIZE DATA</span>
                </button>
            </div>
        </form>
      </div>
    </div>
  )
}

export default CreateTournamentModal
