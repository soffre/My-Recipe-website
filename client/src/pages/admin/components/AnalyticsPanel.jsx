import React, { useState } from 'react';
import { 
  Users, 
  Mail, 
  TrendingUp, 
  HardDrive, 
  Database,
  Activity,
  RefreshCw,
  Check
} from 'lucide-react';

export default function AnalyticsPanel() {
  // 1. SystemStats State
  const [stats, setStats] = useState({
    totalUsers: 1420,
    emailVerificationRate: 84,
    activeDailyUsers: 340,
    cloudinarySpaceUsed: 12.4,
    cloudinarySpaceTotal: 20
  });

  // 2. Asynq worker metrics
  const [workerMetrics, setWorkerMetrics] = useState({
    activeEmailsPerMin: 24,
    failedRetries: 2,
    stalledJobs: 0,
    redisMemoryUsed: 45.2,
    threadPoolActive: 4,
    threadPoolTotal: 32
  });

  // 3. AsyncQueueTasks (Recent tasks)
  const [recentTasks, setRecentTasks] = useState([
    {
      id: 'task-001',
      timestamp: '2026-07-21 00:21:15',
      recipientEmail: 'chef.alex@tafach.com',
      actionType: 'email_verification',
      status: 'SUCCESS'
    },
    {
      id: 'task-002',
      timestamp: '2026-07-21 00:23:42',
      recipientEmail: 'baker.sarah@gmail.com',
      actionType: 'password_reset',
      status: 'RETRYING'
    },
    {
      id: 'task-003',
      timestamp: '2026-07-21 00:24:01',
      recipientEmail: 'admin.moderator@tafach.org',
      actionType: 'email_verification',
      status: 'SUCCESS'
    }
  ]);

  // Queue simulation trigger
  const handleSimulateQueueTask = () => {
    const emails = [
      'chef.marcus@tafach.com',
      'user.nutrition@gmail.com',
      'tester.dev@tafach.org',
      'visitor.cook@hotmail.com'
    ];
    const actions = ['password_reset', 'email_verification'];
    const statuses = ['SUCCESS', 'RETRYING'];
    
    const randomEmail = emails[Math.floor(Math.random() * emails.length)];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newTask = {
      id: `task-${Math.floor(Math.random() * 900) + 100}`,
      timestamp: now,
      recipientEmail: randomEmail,
      actionType: randomAction,
      status: randomStatus
    };

    setRecentTasks(prev => [newTask, ...prev.slice(0, 2)]); // Keep to 3 rows total

    setWorkerMetrics(prev => ({
      ...prev,
      activeEmailsPerMin: prev.activeEmailsPerMin + 1,
      failedRetries: randomStatus === 'RETRYING' ? prev.failedRetries + 1 : prev.failedRetries,
      redisMemoryUsed: Number((prev.redisMemoryUsed + 0.1).toFixed(1))
    }));

    setTimeout(() => {
      setWorkerMetrics(prev => ({
        ...prev,
        activeEmailsPerMin: Math.max(24, prev.activeEmailsPerMin - 1)
      }));
    }, 4000);
  };

  // Clear failed task retries metric
  const handleResetFailedCounter = () => {
    setWorkerMetrics(prev => ({
      ...prev,
      failedRetries: 0
    }));
  };

  return (
    <section className="space-y-grid-4 animate-fadeIn">
      {/* SystemStats Multi-Card Dashboard Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-grid-2">
        
        {/* Card 1: Total Registered Profiles */}
        <div className="bg-white p-grid-3 rounded-2xl border border-tafach-border shadow-sm flex items-center justify-between transition-all duration-200 hover:shadow-md">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-tafach-muted uppercase tracking-wider block">Total Registered Profiles</span>
            <span className="text-3xl font-bold tracking-tight text-tafach-dark">
              {stats.totalUsers.toLocaleString()}
            </span>
            <span className="text-[11px] text-tafach-green font-medium flex items-center gap-1">
              ↑ 12% this month growth tag
            </span>
          </div>
          <div className="p-3 bg-tafach-orange/10 rounded-xl">
            <Users className="h-6 w-6 text-tafach-orange" />
          </div>
        </div>

        {/* Card 2: Active Verification Rates */}
        <div className="bg-white p-grid-3 rounded-2xl border border-tafach-border shadow-sm flex items-center justify-between transition-all duration-200 hover:shadow-md">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-tafach-muted uppercase tracking-wider block">Active Verification Rates</span>
            <span className="text-3xl font-bold tracking-tight text-tafach-dark">{stats.emailVerificationRate}%</span>
            <div className="w-24 bg-gray-100 rounded-full h-1.5 mt-1 overflow-hidden">
              <div 
                className="bg-tafach-green h-1.5 rounded-full" 
                style={{ width: `${stats.emailVerificationRate}%` }}
              />
            </div>
          </div>
          <div className="p-3 bg-tafach-green/10 rounded-xl">
            <Mail className="h-6 w-6 text-tafach-green" />
          </div>
        </div>

        {/* Card 3: Live Concurrent Active Engagement Sessions */}
        <div className="bg-white p-grid-3 rounded-2xl border border-tafach-border shadow-sm flex items-center justify-between transition-all duration-200 hover:shadow-md">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-tafach-muted uppercase tracking-wider block">Live Concurrent Active Engagement Sessions</span>
            <span className="text-3xl font-bold tracking-tight text-tafach-dark">{stats.activeDailyUsers}</span>
            <span className="text-[11px] text-tafach-green font-medium flex items-center gap-1">
              ● Real-time live sessions
            </span>
          </div>
          <div className="p-3 bg-tafach-dark/10 rounded-xl">
            <TrendingUp className="h-6 w-6 text-tafach-dark" />
          </div>
        </div>

        {/* Card 4: Media Cloudinary Storage Footprint */}
        <div className="bg-white p-grid-3 rounded-2xl border border-tafach-border shadow-sm flex items-center justify-between transition-all duration-200 hover:shadow-md">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-tafach-muted uppercase tracking-wider block">Media Cloudinary Storage Footprint</span>
            <span className="text-3xl font-bold tracking-tight text-tafach-dark">{stats.cloudinarySpaceUsed} GB</span>
            <span className="text-xs text-tafach-muted block">Max Quota: {stats.cloudinarySpaceTotal} GB Max Quota</span>
          </div>
          <div className="p-3 bg-gray-100 rounded-xl">
            <HardDrive className="h-6 w-6 text-tafach-muted" />
          </div>
        </div>
      </div>

      {/* Redis Worker & Queue Task Tracker Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-grid-3">
        {/* Asynq Redis Task Workers Stats & Controls */}
        <div className="lg:col-span-1 bg-white p-grid-3 rounded-2xl border border-tafach-border shadow-sm flex flex-col justify-between space-y-grid-2">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-tafach-border">
              <h3 className="font-bold text-sm text-tafach-dark flex items-center gap-2">
                <Database className="h-4 w-4 text-tafach-orange" />
                Asynq Redis Worker Status Widget
              </h3>
              <div className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-tafach-green animate-pulse" />
                <span className="text-[10px] text-tafach-green font-semibold uppercase">Active</span>
              </div>
            </div>

            {/* Worker Grid Counters */}
            <div className="grid grid-cols-3 gap-2 my-grid-2 text-center">
              <div className="p-2 bg-slate-50 rounded-lg">
                <span className="text-[10px] text-tafach-muted block font-semibold">Emails/Min</span>
                <span className="text-lg font-bold text-tafach-orange">{workerMetrics.activeEmailsPerMin}</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg">
                <span className="text-[10px] text-tafach-muted block font-semibold">Failures</span>
                <span className="text-lg font-bold text-tafach-error">{workerMetrics.failedRetries}</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg">
                <span className="text-[10px] text-tafach-muted block font-semibold">Stalled</span>
                <span className="text-lg font-bold text-tafach-dark">{workerMetrics.stalledJobs}</span>
              </div>
            </div>

            {/* Worker Progress Bars */}
            <div className="space-y-3 mt-4 text-xs">
              <div>
                <div className="flex justify-between text-tafach-muted mb-1 font-medium">
                  <span>Redis Memory (MB)</span>
                  <span>{workerMetrics.redisMemoryUsed} MB / 256 MB</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className="bg-tafach-orange h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(workerMetrics.redisMemoryUsed / 256) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-tafach-muted mb-1 font-medium">
                  <span>Thread Pool Usage</span>
                  <span>{workerMetrics.threadPoolActive} / {workerMetrics.threadPoolTotal} Workers</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className="bg-tafach-green h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(workerMetrics.threadPoolActive / workerMetrics.threadPoolTotal) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Queue Controls */}
          <div className="flex flex-col gap-2 pt-4">
            <button
              onClick={handleSimulateQueueTask}
              className="active:scale-95 transition-transform w-full bg-tafach-dark hover:bg-black text-white text-xs font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 shadow-sm"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              🔄 Simulate Inbound Task Job
            </button>
            <button
              onClick={handleResetFailedCounter}
              className="active:scale-95 transition-transform w-full bg-white hover:bg-slate-50 text-tafach-muted text-xs font-semibold py-2 px-3 rounded-lg border border-tafach-border flex items-center justify-center gap-1.5"
            >
              <Check className="h-3.5 w-3.5" />
              ✓ Reset Failed Job Retries
            </button>
          </div>
        </div>

        {/* AsyncQueueTasks List Area */}
        <div className="lg:col-span-2 bg-white p-grid-3 rounded-2xl border border-tafach-border shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-tafach-dark pb-2 border-b border-tafach-border mb-grid-2">
              Async Redis Task Queue Activity Table
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-tafach-border text-tafach-muted font-semibold">
                    <th className="py-2">Task ID</th>
                    <th className="py-2">Timestamp</th>
                    <th className="py-2">Recipient Email</th>
                    <th className="py-2">Action Type</th>
                    <th className="py-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 font-mono text-tafach-orange font-semibold">{task.id}</td>
                      <td className="py-2.5 text-tafach-muted">{task.timestamp}</td>
                      <td className="py-2.5 font-medium">{task.recipientEmail}</td>
                      <td className="py-2.5">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-medium uppercase font-mono">
                          {task.actionType.toUpperCase().replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-2.5 text-right">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          task.status === 'SUCCESS'
                            ? 'bg-tafach-green/10 text-tafach-green'
                            : 'bg-tafach-orange/10 text-tafach-orange animate-pulse'
                        }`}>
                          {task.status === 'SUCCESS' ? '✓ SUCCESS' : '⚠ RETRYING'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="text-[11px] text-tafach-muted mt-4 border-t border-slate-100 pt-2 flex items-center justify-between">
            <span>Showing latest task queue interactions</span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-tafach-green" /> Running on pool #1-3
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

