export interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
}

export interface Guild {
  guildId: string;
  name: string;
  iconUrl: string | null;
  botInGuild: boolean;
  isOwner: boolean;
  isAdmin: boolean;
}

export async function fetchBotGuildIds(): Promise<Set<string>> {
  const botToken = process.env.DISCORD_BOT_TOKEN;
  if (!botToken) return new Set();
  try {
    const res = await fetch('https://discord.com/api/users/@me/guilds?limit=200', {
      headers: { Authorization: `Bot ${botToken}` },
      next: { revalidate: 60 },
    });
    if (!res.ok) return new Set();
    const guilds: { id: string }[] = await res.json();
    return new Set(guilds.map((g) => g.id));
  } catch {
    return new Set();
  }
}

export async function fetchUserGuilds(accessToken: string, botGuildIds: Set<string>): Promise<Guild[]> {
  try {
    const res = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: { Authorization: `Bearer ${accessToken}` },
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const guilds: DiscordGuild[] = await res.json();
    return guilds.map((g) => ({
      guildId: g.id,
      name: g.name,
      iconUrl: g.icon
        ? `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.webp?size=128`
        : null,
      botInGuild: botGuildIds.has(g.id),
      isOwner: g.owner,
      isAdmin: g.owner || !!(BigInt(g.permissions) & BigInt(0x8)),
    }));
  } catch {
    return [];
  }
}