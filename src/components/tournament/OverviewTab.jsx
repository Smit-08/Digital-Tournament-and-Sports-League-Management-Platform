import React from 'react'
import { Trophy, Calendar, MapPin, Users, HelpCircle, ShieldCheck } from 'lucide-react'

const OverviewTab = ({ tournament }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
      {/* Left Column: Info & Rules */}
      <div className="lg:col-span-2 space-y-8">
        <div className="glass-panel p-8">
          <h3 className="text-2xl font-black font-rajdhani mb-6 arena-text-gradient">OPERATIONAL OBJECTIVES</h3>
          <p className="text-gray-400 leading-relaxed font-rajdhani whitespace-pre-line">
            {tournament.description || "The Grand Arena awaits. Compete for ultimate glory in this elite-level competition."}
          </p>
        </div>

        <div className="glass-panel p-8">
          <h3 className="text-2xl font-black font-rajdhani mb-6 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-arena-accent" />
            CHAMPIONSHIP PROTOCOLS
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-arena-accent mt-2 shrink-0" />
                    <p className="text-gray-400 text-sm">Teams: <span className="text-white font-bold">{tournament.max_teams} MAX DEPLETED</span></p>
                </div>
                <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-arena-accent mt-2 shrink-0" />
                    <p className="text-gray-400 text-sm">Format: <span className="text-white font-bold uppercase">{tournament.format}</span></p>
                </div>
                <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-arena-accent mt-2 shrink-0" />
                    <p className="text-gray-400 text-sm">Tie-Break: <span className="text-white font-bold uppercase">{tournament.tie_break_rule || "N/A"}</span></p>
                </div>
            </div>
            <div className="space-y-4">
                 <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-arena-accent mt-2 shrink-0" />
                    <p className="text-gray-400 text-sm">Players per Team: <span className="text-white font-bold">{tournament.players_per_team}</span></p>
                </div>
                <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-arena-accent mt-2 shrink-0" />
                    <p className="text-gray-400 text-sm">Match Points: <span className="text-white font-bold">{tournament.win_points}W / {tournament.draw_points}D / {tournament.loss_points}L</span></p>
                </div>
                <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-arena-accent mt-2 shrink-0" />
                    <p className="text-gray-400 text-sm">Verification: <span className="text-white font-bold">REQUIRED</span></p>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Prize & Important Deadlines */}
      <div className="space-y-8">
        <div className="glass-panel p-8 border-l-4 border-arena-success">
          <h4 className="text-xs font-black text-gray-500 tracking-[0.3em] mb-2 uppercase">TOTAL BOUNTY POOL</h4>
          <div className="flex items-end gap-3 mb-6">
            <span className="text-5xl font-black font-rajdhani text-white">$25,000</span>
            <span className="text-arena-success font-bold font-rajdhani text-lg mb-1 tracking-widest">+BONUS</span>
          </div>
          <div className="space-y-4 pt-4 border-t border-white/5">
            <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-bold uppercase">冠军 CHAMPION</span>
                <span className="text-arena-success font-bold font-rajdhani">$15,000</span>
            </div>
            <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-bold uppercase">亚军 RUNNER-UP</span>
                <span className="text-white font-bold font-rajdhani">$7,000</span>
            </div>
            <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-bold uppercase">季军 3RD PLACE</span>
                <span className="text-white font-bold font-rajdhani">$3,000</span>
            </div>
          </div>
        </div>

        <div className="glass-panel p-8 space-y-6">
            <h4 className="text-sm font-black text-gray-400 tracking-widest uppercase flex items-center gap-2">
                <Calendar className="w-4 h-4 text-arena-accent" />
                NEURAL MILESTONES
            </h4>
            <div className="space-y-6">
                <div className="relative pl-6 border-l border-white/10">
                    <div className="absolute top-0 -left-1.5 w-3 h-3 rounded-full bg-arena-accent shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">REGISTRATION CLOSE</p>
                    <p className="text-white font-bold font-rajdhani text-lg uppercase">{tournament.start_date || "UNDEFINED"}</p>
                </div>
                <div className="relative pl-6 border-l border-white/10 opacity-50">
                    <div className="absolute top-0 -left-1.5 w-3 h-3 rounded-full bg-gray-600" />
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">MAIN EVENT BEGIN</p>
                    <p className="text-white font-bold font-rajdhani text-lg uppercase">{tournament.start_date || "TBD"}</p>
                </div>
            </div>
        </div>

        <div className="glass-panel p-6 bg-arena-accent/5 border-arena-accent/20 flex items-center gap-4 group cursor-pointer hover:bg-arena-accent/10 transition-colors">
            <ShieldCheck className="w-10 h-10 text-arena-accent opacity-50 group-hover:opacity-100 transition-opacity" />
            <div>
                <p className="text-[10px] font-black tracking-widest uppercase text-arena-accent">ELIGIBILITY VERIFIED</p>
                <p className="text-xs text-gray-400">All players must pass neural-scan verification before enlistment.</p>
            </div>
        </div>
      </div>
    </div>
  )
}

export default OverviewTab
