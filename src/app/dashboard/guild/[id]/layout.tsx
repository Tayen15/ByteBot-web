import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { fetchBotGuildIds, fetchUserGuilds } from "@/lib/discord";

export default async function GuildLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const guildId = resolvedParams.id;

  const session = await getServerSession(authOptions);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const accessToken = (session as any)?.accessToken as string | undefined;

  let initialGuilds: { id: string; name: string; icon: string | null; botInGuild: boolean }[] = [];
  let featureStates = {
    prayer_times: true, welcome_message: true, rules_management: true, social_alerts: true, server_monitoring: true,
    active_states: { prayer_times: false, welcome_message: false, rules_management: false, social_alerts: false, server_monitoring: false }
  };

  if (accessToken) {
    const botGuildIds = await fetchBotGuildIds();
    const userGuilds = await fetchUserGuilds(accessToken, botGuildIds);
    const adminGuilds = userGuilds.filter((g) => g.isOwner || g.isAdmin);
    
    initialGuilds = adminGuilds.map(g => ({
      id: g.guildId,
      name: g.name,
      icon: g.iconUrl ? g.iconUrl.split('/').pop()?.split('.')[0] || null : null, // keep the hash or null
      botInGuild: g.botInGuild
    }));

    try {
      // @ts-expect-error TypeScript might complain about user.id, but it's safe here
      const discordId = session?.user?.id || session?.user?.discordId || '';
      const res = await fetch(`${process.env.BOT_API_URL || 'http://localhost:4000/api'}/guild/${guildId}/features`, {
        headers: {
          'x-api-key': process.env.BOT_INTERNAL_API_KEY || '',
          'x-discord-id': discordId,
        },
        cache: 'no-store'
      });
      const data = await res.json();
      if (data.success && data.features) {
        featureStates = data.features;
      }
    } catch (e) {
      console.error('Failed to fetch guild features:', e);
    }
  }

  return (
    <>
      <DashboardSidebar guildId={guildId} initialGuilds={initialGuilds} initialFeatureStates={featureStates} />
      <div className="flex-1 overflow-y-auto ml-0 lg:ml-64 transition-all duration-300">
        {children}
      </div>
    </>
  );
}
