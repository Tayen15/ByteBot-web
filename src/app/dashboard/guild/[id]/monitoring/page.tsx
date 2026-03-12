/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, use, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ServerMonitoringPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState({
    enabled: false,
    serverHost: '',
    serverPort: 25565,
    serverName: '',
    channelId: '',
    checkInterval: 5,
    notifyOnline: true,
    notifyOffline: true,
    notifyPlayerCount: false,
  });

  const [currentStatus, setCurrentStatus] = useState<{
    isOnline?: boolean;
    currentPlayers?: number;
    maxPlayers?: number;
    version?: string;
    lastChecked?: string;
  } | null>(null);

  const [channels, setChannels] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    Promise.all([
      fetch(`/api/bot/guild/${id}/monitoring`).then(r => r.json()),
      fetch(`/api/bot/guild/${id}/channels`).then(r => r.json()),
    ]).then(([monData, chData]) => {
      if (monData.success && monData.monitors?.length > 0) {
        const m = monData.monitors[0];
        setFormData({
          enabled: m.enabled ?? false,
          serverHost: m.serverHost ?? '',
          serverPort: m.serverPort ?? 25565,
          serverName: m.serverName ?? '',
          channelId: m.channelId ?? '',
          checkInterval: m.checkInterval ?? 5,
          notifyOnline: m.notifyOnline ?? true,
          notifyOffline: m.notifyOffline ?? true,
          notifyPlayerCount: m.notifyPlayerCount ?? false,
        });
        setCurrentStatus({
          isOnline: m.isOnline,
          currentPlayers: m.currentPlayers,
          maxPlayers: m.maxPlayers,
          version: m.version,
          lastChecked: m.lastChecked,
        });
      }
      if (chData.success) setChannels(chData.channels ?? []);
    }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const handleFormChange = () => {
    setHasUnsavedChanges(true);
  };

  const handleToggleChange = (field: keyof typeof formData) => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
    handleFormChange();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
       ...prev, 
       [name]: e.target.type === 'number' ? parseInt(value) : value 
    }));
    handleFormChange();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/bot/guild/${id}/monitoring`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setHasUnsavedChanges(false);
        setAlert({ message: 'Monitoring settings saved!', type: 'success' });
      } else {
        setAlert({ message: data.error || 'Failed to save', type: 'error' });
      }
    } catch {
      setAlert({ message: 'Network error', type: 'error' });
    } finally {
      setSaving(false);
      setTimeout(() => setAlert(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-discord"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-border-dark gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
             <svg className="w-7 h-7 text-discord" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"/>
             </svg>
             Server Monitoring
          </h1>
          <p className="text-text-secondary text-sm">Monitor your Minecraft server status in real-time</p>
        </div>
        <Link
          href={`/dashboard/guild/${id}`}
          className="text-text-secondary hover:text-white transition-colors duration-200 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-dark-secondary hover:bg-dark-card border border-border-dark shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Back to Server Actions</span>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Enable/Disable Toggle */}
        <div className="bg-dark-secondary border border-border-dark rounded-xl p-6 hover:border-discord/50 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-1 text-white">Monitoring Service</h2>
              <p className="text-text-secondary text-sm">Enable automated checking of your Minecraft server status</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={formData.enabled}
                onChange={() => handleToggleChange('enabled')}
              />
              <div className="w-14 h-7 bg-dark-card peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-discord"></div>
            </label>
          </div>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity duration-300 ${!formData.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
           {/* Server Configuration */}
           <div className="bg-dark-secondary border border-border-dark rounded-xl p-6 shadow-sm">
             <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border-dark text-white">
                <svg className="w-5 h-5 text-discord" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
                <h2 className="text-lg font-bold">Connection Details</h2>
             </div>
             <div className="space-y-5">
               <div>
                 <label className="block text-sm font-semibold mb-2 text-text-secondary">Server Host/IP<span className="text-danger ml-1">*</span></label>
                 <input 
                   type="text" 
                   name="serverHost"
                   value={formData.serverHost}
                   onChange={handleInputChange}
                   required
                   className="w-full bg-dark-card border border-border-dark rounded-lg px-4 py-2.5 focus:outline-none focus:border-discord transition-colors text-white font-mono text-sm"
                   placeholder="play.example.com"
                 />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <label className="block text-sm font-semibold mb-2 text-text-secondary">Port<span className="text-danger ml-1">*</span></label>
                    <input 
                      type="number" 
                      name="serverPort"
                      value={formData.serverPort}
                      onChange={handleInputChange}
                      required min="1" max="65535"
                      className="w-full bg-dark-card border border-border-dark rounded-lg px-4 py-2.5 focus:outline-none focus:border-discord transition-colors text-white font-mono text-sm"
                      placeholder="25565"
                    />
                  </div>
                  <div className="col-span-1">
                     <label className="block text-sm font-semibold mb-2 text-text-secondary">Display Name</label>
                     <input 
                       type="text" 
                       name="serverName"
                       value={formData.serverName}
                       onChange={handleInputChange}
                       className="w-full bg-dark-card border border-border-dark rounded-lg px-4 py-2.5 focus:outline-none focus:border-discord transition-colors text-white text-sm"
                       placeholder="My Server"
                     />
                  </div>
               </div>
             </div>
           </div>

           {/* Monitoring Settings */}
           <div className="bg-dark-secondary border border-border-dark rounded-xl p-6 shadow-sm">
             <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border-dark text-white">
                <svg className="w-5 h-5 text-discord" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <h2 className="text-lg font-bold">Automation</h2>
             </div>
             <div className="space-y-5">
               <div>
                 <label className="block text-sm font-semibold mb-2 text-text-secondary">Notification Channel<span className="text-danger ml-1">*</span></label>
                 <select 
                   name="channelId"
                   value={formData.channelId}
                   onChange={handleInputChange}
                   required
                   className="w-full bg-dark-card border border-border-dark rounded-lg px-4 py-2.5 focus:outline-none focus:border-discord transition-colors text-white text-sm"
                 >
                    <option value="">Select a channel...</option>
                    {channels.map(ch => (
                       <option key={ch.id} value={ch.id}># {ch.name}</option>
                    ))}
                 </select>
               </div>
               <div>
                 <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-text-secondary">Check Interval (Minutes)<span className="text-danger ml-1">*</span></label>
                    <span className="text-discord font-bold text-sm bg-discord/10 px-2 rounded">{formData.checkInterval}m</span>
                 </div>
                 <input 
                   type="range" 
                   name="checkInterval"
                   value={formData.checkInterval}
                   onChange={handleInputChange}
                   min="1" max="60" step="1"
                   className="w-full h-2 bg-dark-card rounded-lg appearance-none cursor-pointer accent-discord"
                 />
                 <div className="flex justify-between text-xs text-text-secondary mt-2">
                    <span>1m (Fast)</span>
                    <span>30m</span>
                    <span>60m (Slow)</span>
                 </div>
               </div>
             </div>
           </div>
        </div>

        {/* Triggers */}
        <div className={`bg-dark-secondary border border-border-dark rounded-xl p-6 shadow-sm transition-opacity duration-300 ${!formData.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
           <h2 className="text-lg font-bold mb-4 text-white">Alert Triggers</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-start gap-3 p-4 bg-dark-card border border-border-dark rounded-xl cursor-pointer hover:border-success/50 transition-colors group">
                 <input 
                   type="checkbox" 
                   checked={formData.notifyOnline}
                   onChange={() => handleToggleChange('notifyOnline')}
                   className="mt-1 w-5 h-5 rounded border-border-dark bg-dark-card accent-success"
                 />
                 <div>
                    <span className="block font-semibold text-white group-hover:text-success transition-colors">Server Online</span>
                    <span className="text-xs text-text-secondary mt-1 block">Notify when the server comes back online.</span>
                 </div>
              </label>
              
              <label className="flex items-start gap-3 p-4 bg-dark-card border border-border-dark rounded-xl cursor-pointer hover:border-danger/50 transition-colors group">
                 <input 
                   type="checkbox" 
                   checked={formData.notifyOffline}
                   onChange={() => handleToggleChange('notifyOffline')}
                   className="mt-1 w-5 h-5 rounded border-border-dark bg-dark-card accent-danger"
                 />
                 <div>
                    <span className="block font-semibold text-white group-hover:text-danger transition-colors">Server Offline</span>
                    <span className="text-xs text-text-secondary mt-1 block">Notify immediately when the server goes down.</span>
                 </div>
              </label>

              <label className="flex items-start gap-3 p-4 bg-dark-card border border-border-dark rounded-xl cursor-pointer hover:border-discord/50 transition-colors group">
                 <input 
                   type="checkbox" 
                   checked={formData.notifyPlayerCount}
                   onChange={() => handleToggleChange('notifyPlayerCount')}
                   className="mt-1 w-5 h-5 rounded border-border-dark bg-dark-card accent-discord"
                 />
                 <div>
                    <span className="block font-semibold text-white group-hover:text-discord transition-colors">Player Activity</span>
                    <span className="text-xs text-text-secondary mt-1 block">Notify on significant player count changes.</span>
                 </div>
              </label>
           </div>
        </div>

        {/* Live Status Overview (Read Only) */}
        {formData.enabled && currentStatus && (
           <div className="bg-dark-secondary border border-border-dark rounded-xl p-6 shadow-sm relative overflow-hidden animate-in fade-in slide-in-from-bottom-4">
             {/* Decorative background element */}
             <div className="absolute -right-16 -top-16 opacity-5 pointer-events-none">
                <svg className="w-64 h-64 text-discord" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2"/>
                </svg>
             </div>

             <h2 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
                Live Status Overview
                <span className="relative flex h-3 w-3 ml-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${currentStatus.isOnline ? 'bg-success' : 'bg-danger'}`}></span>
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${currentStatus.isOnline ? 'bg-success' : 'bg-danger'}`}></span>
                </span>
             </h2>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                <div className="bg-dark-card p-4 rounded-lg border border-border-dark">
                   <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold mb-1">Status</p>
                   <p className={`text-lg font-bold ${currentStatus.isOnline ? 'text-success' : 'text-danger'} flex items-center gap-2`}>
                      {currentStatus.isOnline ? '● Online' : '● Offline'}
                   </p>
                </div>
                <div className="bg-dark-card p-4 rounded-lg border border-border-dark">
                   <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold mb-1">Players</p>
                   <p className="text-lg font-bold text-white flex items-center gap-2">
                      <svg className="w-5 h-5 text-discord" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                      </svg>
                      {currentStatus.currentPlayers} <span className="text-text-secondary text-sm font-medium">/ {currentStatus.maxPlayers}</span>
                   </p>
                </div>
                <div className="bg-dark-card p-4 rounded-lg border border-border-dark">
                   <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold mb-1">Version</p>
                   <p className="text-lg font-bold text-white font-mono">{currentStatus.version}</p>
                </div>
                <div className="bg-dark-card p-4 rounded-lg border border-border-dark">
                   <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold mb-1">Last Sync</p>
                   <p className="text-sm font-semibold text-text-secondary mt-1">
                      {currentStatus.lastChecked
                        ? new Date(currentStatus.lastChecked).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : '–'}
                   </p>
                </div>
             </div>
           </div>
        )}

        {/* Save/CTA Footer */}
        {hasUnsavedChanges && (
           <div className="fixed bottom-6 right-6 z-50 bg-dark-secondary text-white px-5 py-4 rounded-xl shadow-2xl border border-border-dark flex items-center gap-6 animate-in slide-in-from-bottom-5 fade-in">
              <span className="flex items-center gap-2 font-medium">
                 Changes haven&apos;t been saved!
              </span>
              <div className="flex gap-3">
                 <button 
                   type="button" 
                   onClick={() => setHasUnsavedChanges(false)}
                   className="px-4 py-2 hover:bg-dark-card rounded-lg transition-colors text-sm font-semibold border border-transparent hover:border-border-dark"
                 >
                   Discard
                 </button>
                 <button 
                   type="submit" 
                   className="bg-discord hover:bg-discord-hover px-6 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-discord/20"
                 >
                   Save Settings
                 </button>
              </div>
           </div>
        )}
      </form>
    </div>
  );
}
