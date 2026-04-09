'use client';

import { useState, use, useEffect } from 'react';
import Link from 'next/link';

export default function WelcomeMessagesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isDmEnabled, setIsDmEnabled] = useState(false);
  const [useEmbed, setUseEmbed] = useState(false);
  const [useCustomImage, setUseCustomImage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState('');
  
  const [messageText, setMessageText] = useState('Welcome {{mention}} to {{server}}!');
  const [memberCountText, setMemberCountText] = useState('You are the [membercount.ordinal] member!');
  const [embedTitle, setEmbedTitle] = useState('Welcome!');
  const [embedDesc, setEmbedDesc] = useState('Glad to have you here, {{mention}}!');
  
  const [showPlaceholders, setShowPlaceholders] = useState(false);
  const [showSubTextPlaceholders, setShowSubTextPlaceholders] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [channels, setChannels] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    Promise.all([
      fetch(`/api/bot/guild/${id}/welcome`).then(r => r.json()),
      fetch(`/api/bot/guild/${id}/channels`).then(r => r.json()),
    ]).then(([wData, chData]) => {
      if (wData.success && wData.welcomeConfig) {
        const w = wData.welcomeConfig;
        setIsEnabled(w.enabled ?? false);
        setIsDmEnabled(w.dmEnabled ?? false);
        setSelectedChannel(w.channelId ?? '');
        setMessageText(w.message ?? 'Welcome {{mention}} to {{server}}!');
        setEmbedTitle(w.embedTitle ?? 'Welcome!');
        setEmbedDesc(w.embedDescription ?? 'Glad to have you here, {{mention}}!');
        setMemberCountText(w.memberCountText !== null && w.memberCountText !== undefined ? w.memberCountText : 'You are the [membercount.ordinal] member!');
      }
      if (chData.success) setChannels(chData.channels ?? []);
    }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const handleFormChange = () => {
    setHasUnsavedChanges(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/bot/guild/${id}/welcome`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enabled: isEnabled,
          dmEnabled: isDmEnabled,
          channelId: selectedChannel || null,
          message: messageText,
          embedTitle,
          embedDescription: embedDesc,
          memberCountText,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setHasUnsavedChanges(false);
        setAlert({ message: 'Welcome settings saved!', type: 'success' });
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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {alert && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-semibold shadow-lg ${alert.type === 'success' ? 'bg-success/20 text-success border border-success/30' : 'bg-error/20 text-error border border-error/30'}`}>
          {alert.message}
        </div>
      )}
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-border-dark gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Messages</h1>
          <p className="text-text-secondary text-sm">Customize advanced welcome messages for your community</p>
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
                  <h2 className="text-xl font-bold mb-1">Enable Welcome Messages</h2>
                  <p className="text-text-secondary text-sm">Send a message when users join your server</p>
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

            {/* Destination Settings */}
            <div className={`bg-dark-secondary border border-border-dark rounded-xl p-6 transition-all duration-300 ${!isEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
              <h2 className="text-lg font-semibold mb-4">Channel Destination<span className="text-danger ml-2">*</span></h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Select channel to send welcome messages</label>
                  <select 
                     value={selectedChannel}
                     onChange={(e) => setSelectedChannel(e.target.value)}
                     className="w-full bg-dark-card border border-border-dark rounded-lg px-4 py-2.5 focus:outline-none focus:border-discord transition-all text-white"
                  >
                    <option value="">Select channel...</option>
                    {channels.map(ch => (
                      <option key={ch.id} value={ch.id}># {ch.name}</option>
                    ))}
                  </select>
                </div>
                <label className="flex items-center gap-3 cursor-pointer mt-4">
                  <input 
                    type="checkbox" 
                    checked={isDmEnabled}
                    onChange={(e) => setIsDmEnabled(e.target.checked)}
                    className="w-5 h-5 accent-discord rounded border-border-dark bg-dark-card" 
                  />
                  <span className="text-text-secondary text-sm font-medium">Send Direct Message to user</span>
                </label>
              </div>
            </div>

            {/* Message Template */}
            <div className={`bg-dark-secondary border border-border-dark rounded-xl p-6 transition-all duration-300 ${!isEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
               <h2 className="text-lg font-semibold mb-4">Message Template</h2>
               <div className="space-y-6">
                  <div>
                    <div className="flex justify-between relative">
                       <label className="block text-sm font-medium mb-2">Plain Message</label>
                       <button 
                         type="button" 
                         className="text-discord hover:text-discord-hover transition-colors"
                         onClick={() => setShowPlaceholders(!showPlaceholders)}
                       >
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                         </svg>
                       </button>

                       {/* Placeholder dropdown */}
                       {showPlaceholders && (
                          <div className="absolute right-0 top-8 mt-2 w-72 bg-dark-card border border-border-dark rounded-xl shadow-xl z-50 p-4 max-h-80 overflow-y-auto custom-scrollbar">
                             <h3 className="font-semibold text-sm mb-3 text-discord">Available Placeholders</h3>
                             <ul className="space-y-1 text-xs">
                                {[
                                   { tag: '[user.mention]', desc: 'mention user' },
                                   { tag: '[user.username]', desc: 'username only' },
                                   { tag: '[server.name]', desc: 'server name' },
                                   { tag: '[membercount]', desc: 'total member count' },
                                   { tag: '[membercount.ordinal]', desc: 'with ordinal (1st, 2nd)' },
                                ].map((p, idx) => (
                                   <li key={idx} onClick={() => copyToClipboard(p.tag)} className="cursor-pointer hover:bg-dark-hover p-2 rounded transition-colors wrap-break-word">
                                      <span className="font-bold text-discord block mb-1">{p.tag}</span>
                                      <span className="text-text-secondary">{p.desc}</span>
                                   </li>
                                ))}
                             </ul>
                          </div>
                       )}
                    </div>
                    <textarea 
                       rows={4}
                       value={messageText}
                       onChange={(e) => setMessageText(e.target.value)}
                       className="w-full bg-dark-card border border-border-dark rounded-lg px-4 py-2.5 focus:outline-none focus:border-discord transition-all font-mono text-sm resize-y custom-scrollbar text-white mt-2"
                       placeholder="Welcome [user.mention] to [server.name]!"
                    />
                  </div>

                  {/* Embed Settings */}
                  <div className="border-t border-border-dark pt-6">
                     <div className="flex items-center justify-between p-4 bg-dark-card rounded-lg mb-4">
                        <div>
                           <div className="font-medium text-sm">Use Embed Message</div>
                           <div className="text-text-secondary text-xs mt-0.5">Display welcome message as a rich embed</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={useEmbed}
                            onChange={(e) => setUseEmbed(e.target.checked)}
                          />
                          <div className="w-11 h-6 bg-dark-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-discord"></div>
                        </label>
                     </div>

                     {useEmbed && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                           <div>
                              <label className="block text-sm font-medium mb-2">Embed Title</label>
                              <input 
                                type="text" 
                                value={embedTitle}
                                onChange={(e) => setEmbedTitle(e.target.value)}
                                className="w-full bg-dark-card border border-border-dark rounded-lg px-4 py-2.5 focus:outline-none focus:border-discord transition-all text-white" 
                              />
                           </div>
                           <div>
                              <label className="block text-sm font-medium mb-2">Embed Description</label>
                              <textarea 
                                rows={3}
                                value={embedDesc}
                                onChange={(e) => setEmbedDesc(e.target.value)}
                                className="w-full bg-dark-card border border-border-dark rounded-lg px-4 py-2.5 focus:outline-none focus:border-discord transition-all font-mono text-sm resize-y custom-scrollbar text-white" 
                              />
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div>
                                 <label className="block text-sm font-medium mb-2">Color Hex</label>
                                 <input type="text" placeholder="#5865F2" className="w-full bg-dark-card border border-border-dark rounded-lg px-4 py-2.5 focus:outline-none focus:border-discord transition-all font-mono text-white" />
                              </div>
                              <div>
                                 <label className="block text-sm font-medium mb-2">Image URL</label>
                                 <input type="text" placeholder="https://..." className="w-full bg-dark-card border border-border-dark rounded-lg px-4 py-2.5 focus:outline-none focus:border-discord transition-all text-white" />
                              </div>
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            </div>

            {/* Custom Welcome Image Generator */}
            <div className={`bg-dark-secondary border border-border-dark rounded-xl p-6 transition-all duration-300 ${!isEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
               <div className="flex items-center justify-between mb-6">
                  <div>
                     <h2 className="text-lg font-semibold">Custom Welcome Image</h2>
                     <p className="text-text-secondary text-sm mt-1">Generate a beautiful custom image card for new members</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={useCustomImage}
                      onChange={(e) => setUseCustomImage(e.target.checked)}
                    />
                    <div className="w-14 h-7 bg-dark-card peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-discord"></div>
                  </label>
               </div>

               {useCustomImage && (
                 <div className="space-y-6 animate-in fade-in slide-in-from-top-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-border-dark pt-6">
                       <div>
                          <label className="block text-sm font-medium mb-2">Layout</label>
                          <select className="w-full bg-dark-card border border-border-dark rounded-lg px-4 py-2.5 focus:outline-none focus:border-discord transition-all text-white">
                             <option value="simple">Simple (Center)</option>
                             <option value="left">Avatar Left</option>
                             <option value="right">Avatar Right</option>
                             <option value="text">Text Only</option>
                          </select>
                       </div>
                       <div>
                          <label className="block text-sm font-medium mb-2">Avatar Shape</label>
                          <select className="w-full bg-dark-card border border-border-dark rounded-lg px-4 py-2.5 focus:outline-none focus:border-discord transition-all text-white">
                             <option value="circle">Circle</option>
                             <option value="square">Square</option>
                          </select>
                       </div>
                       <div>
                          <label className="block text-sm font-medium mb-2">Font</label>
                          <select className="w-full bg-dark-card border border-border-dark rounded-lg px-4 py-2.5 focus:outline-none focus:border-discord transition-all text-white">
                             <option value="gg sans">gg sans (Discord)</option>
                             <option value="Arial">Arial</option>
                             <option value="Impact">Impact</option>
                          </select>
                       </div>
                    </div>

                    <div>
                       <div className="flex justify-between relative">
                          <label className="block text-sm font-medium mb-2">Custom Sub-text Message</label>
                          <button 
                            type="button" 
                            className="text-discord hover:text-discord-hover transition-colors"
                            onClick={() => setShowSubTextPlaceholders(!showSubTextPlaceholders)}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>

                          {/* Placeholder dropdown */}
                          {showSubTextPlaceholders && (
                             <div className="absolute right-0 top-8 mt-2 w-72 bg-dark-card border border-border-dark rounded-xl shadow-xl z-50 p-4 max-h-80 overflow-y-auto custom-scrollbar">
                                <h3 className="font-semibold text-sm mb-3 text-discord">Available Placeholders</h3>
                                <ul className="space-y-1 text-xs">
                                   {[
                                      { tag: '[user.mention]', desc: 'mention user' },
                                      { tag: '[user.username]', desc: 'username only' },
                                      { tag: '[server.name]', desc: 'server name' },
                                      { tag: '[membercount]', desc: 'total member count' },
                                      { tag: '[membercount.ordinal]', desc: 'with ordinal (1st, 2nd)' },
                                   ].map((p, idx) => (
                                      <li key={idx} onClick={() => copyToClipboard(p.tag)} className="cursor-pointer hover:bg-dark-hover p-2 rounded transition-colors wrap-break-word">
                                         <span className="font-bold text-discord block mb-1">{p.tag}</span>
                                         <span className="text-text-secondary">{p.desc}</span>
                                      </li>
                                   ))}
                                </ul>
                             </div>
                          )}
                       </div>
                       <input 
                         type="text" 
                         value={memberCountText}
                         onChange={(e) => {
                             setMemberCountText(e.target.value);
                             handleFormChange();
                         }}
                         className="w-full bg-dark-card border border-border-dark rounded-lg px-4 py-2.5 focus:outline-none focus:border-discord transition-all text-white" 
                         placeholder="You are the [membercount.ordinal] member!"
                       />
                       <p className="text-xs text-text-secondary mt-2">Text to display below username. Use placeholders or clear to hide (if empty, it will be hidden).</p>
                    </div>

                    {/* Background selector placeholder */}
                    <div className="relative">
                       <label className="block text-sm font-medium mb-2">Background Select</label>
                       <button 
                         type="button" 
                         onClick={() => setShowImageGallery(!showImageGallery)}
                         className="w-full flex items-center justify-between px-4 py-3 bg-dark-card border border-border-dark rounded-lg hover:border-discord transition-colors"
                       >
                         <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded bg-[#23272A] border border-border-dark"></div>
                           <span>Dark Background</span>
                         </div>
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                         </svg>
                       </button>

                       {showImageGallery && (
                         <div className="absolute top-full mt-2 left-0 w-full bg-dark-secondary border border-border-dark rounded-xl shadow-xl z-20 p-4">
                           <p className="text-xs font-bold text-discord mb-3 uppercase tracking-wide">Solid Colors</p>
                           <div className="grid grid-cols-3 gap-3">
                              <div className="h-16 bg-[#23272A] rounded-lg cursor-pointer border-2 border-transparent hover:border-discord flex items-center justify-center font-semibold">Dark</div>
                              <div className="h-16 bg-discord rounded-lg cursor-pointer border-2 border-transparent hover:border-white flex items-center justify-center font-semibold">Blurple</div>
                              <div className="h-16 bg-[#57F287] rounded-lg cursor-pointer border-2 border-transparent hover:border-white text-dark-bg flex items-center justify-center font-semibold">Green</div>
                           </div>
                           {/* Intentionally omitting full gallery for brevity in MVP port */}
                         </div>
                       )}
                    </div>

                 </div>
               )}
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
                       onClick={handleSave}
                       className="bg-discord hover:bg-discord-hover disabled:opacity-50 px-4 py-1.5 rounded-md text-sm font-bold transition-colors"
                     >
                       {saving ? 'Saving…' : 'Save Settings'}
                     </button>
                  </div>
               </div>
            )}
          </form>
        </div>

        {/* Right Column: Previews */}
        <div className="lg:col-span-1 border-l border-border-dark lg:pl-6 space-y-6">
           {/* Plain message Preview */}
           <div className="bg-dark-secondary border border-border-dark rounded-xl p-6">
              <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-4">Message Preview</h3>
              <div className="bg-dark-card p-4 rounded-lg text-sm wrap-break-word whitespace-pre-wrap text-white">
                 {messageText.length > 0 ? (
                    messageText
                      .replace(/\[user\.mention\]/g, '<span class="text-discord bg-discord/10 px-1 rounded cursor-pointer">@NewUser</span>')
                      .replace(/\[user\.username\]/g, 'NewUser')
                      .replace(/\[server\.name\]/g, '<strong>Your Server</strong>')
                      .replace(/\[membercount\]/g, '1,235')
                      .replace(/\[membercount\.ordinal\]/g, '1,235th')
                 ) : (
                    <em className="text-text-secondary">Type a message to preview...</em>
                 )}
              </div>
           </div>

           {/* Embed preview */}
           {useEmbed && (
              <div className="bg-dark-secondary border border-border-dark rounded-xl p-6 animate-in slide-in-from-right-4">
                 <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-4">Embed Preview</h3>
                 <div className="border-l-4 border-discord bg-dark-card rounded-r-lg p-4 shadow-lg">
                    <div className="font-bold text-base mb-1 text-white">{embedTitle || 'Welcome!'}</div>
                    <div className="text-gray-300 text-sm">{embedDesc || 'Your embed description will appear here'}</div>
                 </div>
              </div>
           )}

           {/* Image Generator Preview */}
           {useCustomImage && (
             <div className="bg-dark-secondary border border-border-dark rounded-xl p-6 animate-in slide-in-from-bottom-4">
                <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-4">Image Card Preview</h3>
                <div className="aspect-2/1 w-full bg-[#23272A] rounded-lg border border-border-dark flex flex-col items-center justify-center p-4 relative overflow-hidden">
                   {/* Mock Canvas Preview */}
                   <div className="w-16 h-16 bg-discord rounded-full border-4 border-[#23272A] z-10 -mb-8 relative flex items-center justify-center font-bold text-xl uppercase">
                      Usr
                   </div>
                   <div className="bg-white/5 backdrop-blur-sm pt-10 pb-4 px-6 rounded-xl w-full text-center mt-2 relative z-0">
                      <h4 className="text-white font-bold text-lg">WELCOME TO SERVER</h4>
                      <p className="text-discord font-medium">NewUser#1234</p>
                      <p className="text-text-secondary text-xs mt-2">You are the 1,235th member!</p>
                   </div>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
