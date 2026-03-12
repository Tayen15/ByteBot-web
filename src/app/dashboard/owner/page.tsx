'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface BotStats { status: string; uptime: string; guilds: number; users: number; channels: number; ping: number; }
interface LofiSession { guildId: string; channelId: string; startedAt: string; }
interface Guild { id: string; name: string; icon: string | null; memberCount: number; }

const formatUptime = (ms: number | string | null | undefined) => {
  const num = Number(ms);
  if (isNaN(num) || num === 0) return String(ms || '–');
  const seconds = Math.floor((num / 1000) % 60);
  const minutes = Math.floor((num / (1000 * 60)) % 60);
  const hours = Math.floor((num / (1000 * 60 * 60)) % 24);
  const days = Math.floor(num / (1000 * 60 * 60 * 24));
  
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (parts.length === 0) return `${seconds}s`;
  
  return parts.join(' ');
};

export default function OwnerDashboardPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);

  const [botStats, setBotStats] = useState<BotStats>({ status: '…', uptime: '…', guilds: 0, users: 0, channels: 0, ping: 0 });
  const [allGuilds, setAllGuilds] = useState<Guild[]>([]);
  const [lofiSessions, setLofiSessions] = useState<LofiSession[]>([]);

  const fetchData = async () => {
    try {
      // 1. Check health first
      const healthRes = await fetch('/api/bot/health');
      if (!healthRes.ok) throw new Error('Bot offline');
      const healthData = await healthRes.json();
      
      if (healthData.status !== 'online') {
         setBotStats(prev => ({ ...prev, status: 'OFFLINE' }));
         return;
      }

      // 2. Fetch Owner Stats if Online
      const [statsRes, serversRes, lofiRes] = await Promise.all([
        fetch('/api/bot/owner/stats'),
        fetch('/api/bot/owner/servers'),
        fetch('/api/bot/owner/lofi')
      ]);

      const [statsData, serversData, lofiData] = await Promise.all([
        statsRes.json().catch(() => ({})),
        serversRes.json().catch(() => ({})),
        lofiRes.json().catch(() => ({}))
      ]);

      if (statsData?.live) {
        setBotStats({
          status: 'ONLINE',
          uptime: formatUptime(statsData.live.uptime),
          guilds: statsData.live.guilds ?? 0,
          users: statsData.live.users ?? 0,
          channels: statsData.live.channels ?? 0,
          ping: statsData.live.ping ?? 0,
        });
      }
      
      if (serversData?.servers) setAllGuilds(serversData.servers);
      if (lofiData?.sessions) setLofiSessions(lofiData.sessions);

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setBotStats(prev => ({ ...prev, status: 'OFFLINE' }));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);



  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <svg className="w-10 h-10 text-discord" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Owner Dashboard
            </h1>
            <p className="text-text-secondary">ByteBot Advanced Control Panel</p>
          </div>
          <div className="bg-linear-to-r from-discord to-purple-600 px-4 py-2 rounded-lg shrink-0 flex items-center justify-center gap-2 shadow-lg shadow-discord/20">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-sm font-semibold text-white tracking-wide">OWNER ACCESS</span>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Bot Status */}
        <div className="bg-dark-card border border-border-dark rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-success/20 p-3 rounded-lg">
              <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-success">{botStats.status}</span>
          </div>
          <h3 className="text-text-secondary text-sm mb-1">Bot Status</h3>
          <p className="text-xl font-bold uppercase text-white">{botStats.status}</p>
          <p className="text-text-secondary text-xs mt-2">Uptime: {botStats.uptime}</p>
        </div>

        {/* Total Servers */}
        <div className="bg-dark-card border border-border-dark rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-discord/20 p-3 rounded-lg">
              <svg className="w-6 h-6 text-discord" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-discord">{botStats.guilds}</span>
          </div>
          <h3 className="text-text-secondary text-sm mb-1">Total Servers</h3>
          <p className="text-xl font-bold text-white">{botStats.guilds} Guilds</p>
        </div>

        {/* Total Users */}
        <div className="bg-dark-card border border-border-dark rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-500/20 p-3 rounded-lg">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-purple-500">{botStats.users.toLocaleString()}</span>
          </div>
          <h3 className="text-text-secondary text-sm mb-1">Total Users</h3>
          <p className="text-xl font-bold text-white">{botStats.users.toLocaleString()} Members</p>
        </div>

        {/* WS Ping */}
        <div className="bg-dark-card border border-border-dark rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-warning/20 p-3 rounded-lg">
              <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-warning">{botStats.ping}ms</span>
          </div>
          <h3 className="text-text-secondary text-sm mb-1">WS Ping</h3>
          <p className="text-xl font-bold text-white">{botStats.channels.toLocaleString()} Channels</p>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Server List */}
        <div className="lg:col-span-2">
          <div className="bg-dark-card border border-border-dark rounded-lg p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <h2 className="text-2xl font-bold text-white">All Servers</h2>
              <input
                type="text"
                placeholder="Search servers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-dark-secondary border border-border-dark rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-discord text-white w-full sm:w-64"
              />
            </div>
            <div className="space-y-3 flex-1 overflow-y-auto max-h-125 pr-2 custom-scrollbar">
              {allGuilds
                .filter((g) => g.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((guild) => (
                  <div
                    key={guild.id}
                    className="bg-dark-secondary border border-border-dark rounded-lg p-4 hover:border-discord transition-all duration-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-12 h-12 bg-discord rounded-lg flex items-center justify-center text-xl font-bold text-white shrink-0 overflow-hidden">
                          {guild.icon ? (
                            <Image width={48} height={48} src={guild.icon.startsWith('http') ? guild.icon : `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`} alt={guild.name} className="w-full h-full object-cover" />
                          ) : (
                            guild.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-white truncate">{guild.name}</h3>
                          <div className="flex items-center space-x-4 text-xs text-text-secondary mt-1 flex-wrap">
                            <span className="shrink-0 flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                              </svg>
                              {guild.memberCount.toLocaleString()} members
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 sm:shrink-0 w-full sm:w-auto">
                        <Link
                          href={`/dashboard/owner/servers/${guild.id}`}
                          className="flex-1 sm:flex-initial text-center bg-discord hover:bg-discord-hover text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                        >
                          Details
                        </Link>
                        <button
                          className="flex-1 sm:flex-initial text-center bg-danger/20 hover:bg-danger text-danger hover:text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                        >
                          Leave
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Quick Actions & System Info */}
        <div className="space-y-6 flex flex-col">
          {/* Quick Actions */}
          <div className="bg-dark-card border border-border-dark rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-white">Quick Actions</h2>
            <div className="space-y-3">
               {lofiSessions.length === 0 ? (
                 <div className="text-center text-text-secondary py-8 bg-dark-secondary rounded-lg border border-border-dark border-dashed">
                    <svg className="w-10 h-10 mx-auto opacity-50 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                    <p>No active lofi sessions</p>
                 </div>
               ) : (
                 lofiSessions.map(session => (
                    <div key={session.guildId} className="bg-dark-secondary rounded-lg p-3 border border-border-dark flex items-center justify-between">
                        <div>
                            <p className="font-bold text-white mb-1">Guild: {session.guildId}</p>
                            <p className="text-xs text-text-secondary">Started: {new Date(session.startedAt).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold px-2 py-1 bg-discord/20 text-discord rounded-full">Active</span>
                        </div>
                    </div>
                 ))
               )}
            </div>
        </div>
      </div>

              </div>

        {/* Global MODAL Overlay for Announcements */}
      {isAnnouncementModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-dark-card border border-border-dark rounded-xl p-6 md:p-8 max-w-2xl w-full shadow-2xl relative">
              <button 
                 onClick={() => setIsAnnouncementModalOpen(false)}
                 className="absolute top-4 right-4 text-text-secondary hover:text-white transition-colors"
               >
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                 </svg>
              </button>
              
               <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                 <svg className="w-6 h-6 text-discord" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                 </svg>
                 Send Announcement
               </h2>
               <form className="space-y-5">
                 <div>
                     <label className="block text-sm font-semibold mb-2 text-white">Target Servers</label>
                     <select className="w-full bg-dark-secondary border border-border-dark rounded-lg px-4 py-3 text-white focus:outline-none focus:border-discord transition-colors">
                         <option value="all">All Servers (Auto-select channel)</option>
                         {allGuilds.map((g) => (
                           <option key={g.id} value={g.id}>{g.name}</option>
                         ))}
                     </select>
                 </div>
                 <div>
                     <label className="block text-sm font-semibold mb-2 text-white">Message</label>
                     <textarea 
                        rows={6} 
                        className="w-full bg-dark-secondary border border-border-dark rounded-lg px-4 py-3 text-white focus:outline-none focus:border-discord resize-y transition-colors custom-scrollbar"
                        placeholder="Type your important announcement here... It will automatically be formatted."
                      />
                 </div>
                 <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 mt-8">
                     <button 
                        type="button" 
                        onClick={() => setIsAnnouncementModalOpen(false)} 
                        className="w-full sm:w-auto px-6 py-3 bg-transparent text-white font-medium hover:bg-dark-hover rounded-lg transition-colors border border-transparent hover:border-border-dark"
                      >
                         Cancel
                     </button>
                     <button 
                        type="submit" 
                        className="w-full sm:w-auto px-8 py-3 bg-discord hover:bg-discord-hover text-white font-semibold rounded-lg shadow-lg hover:shadow-discord/20 transition-all"
                      >
                         Send to Servers
                     </button>
                 </div>
               </form>
            </div>
         </div>
      )}
    </div>
  );
}
