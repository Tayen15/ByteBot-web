'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Feature = { featureKey: string; name: string; description: string; enabled: boolean; category: string; icon?: string; updatedAt: string };
type FeatureMap = Record<string, Feature[]>;

export default function OwnerFeaturesPage() {
     const [features, setFeatures] = useState<FeatureMap>({});
     const [loading, setLoading] = useState(true);
     const [alert, setAlert] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

     // Category Configuration
     const categories: Record<string, { name: string, icon: React.ReactNode }> = {
          general: { name: 'General Features', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
          community: { name: 'Community Tools', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
          premium: { name: 'Premium Perks', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg> },
          dashboard: { name: 'Dashboard Features', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
          bot: { name: 'Bot Systems', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
          integration: { name: 'Integrations', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg> },
     };

     // Fetch features from backend on mount
     useEffect(() => {
          fetch('/api/bot/owner/features')
               .then(res => res.json())
               .then(data => {
                    if (data.success && Array.isArray(data.features)) {
                         // Group by category
                         const grouped: FeatureMap = {};
                         data.features.forEach((feature: Feature) => {
                              const cat = feature.category || 'general';
                              if (!grouped[cat]) grouped[cat] = [];
                              grouped[cat].push(feature);
                         });
                         setFeatures(grouped);
                    }
               })
               .catch(err => console.error('Failed to fetch features:', err))
               .finally(() => setLoading(false));
     }, []);

     const handleToggle = (categoryKey: string, featureKey: string, enabled: boolean) => {
          setFeatures(prev => ({
               ...prev,
               [categoryKey]: prev[categoryKey].map(f => f.featureKey === featureKey ? { ...f, enabled } : f),
          }));

          fetch(`/api/bot/owner/features/${featureKey}/toggle`, {
               method: 'PATCH',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ enabled }),
          })
               .then(r => r.json())
               .then(data => {
                    if (data.success) {
                         setAlert({ message: `Feature ${enabled ? 'enabled' : 'disabled'} successfully`, type: 'success' });
                    } else {
                         throw new Error(data.error || 'Failed');
                    }
               })
               .catch(() => {
                    setFeatures(prev => ({
                         ...prev,
                         [categoryKey]: prev[categoryKey].map(f => f.featureKey === featureKey ? { ...f, enabled: !enabled } : f),
                    }));
                    setAlert({ message: 'Failed to toggle feature', type: 'error' });
               })
               .finally(() => { setTimeout(() => setAlert(null), 3000); });
     };

     return (
          <div className="container mx-auto px-4 py-8 max-w-7xl">
               {/* Page Header */}
               <div className="mb-10">
                    <div className="flex items-center gap-4 mb-3">
                         <Link href="/dashboard/owner" className="text-text-secondary hover:text-discord transition-colors p-2 hover:bg-dark-secondary rounded-lg">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                              </svg>
                         </Link>
                         <div className="flex items-center gap-3">
                              <svg className="w-10 h-10 text-discord" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <h1 className="text-4xl font-bold text-white">Feature Toggles</h1>
                         </div>
                    </div>
                    <p className="text-text-secondary ml-14">Enable or disable dashboard features globally across all servers</p>
               </div>

               {/* Feature Categories */}
               {loading ? (
                    <div className="flex justify-center items-center h-32">
                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-discord"></div>
                    </div>
               ) : Object.keys(features).length === 0 ? (
                    <div className="text-center text-text-secondary mt-10">No features found in the database.</div>
               ) : Object.entries(features).map(([categoryKey, catFeatures]) => {
                    if (catFeatures.length === 0) return null;
                    const categoryData = categories[categoryKey] || { name: categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1), icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> };

                    return (
                         <div key={categoryKey} className="mb-10">
                              {/* Category Header */}
                              <div className="flex items-center gap-3 mb-6 pb-2 border-b border-border-dark">
                                   <span className="text-2xl">{categoryData.icon}</span>
                                   <h2 className="text-2xl font-bold text-white tracking-wide">{categoryData.name}</h2>
                              </div>

                              {/* Feature Cards */}
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                   {catFeatures.map((feature) => (
                                        <div key={feature.featureKey} className="bg-dark-secondary border border-border-dark rounded-xl p-6 hover:border-discord/50 transition-all duration-300 shadow-sm flex flex-col">
                                             {/* Feature Header */}
                                             <div className="flex items-start justify-between mb-4">
                                                  <div className="flex items-center gap-3">
                                                       <div className="bg-dark-card p-2 rounded-lg border border-border-dark">
                                                            <svg className="w-6 h-6 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                                            </svg>
                                                       </div>
                                                       <div>
                                                            <h3 className="text-lg font-bold text-white leading-tight">{feature.name}</h3>
                                                            <code className="text-[11px] text-discord tracking-wider font-mono bg-discord/10 px-1.5 py-0.5 rounded">{feature.featureKey}</code>
                                                       </div>
                                                  </div>

                                                  {/* Toggle Switch */}
                                                  <label className="relative inline-flex items-center cursor-pointer mt-1">
                                                       <input
                                                            type="checkbox"
                                                            className="sr-only peer"
                                                            checked={feature.enabled}
                                                            onChange={(e) => handleToggle(categoryKey, feature.featureKey, e.target.checked)}
                                                       />
                                                       <div className="w-14 h-7 bg-dark-card peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-discord border border-border-dark peer-checked:border-discord shadow-inner"></div>
                                                  </label>
                                             </div>

                                             {/* Description */}
                                             <p className="text-sm text-text-secondary mb-6 flex-1 leading-relaxed">{feature.description}</p>

                                             {/* Status Badge */}
                                             <div className="flex items-center justify-between pt-4 border-t border-border-dark mt-auto">
                                                  {feature.enabled ? (
                                                       <div className="bg-success/10 border border-success/30 rounded-lg px-2.5 py-1 flex items-center gap-1.5 shadow-sm">
                                                            <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                                                            <span className="text-success text-xs font-bold tracking-wider uppercase">Enabled</span>
                                                       </div>
                                                  ) : (
                                                       <div className="bg-danger/10 border border-danger/30 rounded-lg px-2.5 py-1 flex items-center gap-1.5 opacity-80">
                                                            <div className="w-2 h-2 rounded-full bg-danger"></div>
                                                            <span className="text-danger text-xs font-bold tracking-wider uppercase">Disabled</span>
                                                       </div>
                                                  )}
                                                  <span className="text-[11px] font-semibold text-text-secondary opacity-70">Updated {new Date(feature.updatedAt).toLocaleDateString()}</span>
                                             </div>
                                        </div>
                                   ))}
                              </div>
                         </div>
                    );
               })}

               {/* Alert Box */}
               {alert && (
                    <div className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-xl shadow-2xl border flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in ${alert.type === 'success' ? 'bg-success/10 border-success text-success' : 'bg-danger/10 border-danger text-danger'} backdrop-blur-md`}>
                         {alert.type === 'success' ? (
                              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                              </svg>
                         ) : (
                              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                              </svg>
                         )}
                         <span className="font-semibold text-sm mr-2">{alert.message}</span>
                    </div>
               )}
          </div>
     );
}
