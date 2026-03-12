'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function DashboardSidebar({ 
  guildId, 
  initialGuilds = [] 
}: { 
  guildId: string;
  initialGuilds?: { id: string; name: string; icon: string | null; botInGuild: boolean }[];
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  // Pick the current guild from initial props, or fallback
  const guild = initialGuilds.find(g => g.id === guildId) || { id: guildId, name: 'Tunggu sebentar...', icon: null };
  const guilds = initialGuilds;

  const BOT_CLIENT_ID = process.env.NEXT_PUBLIC_BOT_CLIENT_ID || '1006542146628751400';

  // Real user from NextAuth session
  const user = {
    name: session?.user?.name ?? 'User',
    image: session?.user?.image ?? null,
  };

  const featureStates = {
    prayer_times: true,
    welcome_message: true,
    rules_management: true,
    social_alerts: true,
    server_monitoring: true,
  };

  // Close sidebar on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Close sidebar on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const isActive = (path: string) => {
    return pathname?.includes(`/dashboard/guild/${guildId}/${path}`) || 
           (path === '' && pathname === `/dashboard/guild/${guildId}`);
  };

  const navItemClass = (active: boolean) => 
    `flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
      active 
        ? 'bg-discord text-white font-medium' 
        : 'text-text-secondary hover:text-white hover:bg-dark-hover'
    }`;

  return (
    <>
      {/* Hamburger Menu Button (Mobile Only) */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-dark-card border border-border-dark rounded-lg hover:border-discord transition-all"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Full Dashboard Sidebar */}
      <aside
        className={`w-64 bg-dark-secondary border-r border-border-dark shrink-0 flex flex-col h-screen fixed left-0 top-0 z-50 transform transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Close Button (Mobile Only) */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 text-text-secondary hover:text-white transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Bot Logo/Header */}
        <div className="p-4 border-b border-border-dark">
          <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image
              src="/bytebot-logo.png"
              alt="ByteBot Logo"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full"
              unoptimized
            />
            <div>
              <h1 className="font-bold text-lg text-white">ByteBot</h1>
              <p className="text-xs text-text-secondary">Dashboard</p>
            </div>
          </Link>
        </div>

        {/* Guild Info with Dropdown */}
        <div className="p-4 border-b border-border-dark relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-dark-hover transition-all text-white"
          >
            {guild.icon ? (
              <Image
                src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                alt={guild.name}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full shrink-0"
                unoptimized
              />
            ) : (
              <div className="w-12 h-12 bg-discord rounded-full flex items-center justify-center text-xl font-bold shrink-0">
                {guild.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0 text-left">
              <h2 className="font-bold truncate">{guild.name}</h2>
              <p className="text-xs text-text-secondary">Server Settings</p>
            </div>
            {/* Dropdown Icon */}
            <svg
              className={`w-5 h-5 text-text-secondary transition-transform shrink-0 ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <>
              {/* Invisible overlay to close dropdown */}
              <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
              
              <div className="absolute top-full left-0 right-0 mt-2 bg-dark-card border border-border-dark rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto mx-4">
                <div className="p-2">
                  <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider px-3 py-2">
                    Switch Server
                  </div>
                  {guilds
                    .filter((g) => g.id !== guild.id)
                    .map((g) => {
                      const isJoined = g.botInGuild;
                      const href = isJoined
                        ? `/dashboard/guild/${g.id}`
                        : `https://discord.com/oauth2/authorize?client_id=${BOT_CLIENT_ID}&permissions=8&scope=bot%20applications.commands&guild_id=${g.id}&disable_guild_select=true`;

                      return (
                        <Link
                          key={g.id}
                          href={href}
                          target={!isJoined ? "_blank" : undefined}
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-hover transition-all text-white"
                        >
                          {g.icon ? (
                            <Image
                              src={`https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png`}
                              alt={g.name}
                              width={32}
                              height={32}
                              className={`w-8 h-8 rounded-full shrink-0 ${!isJoined ? 'opacity-50' : ''}`}
                              unoptimized
                            />
                          ) : (
                            <div className={`w-8 h-8 ${isJoined ? 'bg-discord' : 'bg-dark-card border border-border-dark'} rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${!isJoined ? 'text-text-secondary' : ''}`}>
                              {g.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${!isJoined ? 'text-text-secondary' : 'text-white'}`}>
                              {g.name}
                            </p>
                            {!isJoined && (
                              <p className="text-[10px] text-warning uppercase font-bold tracking-wider mt-0.5">
                                Not Joined
                              </p>
                            )}
                          </div>
                        </Link>
                      );
                    })}

                  <div className="border-t border-border-dark mt-2 pt-2">
                    <Link
                      href="/dashboard"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-hover text-discord transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      <span className="text-sm font-medium">All Servers</span>
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-dark-card scrollbar-track-transparent">
          {/* Main Section */}
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider px-3 mb-2">
              Main
            </h3>
            <ul className="space-y-1">
              <li>
                <Link href={`/dashboard/guild/${guildId}`} className={navItemClass(isActive(''))}>
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="text-sm">Overview</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Features Section */}
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider px-3 mb-2">
              Features
            </h3>
            <ul className="space-y-1">
              {featureStates.prayer_times && (
                <li>
                  <Link href={`/dashboard/guild/${guildId}/prayer`} className={navItemClass(isActive('prayer'))}>
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">Prayer Times</span>
                  </Link>
                </li>
              )}
              {featureStates.welcome_message && (
                <li>
                  <Link href={`/dashboard/guild/${guildId}/welcome`} className={navItemClass(isActive('welcome'))}>
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    <span className="text-sm">Welcome Messages</span>
                  </Link>
                </li>
              )}
              {featureStates.rules_management && (
                <li>
                  <Link href={`/dashboard/guild/${guildId}/rules`} className={navItemClass(isActive('rules'))}>
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm">Server Rules</span>
                  </Link>
                </li>
              )}
              {featureStates.social_alerts && (
                <li>
                  <Link href={`/dashboard/guild/${guildId}/social-alerts`} className={navItemClass(isActive('social-alerts'))}>
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="text-sm">Social Alerts</span>
                  </Link>
                </li>
              )}
              {featureStates.server_monitoring && (
                <li>
                  <Link href={`/dashboard/guild/${guildId}/monitoring`} className={navItemClass(isActive('monitoring'))}>
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="text-sm">Server Monitoring</span>
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Coming Soon Section */}
          <div>
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider px-3 mb-2">
              Coming Soon
            </h3>
            <ul className="space-y-1">
              <li>
                <div className="flex items-center gap-3 px-3 py-2 text-text-secondary/50 cursor-not-allowed">
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                  <span className="text-sm">Auto Roles</span>
                </div>
              </li>
              <li>
                <div className="flex items-center gap-3 px-3 py-2 text-text-secondary/50 cursor-not-allowed">
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-sm">Custom Commands</span>
                </div>
              </li>
            </ul>
          </div>
        </nav>

        {/* User Info at Bottom */}
        <div className="p-4 border-t border-border-dark mt-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full shrink-0"
                  unoptimized
                />
              ) : (
                <div className="w-8 h-8 bg-discord rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0 text-white">
                <p className="text-sm font-semibold truncate">{user.name}</p>
                <p className="text-xs text-text-secondary">Logged in</p>
              </div>
            </div>
            <Link
              href="/api/auth/signout"
              className="text-text-secondary hover:text-[#ED4245] transition-colors p-2 hover:bg-dark-hover rounded-lg"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
