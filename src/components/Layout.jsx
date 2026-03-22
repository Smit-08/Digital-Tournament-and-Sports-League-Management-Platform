import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Trophy, LayoutDashboard, User, LogOut, Swords, Calendar, BarChart, Settings, Gavel } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const SidebarItem = ({ icon: Icon, label, path, active }) => (
  <Link 
    to={path} 
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group
      ${active ? 'bg-arena-accent/20 text-arena-accent' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
  >
    <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${active ? 'animate-pulse' : ''}`} />
    <span className="font-medium font-rajdhani tracking-wider text-sm">{label}</span>
  </Link>
)

const Layout = ({ children }) => {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0f] text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#0d0d14] flex flex-col fixed h-full z-50">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2 group">
            <Trophy className="w-8 h-8 text-arena-accent group-hover:rotate-12 transition-transform" />
            <h1 className="text-2xl font-bold font-rajdhani arena-text-gradient">Arena X</h1>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" path="/dashboard" active={location.pathname === '/dashboard'} />
          <SidebarItem icon={Swords} label="Tournaments" path="/tournaments" active={location.pathname.startsWith('/tournaments')} />
          <SidebarItem icon={Gavel} label="Live Auction" path="/auctions" active={location.pathname.startsWith('/auctions')} />
          <SidebarItem icon={Calendar} label="Schedules" path="/schedules" active={location.pathname === '/schedules'} />
          <SidebarItem icon={BarChart} label="Leaderboards" path="/leaderboards" active={location.pathname === '/leaderboards'} />
          
          {(profile?.role === 'admin' || profile?.role === 'organizer') && (
            <>
              <div className="pt-6 pb-2 px-4 uppercase text-[10px] font-bold text-gray-500 tracking-[0.2em]">Management</div>
              <SidebarItem icon={Settings} label="Admin Panel" path="/admin" active={location.pathname === '/admin'} />
            </>
          )}
        </nav>

        <div className="p-4 border-t border-white/5">
          {user ? (
            <div className="space-y-3">
              <Link 
                to="/profile" 
                className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 rounded-full arena-gradient flex items-center justify-center text-xs font-bold uppercase">
                  {profile?.name?.charAt(0) || user?.user_metadata?.display_name?.charAt(0) || user?.email?.charAt(0) || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{profile?.name || user?.user_metadata?.display_name || 'User'}</p>
                  <p className="text-[10px] text-gray-400 capitalize">{profile?.role || 'Spectator'}</p>
                </div>
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2 w-full text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link 
              to="/login"
              className="btn-premium block text-center text-sm"
            >
              Sign In
            </Link>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen relative">
        {/* Top Glow Effect */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-arena-accent/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="p-8 relative z-10">
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout
