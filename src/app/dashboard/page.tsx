import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { fetchBotGuildIds, fetchUserGuilds } from '@/lib/discord';

const BOT_CLIENT_ID = process.env.NEXT_PUBLIC_BOT_CLIENT_ID || '1006542146628751400';

export default async function DashboardIndexPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/api/auth/signin');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const accessToken = (session as any).accessToken as string | undefined;

  const guilds = accessToken
    ? await fetchUserGuilds(accessToken, await fetchBotGuildIds())
    : [];
  const adminGuilds = guilds.filter((g) => g.isOwner || g.isAdmin);

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl flex-1">

        {/* Guilds Grid */}
        <div className="mb-6">
            <h1 className="text-2xl font-bold mb-3 text-white flex items-center gap-2">
               <svg className="w-10 h-10 text-discord" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
               </svg>
               Your Servers
            </h1>
            <p className="text-text-secondary mb-6">Klik server untuk mengatur konfigurasi</p>
        </div>

        {adminGuilds.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adminGuilds.map(guild => {
                    const isBotInGuild = guild.botInGuild;
                    const href = isBotInGuild
                       ? `/dashboard/guild/${guild.guildId}`
                       : `https://discord.com/oauth2/authorize?client_id=${BOT_CLIENT_ID}&permissions=8&scope=bot%20applications.commands&guild_id=${guild.guildId}&disable_guild_select=true`;

                    return (
                        <Link 
                            key={guild.guildId}
                            href={href}
                            target={!isBotInGuild ? "_blank" : undefined}
                            className={`group bg-dark-secondary border-2 ${isBotInGuild ? 'border-border-dark hover:border-discord' : 'border-warning/50 hover:border-warning'} rounded-xl p-6 transition-all duration-300 relative overflow-hidden flex flex-col shadow-sm`}
                        >
                            {/* Server Info */}
                            <div className="flex items-start space-x-4 mb-4 flex-1">
                                {guild.iconUrl ? (
                                    <Image width={64} height={64} src={guild.iconUrl}
                                        alt={guild.name}
                                        className={`w-16 h-16 rounded-xl border-2 ${isBotInGuild ? 'border-border-dark group-hover:border-discord' : 'border-warning/50 group-hover:border-warning'} transition-all duration-300 object-cover`}
                                    />
                                ) : (
                                    <div
                                        className={`w-16 h-16 ${isBotInGuild ? 'bg-discord border-border-dark group-hover:border-discord' : 'bg-warning border-warning/50 group-hover:border-warning'} text-white rounded-xl border-2 flex items-center justify-center text-2xl font-bold transition-all duration-300 shrink-0 shadow-inner`}
                                    >
                                        {guild.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0 pt-1">
                                    <h3 className={`text-lg font-bold mb-1.5 truncate transition-colors duration-200 ${isBotInGuild ? 'group-hover:text-discord text-white' : 'group-hover:text-warning text-white'}`}>
                                        {guild.name}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-2 text-text-secondary text-xs font-semibold">
                                        {/* Role Badges */}
                                        {guild.isOwner ? (
                                            <div className="bg-warning/10 border border-warning/30 rounded px-2 py-1 flex items-center gap-1.5">
                                                <svg className="w-3 h-3 text-warning"
                                                    fill="currentColor" viewBox="0 0 20 20">
                                                    <path
                                                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <span className="text-warning text-[10px] uppercase font-bold tracking-wider">Owner</span>
                                            </div>
                                        ) : guild.isAdmin ? (
                                            <div className="bg-discord/10 border border-discord/30 rounded px-2 py-1 flex items-center gap-1.5">
                                                <svg className="w-3 h-3 text-discord"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20">
                                                    <path fillRule="evenodd"
                                                        d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                        clipRule="evenodd" />
                                                </svg>
                                                <span className="text-discord text-[10px] uppercase font-bold tracking-wider">Admin</span>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>

                            {/* Action Footer */}
                            <div className="pt-4 border-t border-border-dark flex items-center justify-between text-sm mt-auto">
                                {isBotInGuild ? (
                                    <>
                                        <span className="text-text-secondary group-hover:text-discord transition-colors duration-200 font-bold">
                                            Configure Settings
                                        </span>
                                        <svg className="w-5 h-5 text-discord transform group-hover:translate-x-1 transition-transform duration-200"
                                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-warning group-hover:text-yellow-400 transition-colors duration-200 font-bold flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="currentColor"
                                                viewBox="0 0 20 20">
                                                <path fillRule="evenodd"
                                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                    clipRule="evenodd" />
                                            </svg>
                                            Invite Bot First
                                        </span>
                                        <svg className="w-5 h-5 text-warning transform group-hover:translate-x-1 transition-transform duration-200"
                                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>
        ) : (
            /* No Guilds */
            <div className="bg-dark-secondary border border-border-dark rounded-xl p-16 text-center shadow-sm">
                <div className="w-20 h-20 bg-dark-card border border-border-dark rounded-full flex flex-col items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">No Servers Found</h3>
                <p className="text-text-secondary mb-8 max-w-lg mx-auto leading-relaxed">
                    Kamu belum memiliki akses ke server manapun, atau bot belum ditambahkan ke server kamu.
                </p>
                <Link href={`https://discord.com/api/oauth2/authorize?client_id=${BOT_CLIENT_ID}&permissions=8&scope=bot%20applications.commands`}
                    target="_blank"
                    className="inline-flex items-center gap-2 bg-discord hover:bg-discord-hover text-white font-bold px-8 py-3.5 rounded-lg transition-all duration-200 shadow-lg shadow-discord/20"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                       <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                    </svg>
                    Invite Bot to Server
                </Link>
            </div>
        )}
    </div>
  );
}
