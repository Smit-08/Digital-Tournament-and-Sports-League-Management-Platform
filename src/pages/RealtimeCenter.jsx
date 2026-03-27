import React, { useState, useEffect } from 'react';
import { Activity, Globe, Gavel, Radio, Shield, Zap, Terminal, BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import GlobalSportsPulse from '../components/GlobalSportsPulse';

const RealtimeCenter = () => {
  const [localTournaments, setLocalTournaments] = useState([]);
  const [activeAuctions, setActiveAuctions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [telemetry, setTelemetry] = useState({
    latency: '16ms',
    uptime: '99.99%',
    nodes: 14,
    throughput: '42.8 MB/s'
  });

  useEffect(() => {
    fetchInitialData();
    
    // Supabase Real-time Subscriptions
    const tournamentChannel = supabase
      .channel('realtime_tournaments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tournaments' }, () => {
        fetchInitialData();
      })
      .subscribe();

    const bidsChannel = supabase
      .channel('realtime_bids')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bids' }, (payload) => {
        setTransactions(prev => [payload.new, ...prev].slice(0, 10));
      })
      .subscribe();

    return () => {
      tournamentChannel.unsubscribe();
      bidsChannel.unsubscribe();
    };
  }, []);

  const fetchInitialData = async () => {
    // Fetch local tournaments
    const { data: tournaments } = await supabase
      .from('tournaments')
      .select('*')
      .eq('status', 'ongoing')
      .limit(5);
    setLocalTournaments(tournaments || []);

    // Fetch active auctions (mocked for demo if no real link)
    setPlaceholderAuctions();
  };

  const setPlaceholderAuctions = () => {
    setActiveAuctions([
      { id: 1, name: 'ULTRA LEAGUE ALPHA', bids: 24, highest: 14500, status: 'LIVE' },
      { id: 2, name: 'ESPORTS DRAGON CUP', bids: 12, highest: 8900, status: 'LIVE' }
    ]);
    
    setTransactions([
      { id: 101, user: 'CYBER_PUNK', amount: 450, time: '2s ago', item: 'League Token' },
      { id: 102, user: 'NEON_KNIGHT', amount: 1200, time: '5s ago', item: 'Player #042' },
      { id: 103, user: 'SATELLITE_A1', amount: 800, time: '12s ago', item: 'Venue Entry' }
    ]);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 font-rajdhani">
      {/* HUD Header */}
      <div className="glass-panel p-10 relative overflow-hidden group border border-[var(--color-border)]">
        <div className="absolute inset-0 arena-gradient opacity-[0.03] pointer-events-none" />
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-[var(--color-primary)]/5 blur-[100px] rounded-full" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-[10px] font-black border border-red-500/20 animate-pulse">
                <Radio className="w-3 h-3" />
                LIVE SATELLITE LINK
              </span>
              <span className="px-3 py-1 bg-black/40 text-[var(--color-textMuted)] rounded-full text-[10px] font-black border border-white/5 uppercase tracking-widest">
                {telemetry.latency} LATENCY
              </span>
            </div>
            <h1 className="text-6xl font-black arena-text-gradient uppercase tracking-tighter italic leading-none">
                DATA STREAM <br/> TERMINAL
            </h1>
            <p className="text-[var(--color-textMuted)] text-sm font-medium tracking-widest uppercase italic max-w-lg border-l-2 border-[var(--color-primary)]/30 pl-4 py-1">
                Unified multi-channel monitoring system. Aggregating real-time telemetry from global leagues, local championships, and active trade rooms.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            <TelemetryCard icon={Shield} label="Neural Link" value="CONNECTED" color="text-[var(--color-success)]" />
            <TelemetryCard icon={Zap} label="Throughput" value={telemetry.throughput} />
            <TelemetryCard icon={Globe} label="Satellites" value="ONLINE" color="text-[var(--color-primary)]" />
            <TelemetryCard icon={BarChart3} label="Uptime" value={telemetry.uptime} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Auctions & Transactions */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Trade Rooms */}
          <div className="glass-panel p-8 border border-white/5 bg-white/[0.01]">
            <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
              <h2 className="text-xl font-black uppercase italic tracking-widest flex items-center gap-3">
                <Gavel className="w-6 h-6 text-[var(--color-secondary)]" />
                ACTIVE TRADE ROOMS
              </h2>
              <button className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest hover:underline">
                VIEW ALL AUCTIONS →
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeAuctions.length > 0 ? activeAuctions.map(auction => (
                <div key={auction.id} className="glass-panel p-5 border-white/5 bg-black/40 group hover:border-[var(--color-primary)]/30 transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black text-red-500 animate-pulse bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">{auction.status}</span>
                    <Radio className="w-4 h-4 text-gray-700 group-hover:text-[var(--color-primary)]" />
                  </div>
                  <h3 className="text-lg font-black uppercase mb-4 group-hover:text-[var(--color-primary)] transition-colors">{auction.name}</h3>
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-[var(--color-textMuted)]">
                    <span>BIDS: {auction.bids}</span>
                    <span className="text-white">TOP: ${auction.highest.toLocaleString()}</span>
                  </div>
                </div>
              )) : (
                <div className="col-span-2 p-10 text-center opacity-30 border-2 border-dashed border-white/5 rounded-xl">
                  <AlertTriangle className="w-10 h-10 mx-auto mb-4" />
                  <p className="font-black uppercase tracking-widest">No trade rooms currently broadcasting</p>
                </div>
              )}
            </div>
          </div>

          {/* Transaction Feed */}
          <div className="glass-panel p-8 border border-white/5 bg-white/[0.01]">
            <h2 className="text-xl font-black uppercase italic tracking-widest flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
              <Terminal className="w-6 h-6 text-[var(--color-success)]" />
               TRANSACTION LOGS
            </h2>
            <div className="space-y-4">
              {transactions.map(tx => (
                <div key={tx.id} className="flex items-center justify-between p-3 border-l-2 border-[var(--color-success)]/20 bg-white/5 font-rajdhani">
                  <div className="flex gap-4 items-center">
                    <span className="text-[10px] text-gray-500 font-bold">{tx.time || 'JUST NOW'}</span>
                    <span className="text-[11px] font-black uppercase tracking-widest text-[var(--color-success)]">{tx.user}</span>
                    <span className="text-[11px] text-[var(--color-textMuted)] uppercase">ENLISTED {tx.item}</span>
                  </div>
                  <span className="text-sm font-black text-white italic">+ ${tx.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Global & System */}
        <div className="space-y-8">
           {/* Global Pulse Wrapper */}
           <div className="glass-panel p-6 border border-white/5 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Globe className="w-20 h-20" />
              </div>
              <GlobalSportsPulse />
           </div>

           {/* System Status */}
           <div className="glass-panel p-8 border border-white/5 bg-black/60">
              <h2 className="text-xs font-black text-gray-500 tracking-[0.4em] uppercase mb-6 flex items-center gap-2 italic">
                <Activity className="w-4 h-4 text-[var(--color-primary)]" />
                SYSTEM MONITORING
              </h2>
              <div className="space-y-6">
                <SystemBar label="ENCRYPTION STRENGTH" value={98} color="bg-[var(--color-primary)]" />
                <SystemBar label="DATA INTEGRITY" value={100} color="bg-[var(--color-success)]" />
                <SystemBar label="NODE SYNCHRONIZATION" value={85} color="bg-[var(--color-secondary)]" />
              </div>
              
              <div className="mt-10 p-4 rounded-xl bg-red-500/5 border border-red-500/20 flex gap-4 items-center">
                 <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                 <p className="text-[10px] font-black text-red-500 uppercase tracking-widest italic">
                    All neural links operational. No corruption detected.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const TelemetryCard = ({ icon: Icon, label, value, color = "text-white" }) => (
  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-1">
    <div className="flex items-center gap-2 opacity-40">
      <Icon className="w-3 h-3" />
      <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <span className={`text-lg font-black italic tracking-tighter ${color}`}>{value}</span>
  </div>
);

const SystemBar = ({ label, value, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-[10px] font-black tracking-widest uppercase">
      <span className="text-gray-500">{label}</span>
      <span className="text-white">{value}%</span>
    </div>
    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
      <div className={`h-full ${color} shadow-[0_0_10px_rgba(0,0,0,0.5)]`} style={{ width: `${value}%` }} />
    </div>
  </div>
);

export default RealtimeCenter;
