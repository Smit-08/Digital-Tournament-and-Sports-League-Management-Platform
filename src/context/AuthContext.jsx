import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({
  user: null,
  profile: null,
  session: null,
  loading: true,
  signOut: () => Promise.resolve()
})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("AuthContext: Initializing...")
    
    // Safety valve: Unstick after 5 seconds no matter what
    const timer = setTimeout(() => {
      setLoading(curr => {
        if (curr) {
          console.warn("AuthContext: Safety timeout reached. Forcing loading to false.")
          return false
        }
        return curr
      })
    }, 5000)

    const initAuth = async () => {
      try {
        console.log("AuthContext: Fetching session...")
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error("AuthContext: Session error:", error)
          setLoading(false)
          return
        }

        console.log("AuthContext: Session fetched:", session ? "Authenticated" : "Not Authenticated")
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          console.log("AuthContext: Profile fetch initiated for", session.user.email)
          // UNBLOCK THE UI: Run this in the background
          fetchProfileByEmail(session.user.email)
        } else {
          setLoading(false)
        }
      } catch (err) {
        console.error("AuthContext: Initialization failure:", err)
        setLoading(false)
      }
    }

    initAuth()

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("AuthContext: Auth event:", _event)
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfileByEmail(session.user.email)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => {
      clearTimeout(timer)
      subscription.unsubscribe()
    }
  }, [])

  const fetchProfileByEmail = async (email) => {
    try {
      console.log("AuthContext: Executing supabase.from('users').select('*').eq('email', email).single()...")
      const queryPromise = supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()
      
      const { data, error } = await queryPromise
      console.log("AuthContext: Query finished. Data:", data, "Error:", error)
      
      if (error) {
        console.warn("AuthContext: Profile error:", error)
      }
      if (data) setProfile(data)
    } catch (error) {
      console.error('AuthContext: Profile fetch failure:', error)
    } finally {
      console.log("AuthContext: setting loading to false in finally block")
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    return await supabase.auth.signInWithPassword({ email, password })
  }

  const signUp = async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
            data: { display_name: name || email.split('@')[0] }
        }
    })
    
    // Fallback manual insert (may still be blocked by RLS if not authenticated yet)
    // The Database Trigger will handle this more reliably.
    if (data?.user && !error) {
        try {
            await supabase.from('users').insert([{ 
                email, 
                name: name || email.split('@')[0],
                role: 'spectator'
            }])
        } catch (e) {
            console.warn("Manual profile insert failed (likely RLS). Trigger will handle it.", e)
        }
    }
    return { data, error }
  }

  const signOut = async () => {
    try {
      console.log("AuthContext: Initiating logout...")
      // We wrap this in a try-finally because sometimes the Supabase 
      // auth-token lock can hang in local development (React 18 HMR).
      await supabase.auth.signOut()
    } catch (err) {
      console.error("AuthContext: Error during Supabase signOut:", err)
    } finally {
      // Always clear local state to unblock the UI
      setSession(null)
      setUser(null)
      setProfile(null)
      console.log("AuthContext: Local state cleared.")
    }
  }

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
