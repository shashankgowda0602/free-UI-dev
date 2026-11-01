import React, { useState, useEffect } from 'react';
import { authService } from '../../services/authService';
import { Database, ShieldCheck, UserCheck, Download, Clock, RefreshCw, X, Server, KeyRound, CheckCircle2 } from 'lucide-react';

interface DatabaseExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseExplorerModal: React.FC<DatabaseExplorerModalProps> = ({ isOpen, onClose }) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'sessions' | 'users' | 'downloads'>('sessions');

  const fetchTelemetry = async () => {
    setIsLoading(true);
    const telemetry = await authService.getDatabaseTelemetry();
    setData(telemetry);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchTelemetry();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0c0e17] border-2 border-violet-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-[#121526] via-[#0e101a] to-[#141829] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/40 text-violet-400 flex items-center justify-center shadow-lg shadow-violet-600/20">
              <Database className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Auth0 Security & Database Hub
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  PERSISTENT DB ONLINE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time audit log of user credentials, Auth0 tokens, and login records stored for future sessions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchTelemetry}
              disabled={isLoading}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Refresh database records"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Database Stats KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#090b12] border-b border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
              Registered Users
            </span>
            <span className="text-xl font-black text-white font-mono">
              {data?.stats?.totalUsers ?? '...'}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] font-mono text-cyan-400 uppercase block mb-1">
              Stored Login Sessions
            </span>
            <span className="text-xl font-black text-cyan-300 font-mono">
              {data?.stats?.totalLoginSessions ?? '...'}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] font-mono text-violet-400 uppercase block mb-1">
              Recorded Downloads
            </span>
            <span className="text-xl font-black text-violet-300 font-mono">
              {data?.stats?.totalDownloads ?? '...'}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] font-mono text-emerald-400 uppercase block mb-1">
              Auth0 Protocol
            </span>
            <span className="text-xs font-bold text-emerald-300 font-mono block mt-1">
              PKCE + JWT Shield
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 px-4 pt-3 border-b border-slate-800 bg-[#0e101a]">
          <button
            onClick={() => setActiveTab('sessions')}
            className={`px-3 py-2 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'sessions'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Login Audit Sessions ({data?.recentSessions?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-2 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'users'
                ? 'border-violet-400 text-violet-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Database User Records ({data?.recentUsers?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('downloads')}
            className={`px-3 py-2 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'downloads'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Audit Download Logs ({data?.recentDownloads?.length || 0})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
          {isLoading ? (
            <div className="py-12 text-center text-slate-400">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-violet-400" />
              <span>Querying persistent database records...</span>
            </div>
          ) : activeTab === 'sessions' ? (
            <div className="space-y-2">
              {data?.recentSessions?.map((s: any) => (
                <div
                  key={s.id}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-violet-950 text-violet-300 border border-violet-500/40">
                        {s.authProvider.toUpperCase()}
                      </span>
                      <span className="font-bold text-white">{s.email}</span>
                      <span className="text-slate-500 text-[10px]">({s.fullName})</span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-2">
                      <span>IP: {s.ipAddress}</span>
                      <span>·</span>
                      <span className="text-cyan-400 truncate max-w-xs">{s.token}</span>
                    </div>
                  </div>
                  <div className="text-right sm:shrink-0">
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded block mb-1">
                      {s.status.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(s.loggedInAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : activeTab === 'users' ? (
            <div className="space-y-2">
              {data?.recentUsers?.map((u: any) => (
                <div
                  key={u.id}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-violet-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{u.fullName}</span>
                      <span className="text-violet-400">&lt;{u.email}&gt;</span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span>Auth0 Sub: {u.auth0Sub || 'N/A'}</span>
                      <span>·</span>
                      <span>Logins: {u.loginCount}</span>
                      <span>·</span>
                      <span>Downloads: {u.downloadCount}</span>
                    </div>
                  </div>
                  <div className="text-right sm:shrink-0 text-[10px] text-slate-500">
                    <span>Created: {new Date(u.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {data?.recentDownloads?.map((d: any) => (
                <div
                  key={d.id}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all"
                >
                  <div>
                    <span className="font-bold text-white block">{d.designName}</span>
                    <span className="text-slate-400 text-[11px]">
                      Downloaded by: {d.userEmail} ({d.format})
                    </span>
                  </div>
                  <div className="text-right sm:shrink-0 text-[10px] text-emerald-400">
                    <span>{new Date(d.downloadedAt).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-[#090b12] flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <Server className="w-3.5 h-3.5 text-violet-400" />
            <span>Database Storage: /data/uiverse_database.json (Persistent)</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
