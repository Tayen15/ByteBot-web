'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';

type ServerInfo = {
    id: string;
    name: string;
    icon: string | null;
    owner: { tag?: string; username?: string; id: string };
    createdAt: string;
    joinedAt: string;
    description: string | null;
    memberCount: number;
    channels: { total: number; text: number; voice: number; category: number };
    roles: number;
    boostTier: number;
    boostCount: number;
    features: string[];
};

type Member = {
    id: string;
    displayName: string;
    tag: string;
    username: string;
    avatar: string;
    joinedAt: string;
    isOwner: boolean;
    isBot: boolean;
    permissions: { isAdmin: boolean };
    roles: { name: string; color: string }[];
};

export default function OwnerServerDetailPage() {
    const params = useParams();
    const id = params?.id as string;
    const [activeTab, setActiveTab] = useState<'members' | 'info'>('members');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [server, setServer] = useState<ServerInfo | null>(null);
    const [allMembers, setAllMembers] = useState<Member[]>([]);

    useEffect(() => {
        Promise.all([
            fetch(`/api/bot/owner/servers/${id}`).then(r => r.json()),
            fetch(`/api/bot/owner/servers/${id}/members`).then(r => r.json()),
        ]).then(([sData, mData]) => {
            if (sData.success) setServer(sData.server);
            if (mData.success) setAllMembers(mData.members ?? []);
        }).catch(console.error).finally(() => setLoading(false));
    }, [id]);

    const filteredMembers = searchQuery
        ? allMembers.filter(m =>
            (m.displayName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (m.tag?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (m.username?.toLowerCase() || '').includes(searchQuery.toLowerCase())
        )
        : allMembers;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-discord"></div>
                <p className="text-text-secondary">Loading details & members... (This might take a while for large servers)</p>
            </div>
        );
    }

    if (!server) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <p className="text-text-secondary">Server not found or bot is offline.</p>
                <Link href="/dashboard/owner/servers" className="text-discord hover:underline">Back to Servers</Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-border-dark gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/owner/servers" className="text-text-secondary hover:text-discord transition-colors p-2 hover:bg-dark-secondary rounded-lg">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h1 className="text-3xl font-bold text-white">Server Details</h1>
                </div>
                <Link href="/dashboard/owner/servers" className="bg-dark-secondary hover:bg-dark-card border border-border-dark text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-sm flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Servers
                </Link>
            </div>

            {/* Server Header Card */}
            <div className="bg-dark-secondary p-8 rounded-xl border border-border-dark mb-8 flex flex-col md:flex-row gap-8 items-center md:items-start shadow-sm hover:border-discord/30 transition-colors relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute -right-8 -top-8 w-64 h-64 bg-discord/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="w-32 h-32 rounded-full bg-discord flex items-center justify-center text-5xl font-bold shrink-0 shadow-xl overflow-hidden border-4 border-dark-primary">
                    {server.icon ? <Image width={96} height={96} src={server.icon} alt={server.name} className="w-full h-full object-cover" /> : server.name.charAt(0)}
                </div>
                <div className="flex-1 text-center md:text-left z-10">
                    <h1 className="text-3xl font-bold text-white mb-3">{server.name}</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8 text-sm text-text-secondary font-medium">
                        <p><strong className="text-white mr-2">Owner:</strong> {server.owner.tag || server.owner.username || server.owner.id}</p>
                        <p><strong className="text-white mr-2">Created:</strong> {new Date(server.createdAt).toLocaleDateString()}</p>
                        <p><strong className="text-white mr-2">Joined:</strong> {new Date(server.joinedAt).toLocaleDateString()}</p>
                        {server.description && <p className="col-span-1 sm:col-span-2 mt-2 leading-relaxed"><strong className="text-white block mb-1">Description:</strong> {server.description}</p>}
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-dark-secondary p-6 rounded-xl border border-border-dark shadow-sm">
                    <h3 className="text-text-secondary text-xs font-bold uppercase tracking-wider mb-2">Members</h3>
                    <p className="text-3xl font-bold text-discord">{server.memberCount.toLocaleString()}</p>
                </div>
                <div className="bg-dark-secondary p-6 rounded-xl border border-border-dark shadow-sm">
                    <h3 className="text-text-secondary text-xs font-bold uppercase tracking-wider mb-2">Channels</h3>
                    <p className="text-3xl font-bold text-success">{server.channels.total}</p>
                </div>
                <div className="bg-dark-secondary p-6 rounded-xl border border-border-dark shadow-sm">
                    <h3 className="text-text-secondary text-xs font-bold uppercase tracking-wider mb-2">Roles</h3>
                    <p className="text-3xl font-bold text-warning">{server.roles}</p>
                </div>
                <div className="bg-dark-secondary p-6 rounded-xl border border-border-dark shadow-sm">
                    <h3 className="text-text-secondary text-xs font-bold uppercase tracking-wider mb-2">Boost Tier</h3>
                    <p className="text-3xl font-bold text-purple-400">{server.boostTier > 0 ? `Tier ${server.boostTier}` : 'None'}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 border-b border-border-dark pb-2">
                <button
                    className={`px-6 py-3 font-bold transition-all border-b-2 bg-transparent rounded-t-lg ${activeTab === 'members' ? 'text-discord border-discord bg-discord/5' : 'text-text-secondary border-transparent hover:text-white hover:bg-dark-secondary'}`}
                    onClick={() => setActiveTab('members')}
                >
                    Members
                </button>
                <button
                    className={`px-6 py-3 font-bold transition-all border-b-2 bg-transparent rounded-t-lg ${activeTab === 'info' ? 'text-discord border-discord bg-discord/5' : 'text-text-secondary border-transparent hover:text-white hover:bg-dark-secondary'}`}
                    onClick={() => setActiveTab('info')}
                >
                    Server Info
                </button>
            </div>

            {/* Tab Content */}
            <div className="animate-in fade-in duration-300">
                {activeTab === 'members' && (
                    <div>
                        <div className="mb-6 relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search members by username or tag..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-dark-secondary border border-border-dark rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-discord focus:ring-1 focus:ring-discord transition-all shadow-sm"
                            />
                        </div>

                        <div className="grid gap-4">
                            {filteredMembers.length > 0 ? (
                                filteredMembers.map((member: Member) => (
                                    <div key={member.id} className="bg-dark-secondary border border-border-dark rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-discord/50 transition-colors shadow-sm">
                                        <Image width={64} height={64} src={member.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'} alt={member.username || 'User'} className="w-16 h-16 rounded-full border-2 border-dark-card shadow-md shrink-0 object-cover" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <h3 className="text-lg font-bold text-white leading-none">{member.displayName || member.username}</h3>
                                                <div className="flex gap-1.5 ml-1">
                                                    {member.isOwner && <span className="bg-[#faa61a]/10 text-[#faa61a] border border-[#faa61a]/30 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Owner</span>}
                                                    {member.permissions?.isAdmin && <span className="bg-[#f04747]/10 text-[#f04747] border border-[#f04747]/30 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Admin</span>}
                                                    {member.isBot && <span className="bg-discord/10 text-discord border border-discord/30 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M21 8h-1V6.5A2.5 2.5 0 0 0 17.5 4h-11A2.5 2.5 0 0 0 4 6.5V8H3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1v1.5A2.5 2.5 0 0 0 6.5 22h11a2.5 2.5 0 0 0 2.5-2.5V18h1a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2zM8.5 15a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm7 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" /></svg>Bot</span>}
                                                </div>
                                            </div>
                                            <p className="text-sm font-medium text-text-secondary truncate mb-2">{(member.tag && member.tag !== "0") ? member.tag : member.username || 'Unknown'} • Joined {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : 'Unknown'}</p>
                                            <div className="flex flex-wrap gap-1.5 mt-1">
                                                {member.roles && member.roles.length > 0 ? member.roles.map((role: { name: string, color: string }, idx: number) => (
                                                    <span key={idx} className="bg-dark-card border px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ borderColor: role.color, color: role.color }}>
                                                        {role.name}
                                                    </span>
                                                )) : <span className="text-text-secondary text-xs font-medium">No roles</span>}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-16 bg-dark-secondary rounded-xl border border-border-dark">
                                    <svg className="w-12 h-12 text-border-dark mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    <p className="text-text-secondary font-medium">No members found matching &quot;{searchQuery}&quot;</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'info' && (
                    <div className="bg-dark-secondary p-8 rounded-xl border border-border-dark shadow-sm">
                        <div className="mb-10">
                            <h2 className="text-xl font-bold mb-6 text-discord flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                </svg>
                                Channel Statistics
                            </h2>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-dark-card p-4 rounded-xl border border-border-dark">
                                    <p className="text-text-secondary text-xs uppercase font-bold tracking-wider mb-2">Text Channels</p>
                                    <p className="text-2xl font-bold text-white">{server.channels.text}</p>
                                </div>
                                <div className="bg-dark-card p-4 rounded-xl border border-border-dark">
                                    <p className="text-text-secondary text-xs uppercase font-bold tracking-wider mb-2">Voice Channels</p>
                                    <p className="text-2xl font-bold text-white">{server.channels.voice}</p>
                                </div>
                                <div className="bg-dark-card p-4 rounded-xl border border-border-dark">
                                    <p className="text-text-secondary text-xs uppercase font-bold tracking-wider mb-2">Categories</p>
                                    <p className="text-2xl font-bold text-white">{server.channels.category}</p>
                                </div>
                                <div className="bg-dark-card p-4 rounded-xl border border-border-dark">
                                    <p className="text-text-secondary text-xs uppercase font-bold tracking-wider mb-2">Total</p>
                                    <p className="text-2xl font-bold text-white">{server.channels.total}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-10">
                            <h2 className="text-xl font-bold mb-6 text-discord flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                                Server Features
                            </h2>
                            <div className="flex flex-wrap gap-2.5">
                                {server.features.length > 0 ? server.features.map((f, i) => (
                                    <span key={i} className="px-3.5 py-1.5 bg-dark-card border border-border-dark rounded-lg text-sm font-semibold tracking-wide text-white">
                                        {f.replace(/_/g, ' ')}
                                    </span>
                                )) : <p className="text-text-secondary italic">No special features enabled</p>}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold mb-6 text-discord flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Nitro Boosting
                            </h2>
                            <div className="bg-dark-card p-6 rounded-xl border border-border-dark flex items-center gap-8">
                                <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/30">
                                    <svg className="w-8 h-8 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-lg text-white font-medium mb-1">
                                        <strong className="font-bold mr-2 text-text-secondary text-sm uppercase tracking-wider">Boost Count:</strong>
                                        <span className="text-2xl font-bold text-purple-400">{server.boostCount} boosts</span>
                                    </p>
                                    <p className="text-white font-medium">
                                        <strong className="font-bold mr-2 text-text-secondary text-sm uppercase tracking-wider">Boost Tier:</strong>
                                        <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded border border-purple-500/30 text-sm font-bold tracking-wide">{server.boostTier > 0 ? `Tier ${server.boostTier}` : 'None'}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
