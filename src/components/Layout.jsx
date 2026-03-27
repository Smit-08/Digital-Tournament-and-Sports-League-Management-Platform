import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Trophy, LayoutDashboard, User, LogOut, Swords, Calendar, BarChart, Settings, Gavel, Palette, Globe, Activity } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import ThemeSelector from './ThemeSelector'

const SidebarItem = ({ icon: Icon, label, path, active }) => (
  <Link 
    to={path} 
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group
      ${active ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)] shadow-[inset_0_0_10px_rgba(var(--color-primary-rgb),0.1)]' : 'text-[var(--color-textMuted)] hover:bg-white/5 hover:text-[var(--color-text)]'}`}
  >
    <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${active ? 'animate-pulse' : ''}`} />
    <span className="font-medium font-rajdhani tracking-wider text-sm">{label}</span>
  </Link>
)

const Layout = ({ children }) => {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isThemeOpen, setIsThemeOpen] = React.useState(false)

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-background)] text-[var(--color-text)] transition-colors duration-500">
      <ThemeSelector isOpen={isThemeOpen} onClose={() => setIsThemeOpen(false)} />
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-[var(--color-border)] bg-[var(--theme-sidebarBg)] flex flex-col fixed h-full z-50 transition-colors duration-500">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2 group">
            <Trophy className="w-8 h-8 text-[var(--color-primary)] group-hover:rotate-12 transition-transform" />
            <h1 className="text-2xl font-bold font-rajdhani arena-text-gradient">Arena X</h1>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" path="/dashboard" active={location.pathname === '/dashboard'} />
          <SidebarItem icon={Swords} label="Tournaments" path="/tournaments" active={location.pathname.startsWith('/tournaments')} />
          <SidebarItem icon={Gavel} label="Live Auction" path="/auctions" active={location.pathname.startsWith('/auctions')} />
          <SidebarItem icon={Calendar} label="Schedules" path="/schedules" active={location.pathname === '/schedules'} />
          <SidebarItem icon={BarChart} label="Leaderboards" path="/leaderboards" active={location.pathname === '/leaderboards'} />
          <SidebarItem icon={Globe} label="Global Hub" path="/global-hub" active={location.pathname === '/global-hub'} />
          <SidebarItem icon={Activity} label="Live Center" path="/realtime" active={location.pathname === '/realtime'} />
          
          {(profile?.role === 'admin' || profile?.role === 'organizer') && (
            <>
              <div className="pt-6 pb-2 px-4 uppercase text-[10px] font-bold text-[var(--color-textMuted)] tracking-[0.2em]">Management</div>
              <SidebarItem icon={Settings} label="Admin Panel" path="/admin" active={location.pathname === '/admin'} />
            </>
          )}

          <div className="pt-6 pb-2 px-4 uppercase text-[10px] font-bold text-[var(--color-textMuted)] tracking-[0.2em]">Personalize</div>
          <button 
            onClick={() => setIsThemeOpen(true)}
            className="flex items-center gap-3 px-4 py-3 w-full text-[var(--color-textMuted)] hover:bg-white/5 hover:text-[var(--color-text)] rounded-lg transition-all group"
          >
            <Palette className="w-5 h-5 group-hover:rotate-45 transition-transform" />
            <span className="font-medium font-rajdhani tracking-wider text-sm text-left">Style Engine</span>
          </button>
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
