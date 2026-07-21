import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ShieldAlert, 
  Settings, 
  Shield, 
  Activity,
  Mail
} from 'lucide-react';

// Sub-components
import AnalyticsPanel from './components/AnalyticsPanel';
import UserManagementPanel from './components/UserManagementPanel';
import ContentCurationPanel from './components/ContentCurationPanel';
import MaintenancePanel from './components/MaintenancePanel';
import SupportFAQPanel from './components/SupportFAQPanel';

export default function AdminConsole() {
  // 1. Tab Navigation State
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics', 'users', 'content', 'system', 'support'

  return (
    <div className="font-brand min-h-screen bg-tafach-light text-tafach-dark flex">
      {/* LEFT SIDEBAR PANEL (Sticky Left-Aligned Administration Sidebar) */}
      <aside className="w-80 bg-tafach-dark text-white border-r border-tafach-border flex flex-col justify-between sticky top-0 h-screen select-none shrink-0 z-20">
        <div className="flex flex-col">
          {/* Header Brand Branding */}
          <div className="p-grid-3 border-b border-white/10 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-tafach-orange flex items-center justify-center shadow-lg shadow-tafach-orange/20">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-tight">Tafach Admin</h1>
              <span className="text-xs text-tafach-muted">Operations & Control</span>
            </div>
          </div>

          {/* Navigation Tree */}
          <nav className="p-grid-2 flex flex-col gap-1.5 mt-grid-2">
            <span className="px-grid-2 py-1 text-[11px] font-bold text-tafach-muted uppercase tracking-wider">
              Core Console
            </span>
            
            <button
              onClick={() => setActiveTab('analytics')}
              className={`active:scale-95 transition-transform flex items-center gap-3 px-grid-2 py-2.5 rounded-lg text-sm font-medium w-full text-left transition-colors duration-150 ${
                activeTab === 'analytics'
                  ? 'bg-tafach-orange text-white'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              System Analytics Matrix
            </button>

            <span className="px-grid-2 py-1 text-[11px] font-bold text-tafach-muted uppercase tracking-wider mt-grid-3">
              Management
            </span>

            <button
              onClick={() => setActiveTab('users')}
              className={`active:scale-95 transition-transform flex items-center gap-3 px-grid-2 py-2.5 rounded-lg text-sm font-medium w-full text-left transition-colors duration-150 ${
                activeTab === 'users'
                  ? 'bg-tafach-orange text-white'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Users className="h-4 w-4" />
              User Access & Moderation
            </button>

            <button
              onClick={() => setActiveTab('content')}
              className={`active:scale-95 transition-transform flex items-center gap-3 px-grid-2 py-2.5 rounded-lg text-sm font-medium w-full text-left transition-colors duration-150 ${
                activeTab === 'content'
                  ? 'bg-tafach-orange text-white'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <ShieldAlert className="h-4 w-4" />
              Content Curation Hub
            </button>

            <button
              onClick={() => setActiveTab('support')}
              className={`w-full text-left px-3 py-2 rounded text-sm font-semibold transition-all active:scale-95 transition-transform ${
                activeTab === 'support' ? 'bg-tafach-orange text-white shadow-sm' : 'text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              ✉️ Support Inquiries & FAQ
            </button>

            <span className="px-grid-2 py-1 text-[11px] font-bold text-tafach-muted uppercase tracking-wider mt-grid-3">
              Maintenance
            </span>

            <button
              onClick={() => setActiveTab('system')}
              className={`active:scale-95 transition-transform flex items-center gap-3 px-grid-2 py-2.5 rounded-lg text-sm font-medium w-full text-left transition-colors duration-150 ${
                activeTab === 'system'
                  ? 'bg-tafach-orange text-white'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Settings className="h-4 w-4" />
              System Maintenance
            </button>
          </nav>
        </div>

        {/* Footer Admin Status Info */}
        <div className="p-grid-2 border-t border-white/10 bg-black/20 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-tafach-orange to-amber-500 flex items-center justify-center font-bold text-white text-sm shadow-md">
              SA
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-white">Super Administrator</span>
              <span className="text-[10px] text-tafach-muted">admin@tafachkitchen.com</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-gray-400 bg-white/5 p-2 rounded-md">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-tafach-green animate-pulse" />
              <span>Redis Cluster: Online</span>
            </div>
            <span>v2.1.0</span>
          </div>
        </div>
      </aside>

      {/* MAIN SUB-PANE PANELS */}
      <main className="flex-1 min-w-0 overflow-y-auto p-grid-4">
        {/* Top Header Information Panel */}
        <header className="mb-grid-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-tafach-border pb-grid-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-tafach-dark">Admin Operations Console</h2>
            <p className="text-sm text-tafach-muted">Tafach Kitchen Core System Administration Dashboard</p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="px-3 py-1.5 rounded-full bg-tafach-green/10 text-tafach-green font-medium text-xs flex items-center gap-1.5 animate-pulse">
              <Activity className="h-3 w-3" />
              System Status: ONLINE
            </div>
            <span className="text-xs text-tafach-muted border-l border-tafach-border pl-2">
              July 21, 2026
            </span>
          </div>
        </header>

        {/* Tab Sub-Panel Renderer (Dynamic Mounting & Unmounting) */}
        {activeTab === 'analytics' && <AnalyticsPanel />}
        {activeTab === 'users' && <UserManagementPanel />}
        {activeTab === 'content' && <ContentCurationPanel />}
        {activeTab === 'system' && <MaintenancePanel />}
        {activeTab === 'support' && <SupportFAQPanel />}
      </main>
    </div>
  );
}

