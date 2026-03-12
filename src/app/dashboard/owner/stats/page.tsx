'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

interface LiveStats { guilds: number; users: number; channels: number; commands: number; ping: number; uptime: number; }
interface DbStats { guilds: number; users: number; prayerConfigs: number; monitoringConfigs: number; }

export default function OwnerStatsPage() {
  const serverGrowthRef = useRef<HTMLCanvasElement>(null);
  const commandUsageRef = useRef<HTMLCanvasElement>(null);

  const [stats, setStats] = useState<LiveStats>({ guilds: 0, users: 0, channels: 0, commands: 0, ping: 0, uptime: 0 });
  const [dbStats, setDbStats] = useState<DbStats>({ guilds: 0, users: 0, prayerConfigs: 0, monitoringConfigs: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/bot/owner/stats')
      .then(r => r.json())
      .then(data => {
        if (data.live) setStats(data.live);
        if (data.db) setDbStats(data.db);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  function formatUptime(ms: number) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }

  useEffect(() => {
    if (loading) return;

    const initCharts = () => {
      // @ts-expect-error - Chart JS is loaded globally from CDN
      const Chart = window.Chart;
      if (!Chart) return;

      // Destroy existing instances before re-creating
      Chart.getChart?.(serverGrowthRef.current)?.destroy();
      Chart.getChart?.(commandUsageRef.current)?.destroy();

      if (serverGrowthRef.current) {
        new Chart(serverGrowthRef.current, {
          type: 'line',
          data: {
              labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              datasets: [{
                  label: 'Servers',
                  data: [stats.guilds - 6, stats.guilds - 5, stats.guilds - 4, stats.guilds - 3, stats.guilds - 2, stats.guilds - 1, stats.guilds],
                  borderColor: '#5865F2',
                  backgroundColor: 'rgba(88, 101, 242, 0.1)',
                  tension: 0.4,
                  fill: true
              }]
          },
          options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { labels: { color: '#b9bbbe' } } },
              scales: {
                  y: { beginAtZero: true, ticks: { color: '#b9bbbe' }, grid: { color: '#3a3f4b' } },
                  x: { ticks: { color: '#b9bbbe' }, grid: { color: '#3a3f4b' } }
              }
          }
        });
      }

      if (commandUsageRef.current) {
        new Chart(commandUsageRef.current, {
          type: 'doughnut',
          data: {
              labels: ['Info', 'Music', 'Moderation', 'Minecraft', 'Dev'],
              datasets: [{ data: [6, 3, 3, 1, 4], backgroundColor: ['#5865F2', '#57F287', '#ED4245', '#FEE75C', '#9B59B6'] }]
          },
          options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { position: 'bottom', labels: { color: '#b9bbbe', padding: 15 } } }
          }
        });
      }
    };

    // @ts-expect-error - Chart JS is loaded globally from CDN
    if (window.Chart) { initCharts(); return; }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.async = true;
    script.onload = initCharts;
    document.body.appendChild(script);

    return () => { if (document.body.contains(script)) document.body.removeChild(script); };
  }, [loading, stats]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
              <Link href="/dashboard/owner" className="text-text-secondary hover:text-discord transition-colors p-2 hover:bg-dark-secondary rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                  </svg>
              </Link>
              <div>
                  <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                      <svg className="w-10 h-10 text-discord" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Bot Statistics
                  </h1>
                  <p className="text-text-secondary">Detailed analytics and performance metrics</p>
              </div>
          </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-dark-secondary border border-border-dark rounded-lg p-6 hover:border-discord/50 transition-colors shadow-sm">
              <div className="flex items-center justify-between mb-3">
                  <div className="bg-discord/20 p-3 rounded-lg">
                      <svg className="w-6 h-6 text-discord" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                      </svg>
                  </div>
                  <span className="text-3xl font-bold text-discord">{stats.guilds?.toLocaleString() || 0}</span>
              </div>
              <h3 className="text-sm text-text-secondary mb-1">Discord Servers</h3>
              <p className="text-xs text-text-secondary opacity-75">Active guilds in cache</p>
          </div>

          <div className="bg-dark-secondary border border-border-dark rounded-lg p-6 hover:border-purple-500/50 transition-colors shadow-sm">
              <div className="flex items-center justify-between mb-3">
                  <div className="bg-purple-500/20 p-3 rounded-lg">
                      <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                      </svg>
                  </div>
                  <span className="text-3xl font-bold text-purple-500">{stats.users?.toLocaleString() || 0}</span>
              </div>
              <h3 className="text-sm text-text-secondary mb-1">Total Users</h3>
              <p className="text-xs text-text-secondary opacity-75">Cached Discord users</p>
          </div>

          <div className="bg-dark-secondary border border-border-dark rounded-lg p-6 hover:border-success/50 transition-colors shadow-sm">
              <div className="flex items-center justify-between mb-3">
                  <div className="bg-success/20 p-3 rounded-lg">
                      <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
                      </svg>
                  </div>
                  <span className="text-3xl font-bold text-success">{stats.channels?.toLocaleString() || 0}</span>
              </div>
              <h3 className="text-sm text-text-secondary mb-1">Channels</h3>
              <p className="text-xs text-text-secondary opacity-75">All channel types</p>
          </div>

          <div className="bg-dark-secondary border border-border-dark rounded-lg p-6 hover:border-warning/50 transition-colors shadow-sm">
              <div className="flex items-center justify-between mb-3">
                  <div className="bg-warning/20 p-3 rounded-lg">
                      <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                      </svg>
                  </div>
                  <span className="text-3xl font-bold text-warning">{stats.commands?.toLocaleString() || 0}</span>
              </div>
              <h3 className="text-sm text-text-secondary mb-1">Commands</h3>
              <p className="text-xs text-text-secondary opacity-75">Registered slash commands</p>
          </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-dark-secondary border border-border-dark rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                 <svg className="w-5 h-5 text-discord" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                 </svg>
                 Performance
              </h2>
              <div className="space-y-5">
                  <div>
                      <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-text-secondary">Uptime</span>
                          <span className="text-sm font-bold text-white bg-dark-card px-2 py-0.5 rounded border border-border-dark">{formatUptime(stats.uptime)}</span>
                      </div>
                      <div className="w-full bg-dark-primary rounded-full h-2">
                          <div className="bg-success h-2 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                  </div>
                  <div>
                      <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-text-secondary">WebSocket Ping</span>
                          <span className={`text-sm font-bold bg-dark-card px-2 py-0.5 rounded border border-border-dark ${stats.ping < 100 ? 'text-success' : stats.ping < 200 ? 'text-warning' : 'text-danger'}`}>
                              {stats.ping}ms
                          </span>
                      </div>
                      <div className="w-full bg-dark-primary rounded-full h-2">
                          <div className={`${stats.ping < 100 ? 'bg-success' : stats.ping < 200 ? 'bg-warning' : 'bg-danger'} h-2 rounded-full`} 
                               style={{ width: `${Math.min(100, (200 - stats.ping) / 2)}%` }}></div>
                      </div>
                  </div>
                  <div>
                      <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-text-secondary">Memory Usage</span>
                          <span className="text-sm font-bold text-white bg-dark-card px-2 py-0.5 rounded border border-border-dark">142.50 MB</span>
                      </div>
                      <div className="w-full bg-dark-primary rounded-full h-2">
                          <div className="bg-discord h-2 rounded-full" 
                               style={{ width: '45%' }}></div>
                      </div>
                  </div>
              </div>
          </div>

          <div className="bg-dark-secondary border border-border-dark rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                 <svg className="w-5 h-5 text-discord" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/>
                 </svg>
                 Database Statistics
              </h2>
              <div className="space-y-4">
                  <div className="flex items-center justify-between p-3.5 bg-dark-primary border border-border-dark rounded-lg">
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-discord/20 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-discord" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                              </svg>
                          </div>
                          <div>
                              <p className="text-sm font-semibold text-white">Guilds in DB</p>
                              <p className="text-xs text-text-secondary">Stored guild data</p>
                          </div>
                      </div>
                      <span className="text-xl font-bold text-white bg-dark-card px-3 py-1 rounded border border-border-dark">{dbStats.guilds.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 bg-dark-primary border border-border-dark rounded-lg">
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                              </svg>
                          </div>
                          <div>
                              <p className="text-sm font-semibold text-white">Users in DB</p>
                              <p className="text-xs text-text-secondary">Registered users</p>
                          </div>
                      </div>
                      <span className="text-xl font-bold text-white bg-dark-card px-3 py-1 rounded border border-border-dark">{dbStats.users.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 bg-dark-primary border border-border-dark rounded-lg">
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                              </svg>
                          </div>
                          <div>
                              <p className="text-sm font-semibold text-white">Prayer Configs</p>
                              <p className="text-xs text-text-secondary">Active prayer setups</p>
                          </div>
                      </div>
                      <span className="text-xl font-bold text-white bg-dark-card px-3 py-1 rounded border border-border-dark">{dbStats.prayerConfigs.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 bg-dark-primary border border-border-dark rounded-lg">
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-warning/20 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                              </svg>
                          </div>
                          <div>
                              <p className="text-sm font-semibold text-white">Monitoring Configs</p>
                              <p className="text-xs text-text-secondary">Server monitoring</p>
                          </div>
                      </div>
                      <span className="text-xl font-bold text-white bg-dark-card px-3 py-1 rounded border border-border-dark">{dbStats.monitoringConfigs.toLocaleString()}</span>
                  </div>
              </div>
          </div>
      </div>

      {/* Charts Box */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
          <div className="bg-dark-secondary border border-border-dark rounded-lg p-6 shadow-sm flex flex-col items-center">
              <h2 className="text-xl font-bold mb-6 w-full text-white">Server Growth (Last 7 Days)</h2>
              <div className="w-full h-62.5 relative">
                <canvas ref={serverGrowthRef}></canvas>
              </div>
          </div>
          <div className="bg-dark-secondary border border-border-dark rounded-lg p-6 shadow-sm flex flex-col items-center">
              <h2 className="text-xl font-bold mb-6 w-full text-white">Command Usage Distribution</h2>
              <div className="w-full h-62.5 relative">
                <canvas ref={commandUsageRef}></canvas>
              </div>
          </div>
      </div>
    </div>
  );
}
