import React from 'react'
import { AlertTriangle, RefreshCcw } from 'lucide-react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ARENA X ERROR]', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6 text-white font-rajdhani">
          <div className="glass-panel p-10 max-w-md w-full border-red-500/20 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-3xl font-black mb-4 tracking-tighter">NEURAL LINK FAILURE</h2>
            <p className="text-gray-400 mb-8 leading-relaxed uppercase tracking-widest text-xs font-bold">
               A critical system override has occurred. The arena uplink is currently unstable.
            </p>
            <div className="p-4 bg-red-500/10 rounded-lg mb-8 border border-red-500/20 text-left">
               <p className="text-[10px] text-red-400 font-mono break-all">{this.state.error?.message || 'Unknown decryption error'}</p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="w-full btn-premium flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20"
            >
              <RefreshCcw className="w-5 h-5" />
              <span>REINITIALIZE LINK</span>
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
