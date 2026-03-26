import React from 'react'
import { useTheme } from '../context/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, Zap, Lightbulb, Layers, Crown, Check, 
  Settings, X, Palette
} from 'lucide-react'

const themeIcons = {
  'elit-pro': Shield,
  'cyber-arena': Zap,
  'stadium-night': Lightbulb,
  'minimal-glass': Layers,
  'legacy': Crown
}

const ThemeSelector = ({ isOpen, onClose }) => {
  const { activeTheme, setTheme, THEMES } = useTheme()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          
          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-screen w-full max-w-md bg-[var(--color-surface)] border-l border-[var(--color-border)] shadow-2xl z-[70] p-8 flex flex-col"
          >
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                        <Palette className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-black font-rajdhani tracking-tight text-[var(--color-text)]">STYLE ENGINE</h2>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors text-[var(--color-textMuted)]">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <p className="text-sm text-[var(--color-textMuted)] font-medium mb-8">
                Transform your mission control with 5 premium, high-fidelity visual architectures.
            </p>

            <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                {Object.entries(THEMES).map(([key, theme]) => {
                    const Icon = themeIcons[theme.id] || Shield
                    const isActive = activeTheme.id === theme.id

                    return (
                        <motion.button
                            key={theme.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setTheme(key)}
                            className={`w-full p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden group
                                ${isActive ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/40'}`}
                        >
                            {/* Preview Swatches */}
                            <div className="absolute top-0 right-0 flex gap-1 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors.primary }} />
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors.secondary }} />
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors.background }} />
                            </div>

                            <div className="flex items-center gap-4 relative z-10">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors
                                    ${isActive ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-border)] text-[var(--color-textMuted)] group-hover:text-[var(--color-primary)]'}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-[var(--color-text)]">{theme.name}</h4>
                                    <p className="text-[10px] text-[var(--color-textMuted)] font-semibold uppercase tracking-widest">
                                        Architecture Protocol 2.0
                                    </p>
                                </div>
                                {isActive && (
                                    <div className="w-6 h-6 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white">
                                        <Check className="w-4 h-4" />
                                    </div>
                                )}
                            </div>
                        </motion.button>
                    )
                })}
            </div>

            <div className="mt-auto pt-8 border-t border-[var(--color-border)] text-center">
                 <p className="text-[10px] font-black tracking-[0.3em] text-[var(--color-textMuted)] uppercase">Arena X Design System v4.0</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ThemeSelector
