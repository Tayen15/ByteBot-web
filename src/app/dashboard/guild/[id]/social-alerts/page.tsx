/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, use, useEffect } from 'react';
import Link from 'next/link';

type Platform = 'all' | 'youtube' | 'twitch' | 'twitter' | 'instagram';

type SocialAlert = {
  id: string;
  platform: Exclude<Platform, 'all'>;
  username: string;
  channelUrl?: string;
  channelId: string;
  notifyLive: boolean;
  notifyVideo: boolean;
  notifyPost: boolean;
  customRole: string;
  embedColor: string;
  checkInterval: number;
  enabled: boolean;
  totalAlerts: number;
};

export default function SocialAlertsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [activeFilter, setActiveFilter] = useState<Platform>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageAlert, setPageAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Modal Form State
  const [formData, setFormData] = useState<Partial<SocialAlert>>({
    platform: 'youtube',
    username: '',
    channelUrl: '',
    channelId: '',
    notifyLive: true,
    notifyVideo: true,
    notifyPost: true,
    customRole: '',
    embedColor: '#5865F2',
    checkInterval: 15,
    enabled: true
  });

  const [alerts, setAlerts] = useState<SocialAlert[]>([]);
  const [channels, setChannels] = useState<{ id: string; name: string }[]>([]);
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    Promise.all([
      fetch(`/api/bot/guild/${id}/social-alert`).then(r => r.json()),
      fetch(`/api/bot/guild/${id}/channels`).then(r => r.json()),
      fetch(`/api/bot/guild/${id}/roles`).then(r => r.json()).catch(() => ({ success: false })),
    ]).then(([alertData, chData, rolesData]) => {
      if (alertData.success) setAlerts(alertData.alerts ?? []);
      if (chData.success) setChannels(chData.channels ?? []);
      if (rolesData.success) setRoles(rolesData.roles ?? []);
    }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const filteredAlerts = activeFilter === 'all' 
    ? alerts 
    : alerts.filter(a => a.platform === activeFilter);

  const openAddModal = () => {
    setIsEditing(false);
    setFormData({
      platform: 'youtube',
      username: '',
      channelUrl: '',
      channelId: '',
      notifyLive: true,
      notifyVideo: true,
      notifyPost: true,
      customRole: '',
      embedColor: '#5865F2',
      checkInterval: 15,
      enabled: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (alert: SocialAlert) => {
    setIsEditing(true);
    setFormData(alert);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleToggle = async (alertId: string, currentEnabled: boolean) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, enabled: !currentEnabled } : a));
    try {
      await fetch(`/api/bot/guild/${id}/social-alert/${alertId}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: String(!currentEnabled) }),
      });
    } catch (err) {
      console.error('Toggle failed', err);
      setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, enabled: currentEnabled } : a));
    }
  };

  const handleDelete = async (alertId: string, username: string) => {
    if (!confirm(`Are you sure you want to delete the alert for ${username}?`)) return;
    setAlerts(prev => prev.filter(a => a.id !== alertId));
    try {
      await fetch(`/api/bot/guild/${id}/social-alert/${alertId}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEditing && formData.id) {
        const res = await fetch(`/api/bot/guild/${id}/social-alert/${formData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, enabled: String(formData.enabled) }),
        });
        const data = await res.json();
        if (data.success) {
          setAlerts(prev => prev.map(a => a.id === formData.id ? { ...a, ...formData } as SocialAlert : a));
          closeModal();
        } else {
          setPageAlert({ message: data.message || 'Failed to update', type: 'error' });
          setTimeout(() => setPageAlert(null), 3000);
        }
      } else {
        const res = await fetch(`/api/bot/guild/${id}/social-alert`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, enabled: String(formData.enabled) }),
        });
        const data = await res.json();
        if (data.success) {
          setAlerts(prev => [...prev, { ...data.alert, totalAlerts: 0 } as SocialAlert]);
          closeModal();
        } else {
          setPageAlert({ message: data.message || 'Failed to create', type: 'error' });
          setTimeout(() => setPageAlert(null), 3000);
        }
      }
    } catch {
      setPageAlert({ message: 'Network error', type: 'error' });
      setTimeout(() => setPageAlert(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  // Platform Icons Helper
  const getPlatformIcon = (platform: Platform) => {
     switch (platform) {
        case 'youtube':
           return (
              <svg className="w-5 h-5 text-[#FF0000]" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
           );
        case 'twitch':
           return (
              <svg className="w-5 h-5 text-[#9146FF]" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
              </svg>
           );
        case 'twitter':
           return (
              <svg className="w-5 h-5 text-[#1DA1F2]" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
           );
        case 'instagram':
           return (
              <svg className="w-5 h-5 text-[#E1306C]" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H7zm5 3.5a5.5 5.5 0 110 11 5.5 5.5 0 010-11zm0 2a3.5 3.5 0 100 7 3.5 3.5 0 000-7zm6.25-.75a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5z"/>
              </svg>
           );
        default:
           return null;
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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {pageAlert && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-semibold shadow-lg ${pageAlert.type === 'success' ? 'bg-success/20 text-success border border-success/30' : 'bg-error/20 text-error border border-error/30'}`}>
          {pageAlert.message}
        </div>
      )}
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-border-dark gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <svg className="w-7 h-7 text-discord" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            Social Alerts
          </h1>
          <p className="text-text-secondary text-sm">Get notified when your favorite creators go live or post new content</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
           <button 
             onClick={openAddModal}
             className="bg-discord hover:bg-discord-hover px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 text-white shadow-lg shadow-discord/20"
           >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
             </svg>
             Add Alert
           </button>
           <Link
             href={`/dashboard/guild/${id}`}
             className="text-text-secondary hover:text-white transition-colors duration-200 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-dark-secondary hover:bg-dark-card border border-border-dark"
           >
             <span className="font-medium">Back</span>
           </Link>
        </div>
      </div>

      {/* Main Content */}
      <div>
         {/* Filters */}
         <div className="flex flex-wrap gap-2 mb-8 border-b border-border-dark pb-4">
            <button 
               onClick={() => setActiveFilter('all')} 
               className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${activeFilter === 'all' ? 'bg-discord text-white shadow-md' : 'bg-dark-secondary text-text-secondary hover:text-white hover:bg-dark-card border border-border-dark'}`}
            >
               All Platforms
            </button>
            {(['youtube', 'twitch', 'twitter', 'instagram'] as Platform[]).map((platform) => (
               <button 
                 key={platform}
                 onClick={() => setActiveFilter(platform)} 
                 className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap flex items-center gap-2 capitalize ${activeFilter === platform ? 'bg-discord text-white shadow-md' : 'bg-dark-secondary text-text-secondary hover:text-white hover:bg-dark-card border border-border-dark'}`}
               >
                  {getPlatformIcon(platform)}
                  {platform === 'twitter' ? 'Twitter/X' : platform}
               </button>
            ))}
         </div>

         {/* Alerts Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAlerts.length > 0 ? (
               filteredAlerts.map(alert => (
                  <div key={alert.id} className={`bg-dark-secondary border border-border-dark rounded-xl p-6 hover:border-discord/50 transition-all flex flex-col ${!alert.enabled && 'opacity-75 grayscale-[0.3]'}`}>
                     {/* Card Header */}
                     <div className="flex items-start justify-between mb-5">
                        <div className="flex items-center gap-3">
                           <div className={`p-2.5 rounded-lg bg-dark-card border border-border-dark flex items-center`}>
                              {getPlatformIcon(alert.platform)}
                           </div>
                           <div>
                              <h3 className="font-bold text-white text-lg leading-tight">{alert.username}</h3>
                              <p className="text-xs text-text-secondary capitalize font-medium">{alert.platform === 'twitter' ? 'Twitter/X' : alert.platform}</p>
                           </div>
                        </div>
                        <div className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${alert.enabled ? 'bg-success/10 text-success border-success/20' : 'bg-gray-500/10 text-text-secondary border-gray-500/20'}`}>
                           {alert.enabled ? 'Active' : 'Inactive'}
                        </div>
                     </div>

                     {/* Notification Types Tags */}
                     <div className="flex flex-wrap gap-2 mb-5 flex-1">
                        {alert.notifyLive && <span className="text-[11px] font-semibold bg-[#ED4245]/10 text-[#ED4245] border border-[#ED4245]/30 px-2 py-1 rounded-md flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#ED4245]"></span>Live</span>}
                        {alert.notifyVideo && <span className="text-[11px] font-semibold bg-discord/10 text-discord border border-discord/30 px-2 py-1 rounded-md">🎥 Videos</span>}
                        {alert.notifyPost && <span className="text-[11px] font-semibold bg-[#57F287]/10 text-[#57F287] border border-[#57F287]/30 px-2 py-1 rounded-md">📝 Posts</span>}
                        {!alert.notifyLive && !alert.notifyVideo && !alert.notifyPost && <span className="text-[11px] font-semibold bg-dark-card text-text-secondary border border-border-dark px-2 py-1 rounded-md">No triggers</span>}
                     </div>

                     {/* Stats Banner */}
                     <div className="flex items-center justify-between text-xs text-text-secondary mb-5 bg-dark-card p-3 rounded-lg border border-border-dark font-medium">
                        <div className="flex flex-col">
                           <span className="text-white font-bold text-sm">{alert.totalAlerts.toLocaleString()}</span>
                           <span>Alerts Sent</span>
                        </div>
                        <div className="flex flex-col items-end">
                           <span className={`font-bold text-sm ${alert.checkInterval <= 7 ? 'text-warning' : 'text-discord'}`}>
                              {alert.checkInterval <= 7 ? 'Fast' : 'Slow'}
                           </span>
                           <span>Speed Tier</span>
                        </div>
                     </div>

                     {/* Actions */}
                     <div className="flex gap-2.5 mt-auto pt-4 border-t border-border-dark">
                        <button 
                           onClick={() => openEditModal(alert)}
                           className="flex-1 bg-dark-card hover:bg-discord hover:text-white border border-border-dark hover:border-discord text-text-secondary py-2 rounded-lg text-sm font-semibold transition-all"
                        >
                           Edit
                        </button>
                        <button 
                           onClick={() => handleToggle(alert.id, alert.enabled)}
                           className="px-4 bg-dark-card hover:bg-dark-hover border border-border-dark text-text-secondary hover:text-white py-2 rounded-lg text-sm font-semibold transition-all"
                        >
                           {alert.enabled ? 'Disable' : 'Enable'}
                        </button>
                        <button 
                           onClick={() => handleDelete(alert.id, alert.username)}
                           className="px-3 bg-danger/10 hover:bg-danger text-danger hover:text-white border border-danger/20 hover:border-danger py-2 rounded-lg text-sm font-semibold transition-all"
                        >
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                           </svg>
                        </button>
                     </div>
                  </div>
               ))
            ) : (
               <div className="col-span-full bg-dark-secondary border border-border-dark rounded-xl p-16 text-center shadow-lg">
                  <div className="w-24 h-24 bg-dark-card border border-border-dark rounded-full flex items-center justify-center mx-auto mb-6">
                     <svg className="w-12 h-12 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                     </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">No Social Alerts Found</h3>
                  <p className="text-text-secondary mb-8 max-w-md mx-auto">
                     {activeFilter === 'all' 
                        ? 'Start monitoring your favorite creators by adding your first alert.'
                        : `You don't have any alerts set up for ${activeFilter === 'twitter' ? 'Twitter/X' : activeFilter} yet.`}
                  </p>
                  <button 
                     onClick={openAddModal}
                     className="bg-discord hover:bg-discord-hover px-8 py-3.5 rounded-lg font-semibold transition-all inline-flex items-center gap-2 text-white shadow-lg shadow-discord/20"
                  >
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                     </svg>
                     Add Your First Alert
                  </button>
               </div>
            )}
         </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
         <div 
           className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in"
           onClick={(e) => { if(e.target === e.currentTarget) closeModal() }}
         >
            <div className="bg-dark-secondary border border-border-dark rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
               {/* Modal Header */}
               <div className="px-6 py-5 border-b border-border-dark flex items-center justify-between bg-dark-secondary">
                  <h2 className="text-xl font-bold text-white">{isEditing ? 'Edit Social Alert' : 'Add Social Alert'}</h2>
                  <button onClick={closeModal} className="text-text-secondary hover:text-white transition-colors p-1.5 rounded-md hover:bg-dark-card border border-transparent hover:border-border-dark">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                     </svg>
                  </button>
               </div>

               {/* Modal Body */}
               <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto custom-scrollbar bg-dark-primary">
                  <div className="space-y-6">
                     {/* Platform & Username Row */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                           <label className="block text-sm font-semibold mb-2 text-text-secondary">Platform<span className="text-danger ml-1">*</span></label>
                           <select 
                              value={formData.platform}
                              onChange={(e) => setFormData({...formData, platform: e.target.value as Exclude<Platform, 'all'>})}
                              required 
                              className="w-full bg-dark-card border border-border-dark rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-discord transition-all"
                           >
                              <option value="youtube">YouTube</option>
                              <option value="twitch">Twitch</option>
                              <option value="twitter">Twitter/X</option>
                              <option value="instagram">Instagram</option>
                           </select>
                        </div>
                        <div>
                           <label className="block text-sm font-semibold mb-2 text-text-secondary">Username / ID<span className="text-danger ml-1">*</span></label>
                           <input 
                              type="text" 
                              value={formData.username}
                              onChange={(e) => setFormData({...formData, username: e.target.value})}
                              required 
                              className="w-full bg-dark-card border border-border-dark rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-discord transition-all" 
                              placeholder="e.g. MrBeast"
                           />
                        </div>
                     </div>

                     {/* Channel URL */}
                     <div>
                        <label className="text-sm font-semibold flex justify-between mb-2 text-text-secondary">
                           Channel URL <span className="text-text-secondary font-normal text-xs">(Optional)</span>
                        </label>
                        <input 
                           type="url" 
                           value={formData.channelUrl}
                           onChange={(e) => setFormData({...formData, channelUrl: e.target.value})}
                           className="w-full bg-dark-card border border-border-dark rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-discord transition-all" 
                           placeholder="https://..."
                        />
                     </div>

                     {/* Notification Toggles */}
                     <div className="bg-dark-secondary rounded-xl border border-border-dark p-4">
                        <label className="block text-sm font-bold mb-4 text-white">What should we notify you for?</label>
                        <div className="space-y-3">
                           <label className="flex items-center gap-3 cursor-pointer group">
                              <input 
                                 type="checkbox" 
                                 checked={formData.notifyLive}
                                 onChange={(e) => setFormData({...formData, notifyLive: e.target.checked})}
                                 className="w-5 h-5 rounded border-border-dark bg-dark-card accent-discord cursor-pointer"
                              />
                              <span className="font-medium group-hover:text-white transition-colors">🔴 Notify when going live</span>
                           </label>
                           <label className="flex items-center gap-3 cursor-pointer group">
                              <input 
                                 type="checkbox" 
                                 checked={formData.notifyVideo}
                                 onChange={(e) => setFormData({...formData, notifyVideo: e.target.checked})}
                                 className="w-5 h-5 rounded border-border-dark bg-dark-card accent-discord cursor-pointer"
                              />
                              <span className="font-medium group-hover:text-white transition-colors">🎥 Notify for new videos</span>
                           </label>
                           <label className="flex items-center gap-3 cursor-pointer group">
                              <input 
                                 type="checkbox" 
                                 checked={formData.notifyPost}
                                 onChange={(e) => setFormData({...formData, notifyPost: e.target.checked})}
                                 className="w-5 h-5 rounded border-border-dark bg-dark-card accent-discord cursor-pointer"
                              />
                              <span className="font-medium group-hover:text-white transition-colors">📝 Notify for new posts</span>
                           </label>
                        </div>
                     </div>

                     {/* Discord Config Row */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                           <label className="block text-sm font-semibold mb-2 text-text-secondary">Destination Channel<span className="text-danger ml-1">*</span></label>
                           <select 
                              value={formData.channelId}
                              onChange={(e) => setFormData({...formData, channelId: e.target.value})}
                              required 
                              className="w-full bg-dark-card border border-border-dark rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-discord transition-all"
                           >
                              <option value="">Select a channel...</option>
                              {channels.map(ch => (
                                 <option key={ch.id} value={ch.id}># {ch.name}</option>
                              ))}
                           </select>
                        </div>
                        <div>
                           <label className="text-sm font-semibold flex justify-between mb-2 text-text-secondary">
                              Mention Role <span className="text-text-secondary font-normal text-xs">(Optional)</span>
                           </label>
                           <select 
                              value={formData.customRole}
                              onChange={(e) => setFormData({...formData, customRole: e.target.value})}
                              className="w-full bg-dark-card border border-border-dark rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-discord transition-all"
                           >
                              <option value="">No mention</option>
                              <option value="@everyone">@everyone</option>
                              {roles.map(r => (
                                 <option key={r.id} value={r.id}>@ {r.name}</option>
                              ))}
                           </select>
                        </div>
                     </div>

                     {/* Appearance Row */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                           <label className="block text-sm font-semibold mb-2 text-text-secondary">Embed Color Overlay</label>
                           <div className="flex gap-3 items-center">
                              <input 
                                 type="color" 
                                 value={formData.embedColor}
                                 onChange={(e) => setFormData({...formData, embedColor: e.target.value})}
                                 className="w-12 h-10 rounded cursor-pointer bg-dark-card border border-border-dark p-0.5"
                              />
                              <input 
                                 type="text" 
                                 value={formData.embedColor}
                                 onChange={(e) => setFormData({...formData, embedColor: e.target.value})}
                                 className="w-full bg-dark-card border border-border-dark rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-discord transition-all font-mono text-sm uppercase"
                              />
                           </div>
                        </div>
                        <div>
                           <label className="block text-sm font-semibold mb-2 text-text-secondary mt-1">Check Frequency (API)</label>
                           <select 
                              value={formData.checkInterval! <= 7 ? '5' : '15'}
                              onChange={(e) => setFormData({...formData, checkInterval: parseInt(e.target.value)})}
                              className="w-full bg-dark-card border border-border-dark rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-discord transition-all"
                           >
                              <option value="15">Slow (Recommended - Every 15m)</option>
                              <option value="5">Fast (Every 5m - Premium)</option>
                           </select>
                        </div>
                     </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="flex gap-3 pt-6 mt-6 border-t border-border-dark">
                     <button 
                        type="button" 
                        onClick={closeModal} 
                        className="flex-1 bg-dark-card hover:bg-dark-secondary border border-border-dark px-6 py-3 rounded-lg font-bold transition-all text-white"
                     >
                        Cancel
                     </button>
                     <button 
                        type="submit" 
                        className="flex-1 bg-discord hover:bg-discord-hover shadow-lg shadow-discord/20 px-6 py-3 rounded-lg font-bold text-white transition-all"
                     >
                        {isEditing ? 'Save Changes' : 'Create Alert'}
                     </button>
                  </div>
               </form>
            </div>
         </div>
      )}
    </div>
  );
}
