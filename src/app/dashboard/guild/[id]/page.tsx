import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { fetchBotGuildIds, fetchUserGuilds } from "@/lib/discord";

type FeatureStates = {
  prayer_times: boolean;
  welcome_message: boolean;
  rules_management: boolean;
  social_alerts: boolean;
  server_monitoring: boolean;
};

export default async function GuildOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const guildId = resolvedParams.id;

  const session = await getServerSession(authOptions);
  if (!session) redirect("/api/auth/signin");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const accessToken = (session as any)?.accessToken as string | undefined;

  let guild: { id: string; name: string; icon: string | null } | null = null;

  const defaultFeatureStates: FeatureStates = {
    prayer_times: true,
    welcome_message: true,
    rules_management: true,
    social_alerts: true,
    server_monitoring: true,
  };

  let featureStates: FeatureStates = defaultFeatureStates;

  if (accessToken) {
    const botGuildIds = await fetchBotGuildIds();
    const userGuilds = await fetchUserGuilds(accessToken, botGuildIds);
    const targetGuild = userGuilds.find((g) => g.guildId === guildId);

    if (targetGuild && (targetGuild.isOwner || targetGuild.isAdmin)) {
      guild = {
        id: targetGuild.guildId,
        name: targetGuild.name,
        icon: targetGuild.iconUrl
          ? targetGuild.iconUrl.split("/").pop()?.split(".")[0] || null
          : null,
      };
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const discordId = (session?.user as any)?.id || (session?.user as any)?.discordId || "";
      const res = await fetch(
        `${process.env.BOT_API_URL || "http://localhost:4000/api"}/guild/${guildId}/features`,
        {
          headers: {
            "x-api-key": process.env.BOT_INTERNAL_API_KEY || "",
            "x-discord-id": discordId,
          },
          cache: "no-store",
        }
      );
      const data = await res.json();
      if (data.success && data.features) {
        featureStates = data.features as FeatureStates;
      }
    } catch (e) {
      console.error("Failed to fetch guild features:", e);
    }
  }

  if (!guild) {
    redirect("/dashboard");
  }

  return (
    <>
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-dark-secondary/95 backdrop-blur-sm border-b border-border-dark">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-3 text-white">
                <svg
                  className="w-6 h-6 text-discord"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Server Overview
              </h1>
              <p className="text-sm text-text-secondary mt-1">
                Manage {guild.name} settings and features
              </p>
            </div>
            <Link
              href="/dashboard"
              className="text-sm text-text-secondary hover:text-white font-semibold px-4 py-2 rounded-lg hover:bg-dark-hover transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Servers</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Guild Header */}
        <div className="flex gap-6 mb-8 items-center text-white">
          {guild.icon ? (
            <Image
              src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
              alt={guild.name}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full"
              unoptimized
            />
          ) : (
            <div className="w-12 h-12 bg-discord rounded-full flex items-center justify-center text-xl font-bold">
              {guild.name.charAt(0).toUpperCase()}
            </div>
          )}
          <h1 className="text-3xl font-bold">{guild.name}</h1>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-linear-to-r from-border-dark via-border-dark to-transparent" />
        </div>

        {/* Features Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Available Features</h2>
              <p className="text-sm text-text-secondary mt-1">Configure bot features for your server</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Prayer Times Feature */}
            {featureStates.prayer_times && (
              <Link
                href={`/dashboard/guild/${guild.id}/prayer`}
                className="group block bg-dark-card border border-border-dark rounded-xl p-6 hover:border-discord transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-linear-to-br from-discord to-purple-600 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold text-white group-hover:text-discord transition-colors">
                      Prayer Times
                    </h3>
                    <p className="text-text-secondary text-sm mt-1">
                      Automated Islamic prayer time notifications with customizable timezone settings.
                    </p>
                  </div>
                </div>
              </Link>
            )}

            {/* Welcome Messages Feature */}
            {featureStates.welcome_message && (
              <Link
                href={`/dashboard/guild/${guild.id}/welcome`}
                className="group block bg-dark-card border border-border-dark rounded-xl p-6 hover:border-discord transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-discord/20 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-7 h-7 text-discord" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold text-white group-hover:text-discord transition-colors">
                      Welcome Messages
                    </h3>
                    <p className="text-text-secondary text-sm mt-1">
                      Greet new members with customizable messages, embeds, images, and autorole.
                    </p>
                  </div>
                </div>
              </Link>
            )}

            {/* Server Rules Feature */}
            {featureStates.rules_management && (
              <Link
                href={`/dashboard/guild/${guild.id}/rules`}
                className="group block bg-dark-card border border-border-dark rounded-xl p-6 hover:border-[#FEE75C] transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#FEE75C]/20 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-7 h-7 text-[#FEE75C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold text-white group-hover:text-[#FEE75C] transition-colors">
                      Server Rules
                    </h3>
                    <p className="text-text-secondary text-sm mt-1">
                      Create and manage server rules with clean formatting and posting.
                    </p>
                  </div>
                </div>
              </Link>
            )}

            {/* Social Alerts Feature */}
            {featureStates.social_alerts && (
              <Link
                href={`/dashboard/guild/${guild.id}/social-alert`}
                className="group block bg-dark-card border border-border-dark rounded-xl p-6 hover:border-[#57F287] transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#57F287]/20 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-7 h-7 text-[#57F287]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold text-white group-hover:text-[#57F287] transition-colors">
                      Social Alerts
                    </h3>
                    <p className="text-text-secondary text-sm mt-1">
                      Monitor YouTube and Instagram creators with automatic Discord notifications.
                    </p>
                  </div>
                </div>
              </Link>
            )}

            {/* Server Monitoring Feature */}
            {featureStates.server_monitoring && (
              <Link
                href={`/dashboard/guild/${guild.id}/monitoring`}
                className="group block bg-dark-card border border-border-dark rounded-xl p-6 hover:border-purple-500 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-7 h-7 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold text-white group-hover:text-purple-500 transition-colors">
                      Server Monitoring
                    </h3>
                    <p className="text-text-secondary text-sm mt-1">
                      Real-time monitoring for Minecraft servers with status updates and player counts.
                    </p>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="bg-linear-to-r from-dark-card to-dark-hover border border-border-dark rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-discord/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-discord" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Coming Soon</h2>
              <p className="text-text-secondary">Features currently in development</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 p-4 bg-dark-primary/50 rounded-lg border border-border-dark/50">
              <svg className="w-6 h-6 text-text-secondary mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
              <div>
                <h4 className="font-bold text-white mb-1">Auto Roles</h4>
                <p className="text-sm text-text-secondary">Automatically assign roles to members</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-dark-primary/50 rounded-lg border border-border-dark/50">
              <svg className="w-6 h-6 text-text-secondary mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div>
                <h4 className="font-bold text-white mb-1">Advanced Moderation</h4>
                <p className="text-sm text-text-secondary">Auto-mod and logging features</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-dark-primary/50 rounded-lg border border-border-dark/50">
              <svg className="w-6 h-6 text-text-secondary mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div>
                <h4 className="font-bold text-white mb-1">Custom Commands</h4>
                <p className="text-sm text-text-secondary">Create your own bot commands</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-dark-primary/50 rounded-lg border border-border-dark/50">
              <svg className="w-6 h-6 text-text-secondary mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <div>
                <h4 className="font-bold text-white mb-1">Reaction Roles</h4>
                <p className="text-sm text-text-secondary">Role assignment via reactions</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-dark-primary/50 rounded-lg border border-border-dark/50">
              <svg className="w-6 h-6 text-text-secondary mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <div>
                <h4 className="font-bold text-white mb-1">Analytics</h4>
                <p className="text-sm text-text-secondary">Server activity and statistics</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
