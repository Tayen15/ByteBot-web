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
  }

  return (
    <>
      <DashboardSidebar guildId={guildId} initialGuilds={initialGuilds} />
      <div className="flex-1 overflow-y-auto ml-0 lg:ml-64 transition-all duration-300">
        {children}
      </div>
    </>
  );
}
