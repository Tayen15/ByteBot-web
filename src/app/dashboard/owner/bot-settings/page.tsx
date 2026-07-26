"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface BotSettings {
  id: string;
  activityType: string;
  activityText: string;
  status: string;
  maintenanceMode: boolean;
  maintenanceMessage: string | null;
  aiModel: string;
}

export default function OwnerBotSettingsPage() {
  const [settings, setSettings] = useState<BotSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    fetch("/api/owner/bot-settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.id) {
          setSettings(data);
        }
      })
      .catch((err) => console.error("Failed to fetch bot settings:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field: keyof BotSettings, value: string | boolean) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    try {
      const res = await fetch("/api/owner/bot-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setAlert({
          message: "Bot settings updated successfully",
          type: "success",
        });
      } else {
        throw new Error("Failed to update");
      }
    } catch (err) {
      setAlert({ message: "Failed to update bot settings", type: "error" });
    } finally {
      setSaving(false);
      setTimeout(() => setAlert(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-discord"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-3">
          <Link
            href="/dashboard/owner"
            className="text-text-secondary hover:text-discord transition-colors p-2 hover:bg-dark-secondary rounded-lg"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <div className="flex items-center gap-3">
            <svg
              className="w-10 h-10 text-discord"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <h1 className="text-4xl font-bold text-white">
              Global Bot Settings
            </h1>
          </div>
        </div>
        <p className="text-text-secondary ml-14">
          Configure global bot settings including the core AI Model.
        </p>
      </div>

      {settings && (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-dark-card border border-border-dark rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-white mb-6 pb-2 border-b border-border-dark flex items-center gap-2">
              <svg
                className="w-6 h-6 text-purple-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Artificial Intelligence
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2 text-white">
                  AI Core Model
                </label>
                <input
                  type="text"
                  value={settings.aiModel}
                  onChange={(e) => handleChange("aiModel", e.target.value)}
                  placeholder="e.g. glm-5.2-free, gpt-4o, claude-3-5-sonnet"
                  className="w-full bg-dark-secondary border border-border-dark rounded-lg px-4 py-3 text-white focus:outline-none focus:border-discord transition-colors"
                />
                <p className="text-xs text-text-secondary mt-2">
                  Select the underlying AI model used for all Discord Chatbot
                  interactions globally. Ensure your API Key supports the
                  selected model.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-dark-card border border-border-dark rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-white mb-6 pb-2 border-b border-border-dark flex items-center gap-2">
              <svg
                className="w-6 h-6 text-discord"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Bot Presence
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold mb-2 text-white">
                  Activity Type
                </label>
                <select
                  value={settings.activityType}
                  onChange={(e) => handleChange("activityType", e.target.value)}
                  className="w-full bg-dark-secondary border border-border-dark rounded-lg px-4 py-3 text-white focus:outline-none focus:border-discord transition-colors"
                >
                  <option value="Playing">Playing</option>
                  <option value="Watching">Watching</option>
                  <option value="Listening">Listening</option>
                  <option value="Competing">Competing</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-white">
                  Activity Text
                </label>
                <input
                  type="text"
                  value={settings.activityText}
                  onChange={(e) => handleChange("activityText", e.target.value)}
                  placeholder="e.g. over servers"
                  className="w-full bg-dark-secondary border border-border-dark rounded-lg px-4 py-3 text-white focus:outline-none focus:border-discord transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-discord hover:bg-discord-hover text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-discord/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Save Settings
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Alert Box */}
      {alert && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-xl shadow-2xl border flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in ${alert.type === "success" ? "bg-success/10 border-success text-success" : "bg-danger/10 border-danger text-danger"} backdrop-blur-md`}
        >
          {alert.type === "success" ? (
            <svg
              className="w-5 h-5 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              ></path>
            </svg>
          ) : (
            <svg
              className="w-5 h-5 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              ></path>
            </svg>
          )}
          <span className="font-semibold text-sm mr-2">{alert.message}</span>
        </div>
      )}
    </div>
  );
}
