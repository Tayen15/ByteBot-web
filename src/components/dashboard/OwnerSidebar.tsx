'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function OwnerSidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const user = {
    name: session?.user?.name ?? 'Owner',
    image: session?.user?.image ?? null,
  };

  const isActive = (path: string) => {
    if (path === '/dashboard/owner') return pathname === '/dashboard/owner';
    return !!pathname?.startsWith(path);
  };

  const navItemClass = (active: boolean) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
      active
        ? 'bg-discord text-white font-medium'
        : 'text-text-secondary hover:text-white hover:bg-dark-hover'
    }`;

  return (
    <>
      {/* Hamburger (mobile) */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-dark-card border border-border-dark rounded-lg hover:border-discord transition-all"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`w-64 bg-dark-secondary border-r border-border-dark shrink-0 flex flex-col h-screen fixed left-0 top-0 z-50 transform transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Close (mobile) */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 text-text-secondary hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
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
          <div className="mt-3">
            <span className="inline-flex items-center gap-1.5 bg-warning/10 border border-warning/30 rounded px-2 py-1 text-xs font-bold text-warning uppercase tracking-wider">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Owner Access
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2">
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider px-3 mb-2">
              Owner Panel
            </h3>
            <ul className="space-y-1">
              <li>
                <Link href="/dashboard/owner" className={navItemClass(isActive('/dashboard/owner'))}>
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="text-sm">Overview</span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard/owner/stats" className={navItemClass(isActive('/dashboard/owner/stats'))}>
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="text-sm">Live Stats</span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard/owner/features" className={navItemClass(isActive('/dashboard/owner/features'))}>
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  <span className="text-sm">Feature Toggles</span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard/owner/logs" className={navItemClass(isActive('/dashboard/owner/logs'))}>
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm">System Logs</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider px-3 mb-2">
              Navigation
            </h3>
            <ul className="space-y-1">
              <li>
                <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-secondary hover:text-white hover:bg-dark-hover transition-all">
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span className="text-sm">All Servers</span>
                </Link>
              </li>
              <li>
                <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-secondary hover:text-white hover:bg-dark-hover transition-all">
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span className="text-sm">Back to Site</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* User */}
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
                <p className="text-xs text-warning">Owner</p>
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
