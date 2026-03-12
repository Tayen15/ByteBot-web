'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Server {
  id: string;
  name: string;
  icon: string | null;
  owner: { username: string };
  memberCount: number;
  boostTier: number;
  joinedAt: string;
}

export default function ServersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [allServers, setAllServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/bot/owner/servers')
      .then(r => r.json())
      .then(data => { if (data.servers) setAllServers(data.servers); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalMembers = allServers.reduce((sum, s) => sum + (s.memberCount || 0), 0);
  const largestServer = [...allServers].sort((a, b) => b.memberCount - a.memberCount)[0];

  const filteredServers = allServers.filter(
    (server) =>
      server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      server.owner.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b-2 border-border-dark">
        <h1 className="text-3xl font-bold bg-linear-to-br from-discord to-[#7289DA] bg-clip-text text-transparent">
          All Servers
        </h1>
        <Link
          href="/dashboard/owner"
          className="px-6 py-3 bg-dark-secondary text-white rounded-lg border border-border-dark hover:bg-dark-card hover:border-discord transition-all"
        >
          &larr; Back to Dashboard
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-dark-secondary p-6 rounded-xl border-2 border-border-dark">
          <h3 className="text-text-secondary text-sm font-semibold uppercase mb-2">Total Servers</h3>
          <p className="text-3xl font-bold text-discord">{loading ? '…' : allServers.length}</p>
        </div>
        <div className="bg-dark-secondary p-6 rounded-xl border-2 border-border-dark">
          <h3 className="text-text-secondary text-sm font-semibold uppercase mb-2">Total Members</h3>
          <p className="text-3xl font-bold text-discord">{loading ? '…' : totalMembers.toLocaleString()}</p>
        </div>
        <div className="bg-dark-secondary p-6 rounded-xl border-2 border-border-dark">
          <h3 className="text-text-secondary text-sm font-semibold uppercase mb-2">Largest Server</h3>
          <p className="text-3xl font-bold text-discord">
            {loading ? '…' : largestServer ? largestServer.memberCount.toLocaleString() : '-'}
          </p>
        </div>
      </div>

      {/* Search Box */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search servers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-4 bg-dark-secondary border-2 border-border-dark rounded-xl text-white outline-none focus:border-discord transition-colors"
        />
      </div>

      {/* Servers Grid */}
      {filteredServers.length === 0 ? (
        <div className="text-center py-16 text-text-secondary">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50 block" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <h3 className="text-xl font-bold text-white mb-2">No servers found</h3>
          <p>Try adjusting your search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServers.map((server) => (
            <Link
              key={server.id}
              href={`/dashboard/guild/${server.id}`}
              className="bg-dark-secondary border-2 border-border-dark rounded-xl p-6 block hover:border-discord hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(88,101,242,0.2)] transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                {server.icon ? (
                  <Image
                    src={server.icon}
                    alt={server.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full object-cover shrink-0"
                    unoptimized
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-discord flex items-center justify-center text-2xl font-bold shrink-0">
                    {server.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="text-lg font-bold truncate flex items-center flex-wrap gap-2">
                    {server.name}
                    {server.boostTier > 0 && (
                      <span className="inline-block px-2 py-1 bg-[#ff73fa] text-white rounded text-xs font-semibold shrink-0">
                        TIER {server.boostTier}
                      </span>
                    )}
                  </h3>
                  <p className="text-text-secondary text-sm">Owner: {server.owner.username}</p>
                </div>
              </div>
              <div className="flex gap-4 mt-4 pt-4 border-t border-border-dark">
                <div className="flex-1 text-center">
                  <span className="block text-text-secondary text-xs mb-1">Members</span>
                  <strong className="text-white">{server.memberCount.toLocaleString()}</strong>
                </div>
                <div className="flex-1 text-center">
                  <span className="block text-text-secondary text-xs mb-1">Joined</span>
                  <strong className="text-white">{new Date(server.joinedAt).toLocaleDateString()}</strong>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
