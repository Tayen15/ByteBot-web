/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Bot,
  Shield,
  FileText,
  Quote,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface AiSettings {
  chatbotEnabled: boolean;
  chatChannelId: string;
  persona: string;
  smartModEnabled: boolean;
  modLogChannelId: string;
  tldrEnabled: boolean;
  quoteEnabled: boolean;
  temperature: number;
  contextLimit: number;
  responseStyle: string;
}

interface Channel {
  id: string;
  name: string;
  type: number;
}

export default function AiSettingsPage() {
  const params = useParams();
  const guildId = params.id as string;

  const defaultSettings: AiSettings = {
    chatbotEnabled: false,
    chatChannelId: "",
    persona: "Kamu adalah Bytebot, asisten Discord yang cerdas, ramah, dan sedikit lucu.",
    smartModEnabled: false,
    modLogChannelId: "",
    tldrEnabled: true,
    quoteEnabled: true,
    temperature: 0.7,
    contextLimit: 10,
    responseStyle: "casual",
  };

  const [settings, setSettings] = useState<AiSettings>(defaultSettings);
  const [initialSettings, setInitialSettings] = useState<AiSettings>(defaultSettings);

  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const hasUnsavedChanges = JSON.stringify(settings) !== JSON.stringify(initialSettings);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, channelsRes] = await Promise.all([
          fetch(`/api/bot/guild/${guildId}/ai`),
          fetch(`/api/bot/guild/${guildId}/channels`),
        ]);

        if (settingsRes.ok) {
          const data = await settingsRes.json();
          if (data && data.success && data.aiSettings) {
            setSettings(data.aiSettings);
            setInitialSettings(data.aiSettings);
          } else if (data && !data.success) {
            setSettings(data); // Fallback if format is different
            setInitialSettings(data);
          }
        }

        if (channelsRes.ok) {
          const data = await channelsRes.json();
          if (data.success && data.channels) {
            setChannels(data.channels.filter((c: any) => c.type === 'text'));
          }
        }
      } catch {
        toast.error("Gagal memuat pengaturan AI");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [guildId]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/bot/guild/${guildId}/ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        toast.success("Pengaturan AI berhasil disimpan!");
        setInitialSettings(settings);
      } else {
        throw new Error("Gagal menyimpan");
      }
    } catch {
      toast.error("Terjadi kesalahan saat menyimpan");
    } finally {
      setIsSaving(false);
    }
  };

  const activeFeaturesCount = [
    settings.chatbotEnabled,
    settings.smartModEnabled,
    settings.tldrEnabled,
    settings.quoteEnabled,
  ].filter(Boolean).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-discord"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-border-dark gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-yellow-400" />
            Advanced AI Features
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Konfigurasi asisten virtual Bytebot, moderasi cerdas, dan fitur bertenaga AI lainnya.
          </p>
        </div>
        <Link
          href={`/dashboard/guild/${guildId}`}
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
          <form className="space-y-6">
            {/* Chatbot Section */}
            <div className="bg-dark-secondary border border-border-dark rounded-xl p-6 hover:border-discord/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Bot className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-1">AI Chatbot</h2>
                    <p className="text-text-secondary text-sm">Bot otomatis membalas seperti manusia</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.chatbotEnabled}
                    onChange={(e) => setSettings({ ...settings, chatbotEnabled: e.target.checked })}
                  />
                  <div className="w-14 h-7 bg-dark-card peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-discord"></div>
                </label>
              </div>

              <div className={`space-y-4 pt-4 border-t border-border-dark transition-all duration-300 ${!settings.chatbotEnabled ? 'hidden' : ''}`}>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Channel Khusus AI (Opsional)
                  </label>
                  <select
                    className="w-full bg-dark-card border border-border-dark rounded-lg px-4 py-2.5 focus:outline-none focus:border-discord transition-all text-white"
                    value={settings.chatChannelId || ""}
                    onChange={(e) => setSettings({ ...settings, chatChannelId: e.target.value })}
                  >
                    <option value="">-- Hanya merespon jika di-mention --</option>
                    {channels.map((c) => (
                      <option key={c.id} value={c.id}>
                        # {c.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-text-secondary mt-2">
                    Jika dipilih, semua pesan di channel ini akan dibalas oleh AI tanpa perlu mention.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Persona Bot (Prompt Sistem)
                  </label>
                  <textarea
                    rows={3}
                    className="w-full bg-dark-card border border-border-dark rounded-lg px-4 py-2.5 focus:outline-none focus:border-discord transition-all text-white resize-none custom-scrollbar"
                    value={settings.persona}
                    onChange={(e) => setSettings({ ...settings, persona: e.target.value })}
                    placeholder="Kamu adalah asisten Discord yang sangat ramah..."
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Kreativitas AI (Temperature): {settings.temperature}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      className="w-full accent-discord"
                      value={settings.temperature}
                      onChange={(e) => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
                    />
                    <div className="flex justify-between text-xs text-text-secondary mt-1">
                      <span>Kaku (0.0)</span>
                      <span>Kreatif (1.0)</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Batas Ingatan (Context Limit)
                    </label>
                    <select
                      className="w-full bg-dark-card border border-border-dark rounded-lg px-4 py-2 focus:outline-none focus:border-discord transition-all text-white"
                      value={settings.contextLimit}
                      onChange={(e) => setSettings({ ...settings, contextLimit: parseInt(e.target.value) })}
                    >
                      <option value={5}>5 Pesan Terakhir</option>
                      <option value={10}>10 Pesan Terakhir</option>
                      <option value={20}>20 Pesan Terakhir</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Gaya Bahasa (Style Preset)
                  </label>
                  <select
                    className="w-full bg-dark-card border border-border-dark rounded-lg px-4 py-2.5 focus:outline-none focus:border-discord transition-all text-white"
                    value={settings.responseStyle}
                    onChange={(e) => setSettings({ ...settings, responseStyle: e.target.value })}
                  >
                    <option value="casual">Santai / Kasual (Default)</option>
                    <option value="professional">Sopan & Profesional</option>
                    <option value="genz">Anak Jaksel / Gen Z</option>
                    <option value="tsundere">Tsundere (Galak tapi peduli)</option>
                    <option value="anime">Wibu / Anime Character</option>
                    <option value="english">Strictly English</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Smart Moderation Section */}
            <div className="bg-dark-secondary border border-border-dark rounded-xl p-6 hover:border-discord/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/10 rounded-lg">
                    <Shield className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-1">Smart AI Moderation</h2>
                    <p className="text-text-secondary text-sm">Deteksi konten toksik atau spam menggunakan AI</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.smartModEnabled}
                    onChange={(e) => setSettings({ ...settings, smartModEnabled: e.target.checked })}
                  />
                  <div className="w-14 h-7 bg-dark-card peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-discord"></div>
                </label>
              </div>
              
              <div className={`space-y-4 pt-4 border-t border-border-dark transition-all duration-300 ${!settings.smartModEnabled ? 'hidden' : ''}`}>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Channel Log Moderasi
                  </label>
                  <select
                    className="w-full bg-dark-card border border-border-dark rounded-lg px-4 py-2.5 focus:outline-none focus:border-discord transition-all text-white"
                    value={settings.modLogChannelId || ""}
                    onChange={(e) => setSettings({ ...settings, modLogChannelId: e.target.value })}
                  >
                    <option value="">-- Pilih channel log --</option>
                    {channels.map((c) => (
                      <option key={c.id} value={c.id}>
                        # {c.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-text-secondary mt-2">
                    Laporan pesan yang dihapus oleh AI akan dikirim ke sini.
                  </p>
                </div>
              </div>
            </div>

            {/* TLDR Section */}
            <div className="bg-dark-secondary border border-border-dark rounded-xl p-6 hover:border-discord/50 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <FileText className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-1">TLDR (Chat Summarizer)</h2>
                    <p className="text-text-secondary text-sm">Izinkan member menggunakan command <code>/tldr</code></p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.tldrEnabled}
                    onChange={(e) => setSettings({ ...settings, tldrEnabled: e.target.checked })}
                  />
                  <div className="w-14 h-7 bg-dark-card peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-discord"></div>
                </label>
              </div>
            </div>

            {/* Quote Section */}
            <div className="bg-dark-secondary border border-border-dark rounded-xl p-6 hover:border-discord/50 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Quote className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-1">Daily Quotes & Motivation</h2>
                    <p className="text-text-secondary text-sm">Izinkan member menggunakan command <code>/quote</code> atau <code>/motivasi</code></p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.quoteEnabled}
                    onChange={(e) => setSettings({ ...settings, quoteEnabled: e.target.checked })}
                  />
                  <div className="w-14 h-7 bg-dark-card peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-discord"></div>
                </label>
              </div>
            </div>
            
            {/* Save CTA - Only visible when changes exist */}
            {hasUnsavedChanges && (
               <div className="fixed bottom-6 right-6 z-50 bg-dark-secondary text-white px-4 py-3 rounded-lg shadow-lg border border-border-dark flex items-center gap-4 text-sm font-semibold animate-in slide-in-from-bottom-5">
                  <span className="flex items-center gap-2">
                     Unsaved changes detected
                  </span>
                  <div className="flex gap-2">
                     <button 
                       type="button" 
                       onClick={() => setSettings(initialSettings)}
                       className="px-3 py-1.5 hover:bg-dark-card rounded transition-colors text-sm font-medium"
                     >
                       Reset
                     </button>
                     <button 
                       type="button"
                       disabled={isSaving}
                       onClick={handleSave}
                       className="bg-discord hover:bg-discord-hover disabled:opacity-50 px-4 py-1.5 rounded-md text-sm font-bold transition-colors flex items-center gap-2"
                     >
                       {isSaving ? (
                         <span className="flex items-center gap-2">
                           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                           Saving…
                         </span>
                       ) : 'Save Settings'}
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
                <Sparkles className="h-6 w-6 text-discord" />
              </div>
              <h3 className="text-lg font-bold">Current Status</h3>
            </div>

            <div className="space-y-4">
              {/* Overall Status Badge */}
              <div className="flex items-center justify-between p-3 bg-dark-card rounded-lg">
                <span className="text-sm text-text-secondary">AI Features</span>
                {activeFeaturesCount > 0 ? (
                  <span className="px-2.5 py-1 bg-success/10 text-success text-xs font-semibold rounded-full border border-success/30">
                    ✓ Active
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-gray-500/10 text-gray-400 text-xs font-semibold rounded-full border border-gray-500/30">
                    ✗ Inactive
                  </span>
                )}
              </div>

              {/* Chatbot specific info */}
              {settings.chatbotEnabled && (
                 <div className="p-3 bg-dark-card rounded-lg">
                   <p className="text-xs text-text-secondary mb-1">AI Chatbot Target</p>
                   <p className="text-sm font-medium text-white">
                     {settings.chatChannelId 
                        ? channels.find(c => c.id === settings.chatChannelId)?.name || 'Unknown Channel' 
                        : 'Mention Only'}
                   </p>
                 </div>
              )}

              {/* Active Features Count */}
              <div className="p-3 bg-dark-card rounded-lg flex items-center justify-between">
                <p className="text-xs text-text-secondary">Active Modules</p>
                <p className="text-xl font-bold text-discord">
                  {activeFeaturesCount}/4
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
