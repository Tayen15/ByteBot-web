'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { data: session, status } = useSession();
  
  const isAuthenticated = status === 'authenticated';
  const user = session?.user;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (user as any)?.id as string;
  const isOwner = userId === (process.env.NEXT_PUBLIC_OWNER_ID || '746598982049988619');

  return (
    <nav className="bg-dark-secondary border-b border-border-dark sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group" aria-label="ByteBot Home">
            <Image
              src="bytebot-logo.png"
              alt="ByteBot Logo"
              width={40}
              height={40}
              className="w-10 h-10"
              unoptimized
            />
            <span className="text-2xl font-bold text-discord">ByteBot</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-text-secondary hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/commands" className="text-text-secondary hover:text-white transition-colors">
              Commands
            </Link>

            {isAuthenticated && user ? (
              <>
                <Link href="/dashboard" className="text-text-secondary hover:text-white transition-colors">
                  Dashboard
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center space-x-3 hover:opacity-80 transition-opacity focus:outline-none"
                  >
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name || 'User'}
                        width={32}
                        height={32}
                        className="rounded-full border-2 border-discord"
                        unoptimized
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-discord flex items-center justify-center text-white font-bold">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                    <span className="text-white font-medium">{user.name}</span>
                    <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-dark-card border border-border-dark rounded-xl shadow-lg shadow-black/50 py-1 z-50 overflow-hidden">
                      <div className="px-4 py-2 border-b border-border-dark mb-1">
                        <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                        <p className="text-text-secondary text-xs truncate font-mono">ID: {userId}</p>
                      </div>
                      
                      {isOwner && (
                        <Link 
                          href="/dashboard/owner" 
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-discord hover:bg-dark-hover transition-colors"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>Owner Dashboard</span>
                        </Link>
                      )}
                      
                      <button
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          signOut();
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-error hover:bg-dark-hover transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={() => signIn('discord')}
                className="px-6 py-2 bg-discord hover:bg-discord-hover rounded font-semibold text-white transition-all duration-200"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden pb-4 space-y-2`}>
          <Link href="/" className="block py-2 text-text-secondary hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/commands" className="block py-2 text-text-secondary hover:text-white transition-colors">
            Commands
          </Link>

          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="block py-2 text-text-secondary hover:text-white transition-colors">
                Dashboard
              </Link>
              <button 
                onClick={() => signOut()}
                className="block w-full text-left py-2 text-text-secondary hover:text-white transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <button 
              onClick={() => signIn('discord')}
              className="block py-2 text-discord font-semibold"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
