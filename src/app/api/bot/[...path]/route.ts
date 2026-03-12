import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

const BOT_API_URL = process.env.BOT_API_URL || 'http://localhost:4000/api';
const INTERNAL_API_KEY = process.env.BOT_INTERNAL_API_KEY || '';
const OWNER_ID = process.env.NEXT_PUBLIC_OWNER_ID || '';

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { path } = await params;
  const botPath = path.join('/');
  const search = req.nextUrl.search || '';
  const url = `${BOT_API_URL}/${botPath}${search}`;

    const discordId = (session.user as { id?: string, discordId?: string }).id || (session.user as any).discordId || '';
  const isOwner = discordId === OWNER_ID;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-api-key': INTERNAL_API_KEY,
    'x-discord-id': discordId,
    'x-discord-username': session.user.name || '',
    'x-is-owner': String(isOwner),
  };

  const options: RequestInit = {
    method: req.method,
    headers,
  };

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    options.body = await req.text();
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    console.error(`[BotProxy] Failed to proxy ${req.method} /${botPath}:`, err);
    return NextResponse.json(
      { success: false, error: 'Failed to reach bot API' },
      { status: 502 }
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
