'use client';

import { useState, use, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import SaveCTA from '@/components/dashboard/SaveCTA';

const PRESET_COLORS = ['#FFFFFF', '#000000', '#5865F2', '#ED4245', '#57F287', '#FEE75C', '#EB459E', '#23272A'];

export default function WelcomeMessagesPage({ params }: { params: Promise<{ id: string }> }) {
   const { id } = use(params);
   const { data: session } = useSession();

   const userName = session?.user?.name || 'NewUser';
   const userAvatar = session?.user?.image || null;

   const [isEnabled, setIsEnabled] = useState(false);
   const [isDmEnabled, setIsDmEnabled] = useState(false);
   const [useEmbed, setUseEmbed] = useState(false);
   const [useCustomImage, setUseCustomImage] = useState(false);
   const [loading, setLoading] = useState(true);
   const [saving, setSaving] = useState(false);
   const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

   const [initialState, setInitialState] = useState<any>(null);
   const [selectedChannel, setSelectedChannel] = useState('');

   const [messageText, setMessageText] = useState('Welcome {{mention}} to {{server}}!');
   const [memberCountText, setMemberCountText] = useState('');
   const [embedTitle, setEmbedTitle] = useState('Welcome!');
   const [embedDesc, setEmbedDesc] = useState('Glad to have you here, {{mention}}!');
   const [bgImageUrl, setBgImageUrl] = useState('');

   const [layout, setLayout] = useState('simple');
   const [avatarShape, setAvatarShape] = useState('circle');
   const [font, setFont] = useState('gg sans');

   const [circleColor, setCircleColor] = useState('#FFFFFF');
   const [titleColor, setTitleColor] = useState('#FFFFFF');
   const [usernameColor, setUsernameColor] = useState('#FFFFFF');
   const [messageColor, setMessageColor] = useState('#B9BBBE');
   const [overlayColor, setOverlayColor] = useState('#000000');
   const [overlayOpacity, setOverlayOpacity] = useState(50);
   const [bgColor, setBgColor] = useState('#23272A');

   const [showPlaceholders, setShowPlaceholders] = useState(false);
   const [showSubTextPlaceholders, setShowSubTextPlaceholders] = useState(false);
   const [showImageGallery, setShowImageGallery] = useState(false);
   const [channels, setChannels] = useState<{ id: string; name: string }[]>([]);
   const [guildName, setGuildName] = useState('Your Server');
   const [memberCount, setMemberCount] = useState(1235);

   const getOrdinal = (n: number) => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return n.toLocaleString() + (s[(v - 20) % 10] || s[v] || s[0]);
   };

   useEffect(() => {
      Promise.all([
         fetch(`/api/bot/guild/${id}/welcome`).then(r => r.json()),
         fetch(`/api/bot/guild/${id}/channels`).then(r => r.json()),
         fetch(`/api/bot/guild/${id}/info`).then(r => r.json()),
      ]).then(([wData, chData, infoData]) => {
         if (wData.success && wData.welcomeConfig) {
            const w = wData.welcomeConfig;
            setIsEnabled(w.enabled ?? false);
            setIsDmEnabled(w.dmEnabled ?? false);
            setUseEmbed(w.useEmbed ?? false);
            setUseCustomImage(w.useCustomImage ?? false);
            setSelectedChannel(w.channelId ?? '');
            setMessageText(w.message ?? 'Welcome {{mention}} to {{server}}!');
            setEmbedTitle(w.embedTitle ?? 'Welcome!');
            setEmbedDesc(w.embedDescription ?? 'Glad to have you here, {{mention}}!');
            setMemberCountText(w.memberCountText !== null && w.memberCountText !== undefined ? w.memberCountText : '');
            setBgImageUrl(w.bgImageUrl ?? '');
            setLayout(['simple', 'left', 'right', 'text'].includes(w.layout) ? w.layout : 'simple');
            setAvatarShape(['circle', 'square'].includes(w.avatarShape) ? w.avatarShape : 'circle');
            setFont(w.font || 'gg sans');
            setCircleColor(w.circleColor || '#FFFFFF');
            setTitleColor(w.titleColor || '#FFFFFF');
            setUsernameColor(w.usernameColor || '#FFFFFF');
            setMessageColor(w.messageColor || '#B9BBBE');
            setOverlayColor(w.overlayColor || '#000000');
            setOverlayOpacity(w.overlayOpacity ?? 50);
            setBgColor(w.bgColor || '#23272A');
            
            setInitialState({
               enabled: w.enabled ?? false,
               dmEnabled: w.dmEnabled ?? false,
               channelId: (w.channelId ?? '') || null,
               message: w.message ?? 'Welcome {{mention}} to {{server}}!',
               embedTitle: w.embedTitle ?? 'Welcome!',
               embedDescription: w.embedDescription ?? 'Glad to have you here, {{mention}}!',
               memberCountText: w.memberCountText !== null && w.memberCountText !== undefined ? w.memberCountText : '',
               bgImageUrl: w.bgImageUrl ?? '',
               bgColor: w.bgColor || '#23272A',
               circleColor: w.circleColor || '#FFFFFF',
               titleColor: w.titleColor || '#FFFFFF',
               usernameColor: w.usernameColor || '#FFFFFF',
               messageColor: w.messageColor || '#B9BBBE',
               overlayColor: w.overlayColor || '#000000',
               overlayOpacity: w.overlayOpacity ?? 50,
               layout: ['simple', 'left', 'right', 'text'].includes(w.layout) ? w.layout : 'simple',
               avatarShape: ['circle', 'square'].includes(w.avatarShape) ? w.avatarShape : 'circle',
               font: w.font || 'gg sans',
               useCustomImage: w.useCustomImage ?? false,
               useEmbed: w.useEmbed ?? false,
            });
         }
         if (chData.success) setChannels(chData.channels ?? []);
         if (infoData && infoData.success) {
            setGuildName(infoData.name || 'Your Server');
            setMemberCount(infoData.memberCount || 1235);
         }
      }).catch(console.error).finally(() => setLoading(false));
   }, [id]);

   const handleFormChange = () => {
      // Handled dynamically by state comparison
   };

   const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
   };

   const currentState = {
      enabled: isEnabled,
      dmEnabled: isDmEnabled,
      channelId: selectedChannel || null,
      message: messageText,
      embedTitle,
      embedDescription: embedDesc,
      memberCountText,
      bgImageUrl,
      bgColor,
      circleColor,
      titleColor,
      usernameColor,
      messageColor,
      overlayColor,
      overlayOpacity,
      layout,
      avatarShape,
      font,
      useCustomImage,
      useEmbed,
   };

   const hasUnsavedChanges = initialState !== null && JSON.stringify(initialState) !== JSON.stringify(currentState);

   const handleSave = async () => {
      setSaving(true);
      try {
         const res = await fetch(`/api/bot/guild/${id}/welcome`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentState),
         });
         const data = await res.json();
         if (data.success) {
            setInitialState(currentState);
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

   const parseDiscordText = (text: string, isTitle: boolean = false) => {
      let parsed = text
         .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

      const mentionHtml = isTitle ? `@${userName}` : `<span class="text-discord bg-discord/10 px-1 rounded cursor-pointer">@${userName}</span>`;
      const serverHtml = isTitle ? guildName : `<strong>${guildName}</strong>`;

      parsed = parsed
         .replace(/\[user\.mention\]/g, mentionHtml)
         .replace(/\[user\.username\]/g, userName)
         .replace(/\[server\.name\]/g, serverHtml)
         .replace(/\[membercount\]/g, memberCount.toLocaleString())
         .replace(/\[membercount\.ordinal\]/g, getOrdinal(memberCount))
         .replace(/\[#(\d+)\]/g, (match, chId) => {
            const ch = channels.find(c => c.id === chId);
            const chName = ch ? ch.name : 'channel';
            return isTitle ? `#${chName}` : `<span class="text-discord bg-discord/10 px-1 rounded cursor-pointer">#${chName}</span>`;
         })
         .replace(/&lt;#(\d+)&gt;/g, (match, chId) => {
            const ch = channels.find(c => c.id === chId);
            const chName = ch ? ch.name : 'channel';
            return isTitle ? `#${chName}` : `<span class="text-discord bg-discord/10 px-1 rounded cursor-pointer">#${chName}</span>`;
         });

      parsed = parsed
         .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
         .replace(/__(.*?)__/g, '<u>$1</u>')
         .replace(/\*(.*?)\*/g, '<em>$1</em>')
         .replace(/_(.*?)_/g, '<em>$1</em>')
         .replace(/~~(.*?)~~/g, '<s>$1</s>')
         .replace(/`([^`]+)`/g, '<code class="bg-[#202225] text-[#dcddde] px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
         .replace(/\|\|(.*?)\|\|/g, '<span class="bg-[#202225] text-transparent hover:text-[#dcddde] rounded px-1 cursor-pointer transition-colors" title="Spoiler">$1</span>');

      return parsed;
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

         <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Left Column: Settings Form */}
            <div className="xl:col-span-7 space-y-6">
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
                           {/* Live Preview Container */}
                           <div className="mb-8 bg-dark-card border border-border-dark rounded-2xl shadow-xl overflow-hidden">
                              <div className="p-4 sm:p-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-dark-card">
                                 <div className={`aspect-video w-full max-w-3xl mx-auto ${!bgImageUrl ? '' : 'bg-cover bg-center'} rounded-xl border-2 border-border-dark flex ${layout === 'text' ? 'flex-col items-center justify-center' : layout === 'left' ? 'flex-row items-center justify-start pl-12 sm:pl-16' : layout === 'right' ? 'flex-row-reverse items-center justify-start pr-12 sm:pr-16' : 'flex-col items-center justify-center'} p-8 sm:p-12 relative overflow-hidden shadow-2xl transition-all duration-300`} style={bgImageUrl ? { backgroundImage: `url(${bgImageUrl})`, backgroundColor: bgColor } : { backgroundColor: bgColor }}>
                                    {/* Mock Canvas Preview */}
                                    <div className="absolute inset-0 z-0" style={{ backgroundColor: overlayColor, opacity: overlayOpacity / 100 }}></div>
                                    {layout !== 'text' && (
                                       <div className={`w-24 h-24 sm:w-32 sm:h-32 bg-discord ${avatarShape === 'circle' ? 'rounded-full' : 'rounded-none'} border-2 sm:border-4 z-10 ${layout === 'left' || layout === 'right' ? 'mx-6 sm:mx-8' : '-mb-12 sm:-mb-16'} relative flex items-center justify-center font-bold text-3xl sm:text-4xl uppercase shrink-0 shadow-lg bg-cover bg-center overflow-hidden`} style={{ borderColor: circleColor, backgroundImage: userAvatar ? `url(${userAvatar})` : undefined }}>
                                          {!userAvatar && userName.substring(0, 3).toUpperCase()}
                                       </div>
                                    )}
                                    <div className={`${layout === 'left' ? 'text-left' : layout === 'right' ? 'text-right' : layout === 'text' ? 'text-center' : 'pt-16 sm:pt-20 text-center mt-4'} pb-6 px-4 w-full relative z-0`} style={{ fontFamily: font === 'gg sans' ? 'sans-serif' : font }}>
                                       <h4 className="font-black text-3xl sm:text-5xl drop-shadow-md tracking-wide mb-1 sm:mb-2" style={{ color: titleColor }}>WELCOME</h4>
                                       <p className="font-semibold text-xl sm:text-3xl drop-shadow-md" style={{ color: usernameColor }}>{userName}</p>
                                       {memberCountText && <p className="text-base sm:text-xl mt-3 sm:mt-4 drop-shadow-md font-medium" style={{ color: messageColor }}>{memberCountText
                                           .replace(/\[user\.mention\]/g, `@${userName}`)
                                           .replace(/\[user\.username\]/g, userName)
                                           .replace(/\[server\.name\]/g, guildName)
                                           .replace(/\[membercount\]/g, memberCount.toLocaleString())
                                           .replace(/\[membercount\.ordinal\]/g, getOrdinal(memberCount))
                                        }</p>}
                                    </div>
                                 </div>
                              </div>
                           </div>

                           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-border-dark pt-6">
                              <div>
                                 <label className="block text-sm font-medium mb-2">Layout</label>
                                 <select value={layout} onChange={(e) => { setLayout(e.target.value); handleFormChange(); }} className="w-full bg-dark-card border border-border-dark rounded-lg px-4 py-2.5 focus:outline-none focus:border-discord transition-all text-white">
                                    <option value="simple">Simple (Center)</option>
                                    <option value="left">Avatar Left</option>
                                    <option value="right">Avatar Right</option>
                                    <option value="text">Text Only</option>
                                 </select>
                              </div>
                              <div>
                                 <label className="block text-sm font-medium mb-2">Avatar Shape</label>
                                 <select value={avatarShape} onChange={(e) => { setAvatarShape(e.target.value); handleFormChange(); }} className="w-full bg-dark-card border border-border-dark rounded-lg px-4 py-2.5 focus:outline-none focus:border-discord transition-all text-white">
                                    <option value="circle">Circle</option>
                                    <option value="square">Square</option>
                                 </select>
                              </div>
                              <div>
                                 <label className="block text-sm font-medium mb-2">Font</label>
                                 <select value={font} onChange={(e) => { setFont(e.target.value); handleFormChange(); }} className="w-full bg-dark-card border border-border-dark rounded-lg px-4 py-2.5 focus:outline-none focus:border-discord transition-all text-white">
                                    {[
                                       { name: 'gg sans', label: 'gg sans (Discord)', style: 'gg sans, Arial' },
                                       { name: 'Discord', label: 'Discord', style: 'Discord, Arial' },
                                       { name: 'Helvetica', label: 'Helvetica', style: 'Helvetica, Arial' },
                                       { name: 'Impact', label: 'Impact', style: 'Impact, Arial Black' },
                                       { name: 'Georgia', label: 'Georgia', style: 'Georgia, serif' },
                                       { name: 'Courier New', label: 'Courier New', style: 'Courier New, monospace' },
                                       { name: 'Comic Sans MS', label: 'Comic Sans MS', style: 'Comic Sans MS, cursive' },
                                       { name: 'Verdana', label: 'Verdana', style: 'Verdana, sans-serif' },
                                       { name: 'Times New Roman', label: 'Times New Roman', style: 'Times New Roman, serif' },
                                       { name: 'Arial', label: 'Arial', style: 'Arial, sans-serif' }
                                    ].map(f => (
                                       <option key={f.name} value={f.name} style={{ fontFamily: f.style }}>{f.label}</option>
                                    ))}
                                 </select>
                              </div>
                           </div>

                           {/* Advanced Color Settings */}
                           <div className="border-t border-border-dark pt-6 mt-6">
                              <details className="group">
                                 <summary className="flex items-center justify-between font-semibold cursor-pointer list-none text-sm text-white">
                                    <span>Advanced Color & Overlay Settings</span>
                                    <span className="transition group-open:rotate-180 text-discord">
                                       <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                    </span>
                                 </summary>
                                 <div className="text-text-secondary mt-4 space-y-4 animate-in fade-in slide-in-from-top-2">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                       {/* Avatar Outline Color */}
                                       <div>
                                          <label className="block text-xs font-medium mb-2 text-white">Avatar Outline Color</label>
                                          <div className="flex gap-3 items-center">
                                             <input type="color" value={circleColor} onChange={(e) => { setCircleColor(e.target.value); handleFormChange(); }} className="h-8 w-12 bg-dark-card border border-border-dark rounded cursor-pointer shrink-0" />
                                             <div className="flex gap-1.5 flex-wrap">
                                                {PRESET_COLORS.map(c => (
                                                   <button key={c} type="button" onClick={() => { setCircleColor(c); handleFormChange(); }} className="w-6 h-6 rounded border border-border-dark hover:scale-110 transition-transform shadow-sm" style={{ backgroundColor: c }} title={c} />
                                                ))}
                                             </div>
                                          </div>
                                       </div>
                                       {/* Title Color */}
                                       <div>
                                          <label className="block text-xs font-medium mb-2 text-white">Title Color ("WELCOME")</label>
                                          <div className="flex gap-3 items-center">
                                             <input type="color" value={titleColor} onChange={(e) => { setTitleColor(e.target.value); handleFormChange(); }} className="h-8 w-12 bg-dark-card border border-border-dark rounded cursor-pointer shrink-0" />
                                             <div className="flex gap-1.5 flex-wrap">
                                                {PRESET_COLORS.map(c => (
                                                   <button key={c} type="button" onClick={() => { setTitleColor(c); handleFormChange(); }} className="w-6 h-6 rounded border border-border-dark hover:scale-110 transition-transform shadow-sm" style={{ backgroundColor: c }} title={c} />
                                                ))}
                                             </div>
                                          </div>
                                       </div>
                                       {/* Username Color */}
                                       <div>
                                          <label className="block text-xs font-medium mb-2 text-white">Username Color</label>
                                          <div className="flex gap-3 items-center">
                                             <input type="color" value={usernameColor} onChange={(e) => { setUsernameColor(e.target.value); handleFormChange(); }} className="h-8 w-12 bg-dark-card border border-border-dark rounded cursor-pointer shrink-0" />
                                             <div className="flex gap-1.5 flex-wrap">
                                                {PRESET_COLORS.map(c => (
                                                   <button key={c} type="button" onClick={() => { setUsernameColor(c); handleFormChange(); }} className="w-6 h-6 rounded border border-border-dark hover:scale-110 transition-transform shadow-sm" style={{ backgroundColor: c }} title={c} />
                                                ))}
                                             </div>
                                          </div>
                                       </div>
                                       {/* Message Color */}
                                       <div>
                                          <label className="block text-xs font-medium mb-2 text-white">Message Color</label>
                                          <div className="flex gap-3 items-center">
                                             <input type="color" value={messageColor} onChange={(e) => { setMessageColor(e.target.value); handleFormChange(); }} className="h-8 w-12 bg-dark-card border border-border-dark rounded cursor-pointer shrink-0" />
                                             <div className="flex gap-1.5 flex-wrap">
                                                {PRESET_COLORS.map(c => (
                                                   <button key={c} type="button" onClick={() => { setMessageColor(c); handleFormChange(); }} className="w-6 h-6 rounded border border-border-dark hover:scale-110 transition-transform shadow-sm" style={{ backgroundColor: c }} title={c} />
                                                ))}
                                             </div>
                                          </div>
                                       </div>
                                       {/* Overlay Color */}
                                       <div>
                                          <label className="block text-xs font-medium mb-2 text-white">Overlay Color</label>
                                          <div className="flex gap-3 items-center">
                                             <input type="color" value={overlayColor} onChange={(e) => { setOverlayColor(e.target.value); handleFormChange(); }} className="h-8 w-12 bg-dark-card border border-border-dark rounded cursor-pointer shrink-0" />
                                             <div className="flex gap-1.5 flex-wrap">
                                                {PRESET_COLORS.map(c => (
                                                   <button key={c} type="button" onClick={() => { setOverlayColor(c); handleFormChange(); }} className="w-6 h-6 rounded border border-border-dark hover:scale-110 transition-transform shadow-sm" style={{ backgroundColor: c }} title={c} />
                                                ))}
                                             </div>
                                          </div>
                                       </div>
                                       {/* Overlay Opacity */}
                                       <div>
                                          <label className="block text-xs font-medium mb-1 text-white">Overlay Opacity ({overlayOpacity}%)</label>
                                          <input type="range" min="0" max="100" value={overlayOpacity} onChange={(e) => { setOverlayOpacity(parseInt(e.target.value)); handleFormChange(); }} className="w-full h-2 bg-dark-card rounded-lg appearance-none cursor-pointer mt-3 accent-discord" />
                                       </div>
                                    </div>
                                 </div>
                              </details>
                           </div>

                           <div className="mt-6 border-t border-border-dark pt-6">
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
                                    {bgImageUrl ? (
                                       <div className="w-10 h-10 rounded bg-cover bg-center border border-border-dark" style={{ backgroundImage: `url(${bgImageUrl})` }}></div>
                                    ) : (
                                       <div className="w-10 h-10 rounded bg-[#23272A] border border-border-dark"></div>
                                    )}
                                    <span className="truncate max-w-50">{bgImageUrl ? 'Image Template' : 'Dark Background'}</span>
                                 </div>
                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                 </svg>
                              </button>

                              {showImageGallery && (
                                 <div className="absolute top-full mt-2 left-0 w-full bg-dark-secondary border border-border-dark rounded-xl shadow-xl z-20 p-4 max-h-96 overflow-y-auto custom-scrollbar">
                                    <p className="text-xs font-bold text-discord mb-3 uppercase tracking-wide">Solid Colors & Fallback</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                       <div onClick={() => { setBgImageUrl(''); handleFormChange(); setShowImageGallery(false); }} className={`h-16 rounded-lg cursor-pointer border-2 ${!bgImageUrl ? 'border-discord' : 'border-transparent hover:border-discord'} flex items-center justify-center font-semibold text-white relative overflow-hidden`} style={{ backgroundColor: bgColor }}>
                                          <span className="z-10 mix-blend-difference">Use Solid Color</span>
                                          {!bgImageUrl && <div className="absolute inset-0 bg-black/30"></div>}
                                       </div>
                                       <div className="flex flex-col justify-center">
                                          <label className="block text-xs font-medium mb-2 text-text-secondary">Select Color</label>
                                          <div className="flex gap-3 items-center">
                                             <input type="color" value={bgColor} onChange={(e) => { setBgColor(e.target.value); handleFormChange(); }} className="h-8 w-12 bg-dark-card border border-border-dark rounded cursor-pointer shrink-0" />
                                             <div className="flex gap-1.5 flex-wrap">
                                                {PRESET_COLORS.map(c => (
                                                   <button key={c} type="button" onClick={() => { setBgColor(c); handleFormChange(); }} className="w-6 h-6 rounded border border-border-dark hover:scale-110 transition-transform shadow-sm" style={{ backgroundColor: c }} title={c} />
                                                ))}
                                             </div>
                                          </div>
                                       </div>
                                    </div>

                                    <p className="text-xs font-bold text-discord mb-3 uppercase tracking-wide">Custom URL</p>
                                    <div className="mb-4">
                                       <input
                                          type="text"
                                          value={bgImageUrl}
                                          onChange={(e) => { setBgImageUrl(e.target.value); handleFormChange(); }}
                                          placeholder="https://example.com/image.png"
                                          className="w-full bg-dark-card border border-border-dark rounded-lg px-3 py-2 focus:outline-none focus:border-discord transition-all text-white text-sm"
                                       />
                                    </div>

                                    <p className="text-xs font-bold text-discord mb-3 uppercase tracking-wide">Image Templates</p>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                       {[
                                          'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=300',
                                          'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=300',
                                          'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=300',
                                          'https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&q=80&w=300',
                                          'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=300',
                                          'https://images.unsplash.com/photo-1506744626753-1fa7673e4b78?auto=format&fit=crop&q=80&w=300',
                                          'https://images.unsplash.com/photo-1534796636912-365289133bd4?auto=format&fit=crop&q=80&w=300',
                                          'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=300',
                                          'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=300',
                                          'https://images.unsplash.com/photo-1478760327741-6cb23d3862b5?auto=format&fit=crop&q=80&w=300',
                                          'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=300',
                                          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=300',
                                          'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=300',
                                          'https://images.unsplash.com/photo-1604871000636-074fa5117945?auto=format&fit=crop&q=80&w=300',
                                          'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=300'
                                       ].map((url, i) => (
                                          <div
                                             key={i}
                                             onClick={() => { setBgImageUrl(url); handleFormChange(); setShowImageGallery(false); }}
                                             className={`h-16 bg-cover bg-center rounded-lg cursor-pointer border-2 ${bgImageUrl === url ? 'border-discord' : 'border-transparent hover:border-discord'}`}
                                             style={{ backgroundImage: `url(${url})` }}
                                          />
                                       ))}
                                    </div>
                                 </div>
                              )}
                           </div>

                        </div>
                     )}
                  </div>

                  {/* Save CTA */}
                  <SaveCTA 
                     hasUnsavedChanges={hasUnsavedChanges} 
                     onSave={handleSave} 
                     onReset={() => window.location.reload()} 
                     saving={saving} 
                  />
               </form>
            </div>

            {/* Right Column: Previews */}
            <div className="xl:col-span-5 border-t xl:border-t-0 xl:border-l border-border-dark pt-6 xl:pt-0 xl:pl-8 space-y-6">
               {/* Plain message Preview */}
               <div className="bg-dark-secondary border border-border-dark rounded-xl p-6">
                  <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-4">Message Preview</h3>
                  <div className="bg-dark-card p-4 rounded-lg text-sm wrap-break-word whitespace-pre-wrap text-white">
                     {messageText.length > 0 ? (
                        <div dangerouslySetInnerHTML={{ __html: parseDiscordText(messageText) }} />
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
                        <div className="font-bold text-base mb-1 text-white" dangerouslySetInnerHTML={{ __html: parseDiscordText(embedTitle || 'Welcome!', true) }} />
                        <div className="text-gray-300 text-sm whitespace-pre-wrap wrap-break-word" dangerouslySetInnerHTML={{ __html: parseDiscordText(embedDesc || 'Your embed description will appear here') }} />
                     </div>
                  </div>
               )}


            </div>
         </div>
      </div>
   );
}
