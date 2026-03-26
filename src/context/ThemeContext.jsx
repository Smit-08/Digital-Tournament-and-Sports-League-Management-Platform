import React, { createContext, useContext, useState, useEffect } from 'react'
import { THEMES } from '../lib/themes'

const ThemeContext = createContext()

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider = ({ children }) => {
  const [activeTheme, setActiveTheme] = useState(() => {
    const saved = localStorage.getItem('arena_x_theme')
    return THEMES[saved] || THEMES.ELITE_PRO
  })

  useEffect(() => {
    const root = document.documentElement
    const theme = activeTheme

    // Map theme colors to CSS variables
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value)
    })

    // Map theme styles to CSS variables
    Object.entries(theme.styles).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value)
    })

    // Special derived variables
    root.style.setProperty('--card-shadow', theme.styles.shadow)
    root.style.setProperty('--card-radius', theme.styles.radius)
    root.style.setProperty('--backdrop-blur', theme.styles.glass)
    root.style.setProperty('--sidebar-bg', theme.styles.sidebarBg)
    root.style.setProperty('--nav-bg', theme.styles.navBg)

    localStorage.setItem('arena_x_theme', Object.keys(THEMES).find(k => THEMES[k].id === theme.id))
    
    // Add data attribute for theme-specific CSS targeting if needed
    document.body.setAttribute('data-theme', theme.id)
  }, [activeTheme])

  const setTheme = (themeKey) => {
    if (THEMES[themeKey]) setActiveTheme(THEMES[themeKey])
  }

  return (
    <ThemeContext.Provider value={{ activeTheme, setTheme, THEMES }}>
      {children}
    </ThemeContext.Provider>
  )
}
