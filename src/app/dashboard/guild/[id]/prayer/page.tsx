'use client';

import { useState, use, useEffect } from 'react';
import Link from 'next/link';

export default function PrayerTimesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [isEnabled, setIsEnabled] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('Indonesia');
  const [selectedCity, setSelectedCity] = useState('Jakarta');
  const [selectedChannel, setSelectedChannel] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const [notifyTimes, setNotifyTimes] = useState({
    fajr: true,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [channels, setChannels] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    Promise.all([
      fetch(`/api/bot/guild/${id}/prayer`).then(r => r.json()),
      fetch(`/api/bot/guild/${id}/channels`).then(r => r.json()),
    ]).then(([prData, chData]) => {
      if (prData.success && prData.prayerConfig) {
        const p = prData.prayerConfig;
        setIsEnabled(p.enabled ?? false);
        setSelectedCity(p.city ?? 'Jakarta');
        setSelectedCountry(p.country ?? 'Indonesia');
        setSelectedChannel(p.channelId ?? '');
        setNotifyTimes({
          fajr: p.notifyFajr ?? true,
          dhuhr: p.notifyDhuhr ?? true,
          asr: p.notifyAsr ?? true,
          maghrib: p.notifyMaghrib ?? true,
          isha: p.notifyIsha ?? true,
        });
      }
      if (chData.success) setChannels(chData.channels ?? []);
    }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const handleToggleTime = (time: keyof typeof notifyTimes) => {
    setNotifyTimes(prev => ({ ...prev, [time]: !prev[time] }));
    setHasUnsavedChanges(true);
  };

  const handleFormChange = () => {
    setHasUnsavedChanges(true);
  };

  const activePrayersCount = Object.values(notifyTimes).filter(Boolean).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-discord"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {alert && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-semibold shadow-lg ${alert.type === 'success' ? 'bg-success/20 text-success border border-success/30' : 'bg-error/20 text-error border border-error/30'}`}>
          {alert.message}
        </div>
      )}
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-border-dark gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Prayer Times</h1>
          <p className="text-text-secondary text-sm mt-1">Configure Islamic prayer times notifications for your server</p>
        </div>
        <Link
          href={`/dashboard/guild/${id}`}
          className="text-text-secondary hover:text-discord transition-colors duration-200 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-dark-secondary w-fit"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Back to Server Actions</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Settings Form */}
        <div className="lg:col-span-2 space-y-6">
          <form className="space-y-6" onChange={handleFormChange}>
            {/* Enable/Disable */}
            <div className="bg-dark-secondary border border-border-dark rounded-xl p-6 hover:border-discord/50 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-1">Prayer Times Notifications</h2>
                  <p className="text-text-secondary text-sm">Aktifkan notifikasi waktu sholat otomatis</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isEnabled}
                    onChange={(e) => {
                        setIsEnabled(e.target.checked);
                        handleFormChange();
                    }}
                  />
                  <div className="w-14 h-7 bg-dark-card peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-discord"></div>
                </label>
              </div>
            </div>

            {/* Location Settings */}
            <div className={`bg-dark-secondary border border-border-dark rounded-xl p-6 hover:border-discord/50 transition-all duration-300 ${!isEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-discord/10 rounded-lg">
                  <svg className="w-5 h-5 text-discord" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Location Settings</h2>
                  <p className="text-text-secondary text-sm">Set your location for accurate prayer times</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Country<span className="text-danger ml-1">*</span></label>
                  <select 
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full bg-dark-card border border-border-dark rounded-lg px-4 py-2.5 focus:outline-none focus:border-discord transition-all text-white"
                  >
                    <option value="Indonesia">🇮🇩 Indonesia</option>
                    <option value="Malaysia">🇲🇾 Malaysia</option>
                    <option value="Singapore">🇸🇬 Singapore</option>
                    <option value="Brunei">🇧🇳 Brunei</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">City<span className="text-danger ml-1">*</span></label>
                  <select 
                     value={selectedCity}
                     onChange={(e) => setSelectedCity(e.target.value)}
                     className="w-full bg-dark-card border border-border-dark rounded-lg px-4 py-2.5 focus:outline-none focus:border-discord transition-all text-white"
                  >
                    <optgroup label="Indonesia">
                      <option value="Jakarta">Jakarta</option>
                      <option value="Surabaya">Surabaya</option>
                      <option value="Bandung">Bandung</option>
                    </optgroup>
                  </select>
                </div>
              </div>
            </div>

            {/* Channel Settings */}
            <div className={`bg-dark-secondary border border-border-dark rounded-xl p-6 hover:border-discord/50 transition-all duration-300 ${!isEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-discord/10 rounded-lg">
                  <svg className="w-5 h-5 text-discord" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Notification Channel<span className="text-danger ml-2">*</span></h2>
                  <p className="text-text-secondary text-sm">Choose where to send prayer notifications</p>
                </div>
              </div>
              <div>
                <select 
                   value={selectedChannel}
                   onChange={(e) => setSelectedChannel(e.target.value)}
                   className="w-full bg-dark-card border border-border-dark rounded-lg px-4 py-2.5 focus:outline-none focus:border-discord transition-all text-white"
                >
                  <option value="">Select text channel...</option>
                  {channels.map(ch => (
                    <option key={ch.id} value={ch.id}># {ch.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Prayer Times Selection */}
            <div className={`bg-dark-secondary border border-border-dark rounded-xl p-6 hover:border-discord/50 transition-all duration-300 ${!isEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-discord/10 rounded-lg">
                  <svg className="w-5 h-5 text-discord" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Prayer Times to Notify</h2>
                  <p className="text-text-secondary text-sm">Select which prayer times to notify</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { id: 'fajr', emoji: '🌅', name: 'Fajr', sub: '(Subuh)' },
                  { id: 'dhuhr', emoji: '☀️', name: 'Dhuhr', sub: '(Dzuhur)' },
                  { id: 'asr', emoji: '🌤️', name: 'Asr', sub: '(Ashar)' },
                  { id: 'maghrib', emoji: '🌇', name: 'Maghrib', sub: '' },
                  { id: 'isha', emoji: '🌙', name: 'Isha', sub: '(Isya)' }
                ].map((prayer) => (
                  <label key={prayer.id} className="flex items-center gap-3 p-3 bg-dark-card border border-border-dark rounded-lg hover:border-discord transition-all cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={notifyTimes[prayer.id as keyof typeof notifyTimes]}
                      onChange={() => handleToggleTime(prayer.id as keyof typeof notifyTimes)}
                      className="w-5 h-5 accent-discord cursor-pointer rounded border-gray-600 bg-gray-700"
                    />
                    <div className="flex items-center gap-2">
                       <span className="text-2xl">{prayer.emoji}</span>
                       <div>
                          <span className="font-medium group-hover:text-discord transition-colors">{prayer.name}</span>
                          {prayer.sub && <span className="text-text-secondary text-sm ml-1">{prayer.sub}</span>}
                       </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Custom Message */}
            <div className={`bg-dark-secondary border border-border-dark rounded-xl p-6 hover:border-discord/50 transition-all duration-300 ${!isEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-discord/10 rounded-lg">
                  <svg className="w-5 h-5 text-discord" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Custom Message</h2>
                  <p className="text-text-secondary text-sm">Personalize your notification message</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Notification Message (Optional)</label>
                <textarea 
                  rows={3}
                  className="w-full bg-dark-card border border-border-dark rounded-lg px-4 py-2.5 focus:outline-none focus:border-discord transition-all resize-none text-white custom-scrollbar"
                  placeholder="🕌 Waktunya sholat {prayer}!"
                />
                <p className="text-text-secondary text-xs mt-2 flex items-center gap-1">
                  Use <code className="px-1.5 py-0.5 bg-dark-card rounded text-discord">{`{prayer}`}</code> placeholder for prayer name
                </p>
              </div>
            </div>
            
            {/* Save CTA */}
            {hasUnsavedChanges && (
               <div className="fixed bottom-6 right-6 z-50 bg-dark-secondary text-white px-4 py-3 rounded-lg shadow-lg border border-border-dark flex items-center gap-4 text-sm font-semibold animate-in slide-in-from-bottom-5">
                  <span className="flex items-center gap-2">
                     Unsaved changes detected
                  </span>
                  <div className="flex gap-2">
                     <button 
                       type="button" 
                       onClick={() => { setHasUnsavedChanges(false); window.location.reload(); }}
                       className="px-3 py-1.5 hover:bg-dark-card rounded transition-colors text-sm font-medium"
                     >
                       Reset
                     </button>
                     <button 
                       type="button"
                       disabled={saving}
                       onClick={async () => {
                         setSaving(true);
                         try {
                           const res = await fetch(`/api/bot/guild/${id}/prayer`, {
                             method: 'POST',
                             headers: { 'Content-Type': 'application/json' },
                             body: JSON.stringify({
                               enabled: isEnabled,
                               city: selectedCity,
                               country: selectedCountry,
                               channelId: selectedChannel || null,
                               notifyFajr: notifyTimes.fajr,
                               notifyDhuhr: notifyTimes.dhuhr,
                               notifyAsr: notifyTimes.asr,
                               notifyMaghrib: notifyTimes.maghrib,
                               notifyIsha: notifyTimes.isha,
                             }),
                           });
                           const data = await res.json();
                           if (data.success) {
                             setHasUnsavedChanges(false);
                             setAlert({ message: 'Prayer settings saved!', type: 'success' });
                           } else {
                             setAlert({ message: data.error || 'Failed to save', type: 'error' });
                           }
                         } catch {
                           setAlert({ message: 'Network error', type: 'error' });
                         } finally {
                           setSaving(false);
                           setTimeout(() => setAlert(null), 3000);
                         }
                       }}
                       className="bg-discord hover:bg-discord-hover disabled:opacity-50 px-4 py-1.5 rounded-md text-sm font-bold transition-colors"
                     >
                       {saving ? 'Saving…' : 'Save Settings'}
                     </button>
                  </div>
               </div>
            )}
          </form>
        </div>

        {/* Right Column: Info Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-dark-secondary border border-border-dark rounded-xl p-6 sticky top-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-discord/10 rounded-lg">
                <svg className="w-6 h-6 text-discord" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold">Current Status</h3>
            </div>

            <div className="space-y-4">
              {/* Status Badge */}
              <div className="flex items-center justify-between p-3 bg-dark-card rounded-lg">
                <span className="text-sm text-text-secondary">Prayer Notifications</span>
                {isEnabled ? (
                  <span className="px-2.5 py-1 bg-success/10 text-success text-xs font-semibold rounded-full border border-success/30">
                    ✓ Enabled
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-gray-500/10 text-gray-400 text-xs font-semibold rounded-full border border-gray-500/30">
                    ✗ Disabled
                  </span>
                )}
              </div>

              {/* Location Info */}
              {isEnabled && (
                 <div className="p-3 bg-dark-card rounded-lg">
                   <p className="text-xs text-text-secondary mb-1">Location</p>
                   <p className="text-sm font-medium text-white">
                     {selectedCity}, {selectedCountry}
                   </p>
                 </div>
              )}

              {/* Active Prayers Count */}
              <div className="p-3 bg-dark-card rounded-lg">
                <p className="text-xs text-text-secondary mb-1">Active Prayers</p>
                <p className="text-2xl font-bold text-discord">
                  {activePrayersCount}/5
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
