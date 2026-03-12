// src/lib/api.ts

// Use the internal proxy route so API calls are always authenticated via NextAuth session
const BOT_PROXY_URL = '/api/bot';

/**
 * Generic API fetcher that proxies through the Next.js /api/bot route.
 * Works both client-side and server-side (server-side needs absolute URL).
 */
export async function fetchFromBotApi(endpoint: string, options: RequestInit = {}) {
  try {
    // On the server, use absolute URL
    const baseUrl =
      typeof window === 'undefined'
        ? `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}${BOT_PROXY_URL}`
        : BOT_PROXY_URL;

    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();
    return { success: response.ok, data, status: response.status };
  } catch (error) {
    console.error(`Failed to fetch from Bot API [${endpoint}]:`, error);
    return { success: false, data: null, error: (error as Error).message };
  }
}
