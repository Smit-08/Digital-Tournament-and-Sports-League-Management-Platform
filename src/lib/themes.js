export const THEMES = {
  ELITE_PRO: {
    id: 'elite-pro',
    name: 'Elite Sports Pro',
    icon: 'Shield',
    colors: {
      primary: '#1e3a8a', // Deep Navy
      secondary: '#b45309', // Amber/Gold
      accent: '#1e40af',
      background: '#f8fafc',
      surface: '#ffffff',
      text: '#0f172a',
      textMuted: '#64748b',
      border: '#e2e8f0',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444'
    },
    styles: {
        radius: '0.5rem',
        glass: 'none',
        shadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        cardBg: '#ffffff',
        sidebarBg: '#1e293b',
        sidebarText: '#f8fafc',
        navBg: 'rgba(255, 255, 255, 0.8)',
        buttonBg: '#1e3a8a',
        buttonText: '#ffffff'
    }
  },
  CYBER_ARENA: {
    id: 'cyber-arena',
    name: 'Cyber Arena',
    icon: 'Zap',
    colors: {
      primary: '#00d4ff', // Cyan Neon
      secondary: '#8b5cf6', // Violet
      accent: '#00ffcc',
      background: '#0a0a0f',
      surface: '#12121e',
      text: '#f8fafc',
      textMuted: '#94a3b8',
      border: 'rgba(255, 255, 255, 0.1)',
      success: '#10b981',
      warning: '#fbbf24',
      danger: '#f43f5e'
    },
    styles: {
        radius: '0px',
        glass: 'blur(12px) saturate(180%)',
        shadow: '0 0 20px rgba(0, 212, 255, 0.1)',
        cardBg: 'rgba(18, 18, 30, 0.7)',
        sidebarBg: '#050508',
        sidebarText: '#00d4ff',
        navBg: 'rgba(10, 10, 15, 0.8)',
        buttonBg: 'linear-gradient(90deg, #00d4ff, #8b5cf6)',
        buttonText: '#ffffff'
    }
  },
  STADIUM_NIGHT: {
    id: 'stadium-night',
    name: 'Stadium Night',
    icon: 'Lightbulb',
    colors: {
      primary: '#10b981', // Stadium Green
      secondary: '#ffffff',
      accent: '#34d399',
      background: '#030712', // Near black
      surface: '#111827', // Gray 900
      text: '#f9fafb',
      textMuted: '#9ca3af',
      border: 'rgba(255, 255, 255, 0.05)',
      success: '#10b981',
      warning: '#fbbf24',
      danger: '#ef4444'
    },
    styles: {
        radius: '1rem',
        glass: 'none',
        shadow: 'inset 0 0 100px rgba(16, 185, 129, 0.05)',
        cardBg: '#1f2937',
        sidebarBg: '#111827',
        sidebarText: '#ffffff',
        navBg: 'rgba(3, 7, 18, 0.9)',
        buttonBg: '#10b981',
        buttonText: '#ffffff'
    }
  },
  MINIMAL_GLASS: {
    id: 'minimal-glass',
    name: 'Minimal Glass',
    icon: 'Layers',
    colors: {
      primary: '#6366f1', // Indigo
      secondary: '#ec4899', // Pink
      accent: '#818cf8',
      background: '#f0f2f5',
      surface: 'rgba(255, 255, 255, 0.6)',
      text: '#1e293b',
      textMuted: '#64748b',
      border: 'rgba(255, 255, 255, 0.3)',
      success: '#22c55e',
      warning: '#eab308',
      danger: '#ef4444'
    },
    styles: {
        radius: '1.5rem',
        glass: 'blur(20px) saturate(150%)',
        shadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        cardBg: 'rgba(255, 255, 255, 0.6)',
        sidebarBg: 'rgba(255, 255, 255, 0.8)',
        sidebarText: '#1e293b',
        navBg: 'rgba(240, 242, 245, 0.8)',
        buttonBg: 'rgba(99, 102, 241, 0.8)',
        buttonText: '#ffffff'
    }
  },
  CHAMPIONSHIP_LEGACY: {
    id: 'legacy',
    name: 'Championship Legacy',
    icon: 'Crown',
    colors: {
      primary: '#7c2d12', // Deep Maroon/Rust
      secondary: '#fbbf24', // Gold
      accent: '#f59e0b',
      background: '#1c1917', // Stone 900
      surface: '#292524', // Stone 800
      text: '#fafaf9',
      textMuted: '#a8a29e',
      border: 'rgba(251, 191, 36, 0.1)',
      success: '#10b981',
      warning: '#d97706',
      danger: '#991b1b'
    },
    styles: {
        radius: '0.25rem',
        glass: 'none',
        shadow: '0 0 15px rgba(251, 191, 36, 0.05)',
        cardBg: '#292524',
        sidebarBg: '#1c1917',
        sidebarText: '#fbbf24',
        navBg: '#1c1917',
        buttonBg: '#7c2d12',
        buttonText: '#fbbf24'
    }
  }
}
