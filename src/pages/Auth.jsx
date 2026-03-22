import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Trophy, Mail, Lock, User, ArrowRight, Loader2, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isLogin) {
        const { error } = await signIn(email, password)
        if (error) throw error
      } else {
        const { error } = await signUp(email, password, name)
        if (error) throw error
        alert("Account created! You can now sign in.")
        setIsLogin(true)
        setLoading(false)
        return
      }
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="glass-panel p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 arena-gradient" />
          
          <div className="text-center mb-10">
            <div className="w-16 h-16 arena-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(0,212,255,0.3)]">
                <Trophy className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-black font-rajdhani tracking-tighter uppercase mb-2">
                {isLogin ? 'RESUME COMMAND' : 'ENLIST NOW'}
            </h2>
            <p className="text-gray-500 text-sm font-rajdhani tracking-widest uppercase">
                {isLogin ? 'ENTER YOUR NEURAL LINK CREDENTIALS' : 'CREATE YOUR UNIVERSAL ARENA ID'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5" />
                <p className="text-xs text-red-400 font-bold uppercase tracking-tight">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Callsign (Name)</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-arena-accent" />
                  <input 
                    type="text" 
                    required 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-arena-accent font-rajdhani transition-all"
                    placeholder="E.G. STRIKER_01"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Neural Address (Email)</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-arena-accent" />
                <input 
                  type="email" 
                  required 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-arena-accent font-rajdhani transition-all"
                  placeholder="name@nexus.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Access Cipher (Password)</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-arena-accent" />
                <input 
                  type="password" 
                  required 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-arena-accent font-rajdhani transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-premium py-4 flex items-center justify-center gap-3 group disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                    <span className="font-black font-rajdhani tracking-widest uppercase">
                        {isLogin ? 'INITIALIZE LINK' : 'FINALIZE REGISTRATION'}
                    </span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-gray-500 text-xs mb-4 uppercase tracking-widest font-bold">
                {isLogin ? "DON'T HAVE AN ARENA ID?" : 'ALREADY VERIFIED?'}
            </p>
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-arena-accent font-black font-rajdhani tracking-tighter hover:text-white transition-colors uppercase text-sm"
            >
              {isLogin ? 'PROCEED TO ENLISTMENT' : 'RETURN TO COMMAND LINK'}
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 opacity-20 hover:opacity-100 transition-opacity">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Secured by Arena X Cryptography</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth
