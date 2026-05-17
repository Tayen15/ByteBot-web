'use client';

import { signIn } from 'next-auth/react';

export default function LoginButton({ className, text = 'Login' }: { className?: string, text?: string }) {
  return (
    <button
      onClick={() => signIn('discord', { callbackUrl: '/dashboard' })}
      className={className || "px-8 py-4 bg-dark-card hover:bg-dark-hover border border-border-dark rounded-lg font-semibold text-white transition-all duration-200"}
    >
      {text}
    </button>
  );
}
