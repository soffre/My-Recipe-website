import React, { useState } from 'react';
import { 
  Database, 
  RefreshCw, 
  KeyRound, 
  Terminal, 
  Activity, 
  Clock, 
  CheckCircle2, 
  Server,
  Layers
} from 'lucide-react';

export default function MaintenancePanel() {
  // Loading states for each trigger
  const [loadingPrune, setLoadingPrune] = useState(false);
  const [loadingSync, setLoadingSync] = useState(false);
  const [loadingRotate, setLoadingRotate] = useState(false);

  // Service execution logs state
  const [logs, setLogs] = useState([
    { timestamp: '2026-07-21 00:30:15', level: 'INFO', msg: 'System check complete. All service engines reporting OK.' },
    { timestamp: '2026-07-21 00:24:00', level: 'INFO', msg: 'Hasura engine metadata sync successful.' },
    { timestamp: '2026-07-21 00:15:32', level: 'INFO', msg: 'VerificationLogs retention task completed. Removed 0 logs.' }
  ]);

  // Action Handlers
  const handlePruneLogs = () => {
    setLoadingPrune(true);
    setTimeout(() => {
      setLoadingPrune(false);
      const newLog = {
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        level: 'INFO',
        msg: 'VerificationLogs retention run completed: Purged 1,540 historical success rows older than 30 days.'
      };
      setLogs(prev => [newLog, ...prev]);
    }, 1800);
  };

  const handleReloadMetadata = () => {
    setLoadingSync(true);
    setTimeout(() => {
      setLoadingSync(false);
      const newLog = {
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        level: 'INFO',
        msg: 'Hasura metadata cache reloaded. Metadata schema synchronized across live container slots.'
      };
      setLogs(prev => [newLog, ...prev]);
    }, 2000);
  };

  const handleRotateKeys = () => {
    setLoadingRotate(true);
    setTimeout(() => {
      setLoadingRotate(false);
      const newLog = {
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        level: 'INFO',
        msg: 'JWT encryption key rotation task succeeded. Safely cycled JWT_SECRET_KEY variables across infrastructure nodes.'
      };
      setLogs(prev => [newLog, ...prev]);
    }, 2500);
  };

  return (
    <section className="space-y-grid-4 animate-fadeIn">
      {/* 1. Dashboard Grid: Critical Backend Infrastructure Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-grid-2">
        {/* Metric 1: Hasura Metadata Watch */}
        <div className="bg-white p-grid-3 rounded-2xl border border-tafach-border shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-tafach-orange/10 rounded-xl text-tafach-orange">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-tafach-muted uppercase tracking-wider block">Hasura Metadata Watch</span>
            <span className="text-xl font-bold text-tafach-dark">OK</span>
            <span className="text-[10px] text-tafach-green font-medium block">● Status Monitor Online</span>
          </div>
        </div>

        {/* Metric 2: PostgreSQL Active Connections */}
        <div className="bg-white p-grid-3 rounded-2xl border border-tafach-border shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-tafach-green/10 rounded-xl text-tafach-green">
            <Database className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-tafach-muted uppercase tracking-wider block">PostgreSQL Connections</span>
            <span className="text-xl font-bold text-tafach-dark">14 / 100</span>
            <span className="text-[10px] text-tafach-muted block">14.0% Pool Utilization</span>
          </div>
        </div>

        {/* Metric 3: Rate-Limiter Redis Pool Latency */}
        <div className="bg-white p-grid-3 rounded-2xl border border-tafach-border shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-slate-100 rounded-xl text-tafach-dark">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-tafach-muted uppercase tracking-wider block">Redis Pool Latency</span>
            <span className="text-xl font-bold text-tafach-dark">1.2ms</span>
            <span className="text-[10px] text-tafach-green font-medium block">P99 Rate-Limiter Ping</span>
          </div>
        </div>
      </div>

      {/* 2. Technical Operation Action Triggers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-grid-3">
        
        {/* Action Triggers Cards Deck */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <h3 className="font-bold text-sm text-tafach-dark pb-2 border-b border-tafach-border">
            Technical Operations Control
          </h3>

          {/* Card 1: Pruning Utility */}
          <div className="bg-white p-grid-3 rounded-2xl border border-tafach-border shadow-sm space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-tafach-muted uppercase tracking-wider block">Pruning Utility</span>
              <p className="text-xs text-tafach-dark font-medium leading-relaxed">
                Clears historical success rows older than 30 days from VerificationLogs to prevent data bloating.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={handlePruneLogs}
                disabled={loadingPrune}
                className="active:scale-95 transition-transform w-full bg-tafach-error hover:bg-tafach-error/95 disabled:bg-red-300 text-white text-xs font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-sm"
              >
                {loadingPrune ? (
                  <span className="flex items-center gap-2 animate-pulse">
                    <Clock className="h-3.5 w-3.5 animate-spin" />
                    [Pruning Transient Logs in Progress...]
                  </span>
                ) : (
                  <>
                    <span>🧹 Prune Transient Log Records</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Card 2: Permission Sync */}
          <div className="bg-white p-grid-3 rounded-2xl border border-tafach-border shadow-sm space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-tafach-muted uppercase tracking-wider block">Permission Sync</span>
              <p className="text-xs text-tafach-dark font-medium leading-relaxed">
                Syncs local files metadata configurations to live engine container slots.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={handleReloadMetadata}
                disabled={loadingSync}
                className="active:scale-95 transition-transform w-full bg-tafach-dark hover:bg-black disabled:bg-slate-400 text-white text-xs font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-sm"
              >
                {loadingSync ? (
                  <span className="flex items-center gap-2 animate-pulse">
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    [Reloading Metadata Cache in Progress...]
                  </span>
                ) : (
                  <>
                    <span>🔄 Reload Hasura Metadata Cache</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Card 3: Key Rotation */}
          <div className="bg-white p-grid-3 rounded-2xl border border-tafach-border shadow-sm space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-tafach-muted uppercase tracking-wider block">Key Rotation</span>
              <p className="text-xs text-tafach-dark font-medium leading-relaxed">
                Safely cycles JWT_SECRET_KEY variables across infrastructure endpoints.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={handleRotateKeys}
                disabled={loadingRotate}
                className="active:scale-95 transition-transform w-full bg-tafach-dark hover:bg-black disabled:bg-slate-400 text-white text-xs font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-sm"
              >
                {loadingRotate ? (
                  <span className="flex items-center gap-2 animate-pulse">
                    <Clock className="h-3.5 w-3.5 animate-spin" />
                    [Key Rotation in Progress...]
                  </span>
                ) : (
                  <>
                    <span>🔑 Rotate Encryption Keys</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* System execution logs output panel */}
        <div className="lg:col-span-2 bg-white p-grid-3 rounded-2xl border border-tafach-border shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-tafach-dark pb-2 border-b border-tafach-border mb-grid-2 flex items-center gap-2">
              <Server className="h-4 w-4 text-tafach-orange" />
              Service Execution Logs
            </h3>
            <div className="bg-slate-900 rounded-xl p-grid-2 font-mono text-[11px] text-slate-300 space-y-2 max-h-80 overflow-y-auto">
              {logs.map((log, idx) => (
                <div key={idx} className="flex gap-2 items-start leading-relaxed">
                  <span className="text-slate-500 shrink-0">{log.timestamp}</span>
                  <span className="font-bold text-emerald-400 shrink-0">[{log.level}]</span>
                  <span className="text-slate-100">{log.msg}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-tafach-muted mt-4 border-t border-slate-100 pt-2 flex items-center justify-between">
            <span>Server local time: 2026-07-21 00:40:47</span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-tafach-green" /> All operations operational
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
