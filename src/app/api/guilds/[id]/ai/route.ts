/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { fetchBotGuildIds, fetchUserGuilds } from '@/lib/discord';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const accessToken = (session as any)?.accessToken as string;
    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: guildId } = await params;

    // Check if user is in this guild and has admin rights using Discord API
    const botGuildIds = await fetchBotGuildIds();
    const userGuilds = await fetchUserGuilds(accessToken, botGuildIds);
    const adminGuild = userGuilds.find(g => g.guildId === guildId && (g.isAdmin || g.isOwner));

    if (!adminGuild) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let aiSettings = await prisma.aiSettings.findUnique({
      where: { guildId },
    });

    if (!aiSettings) {
      aiSettings = await prisma.aiSettings.create({
        data: { guildId },
      });
    }

    return NextResponse.json(aiSettings);
  } catch (error) {
    console.error('Error fetching AI settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const accessToken = (session as any)?.accessToken as string;
    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: guildId } = await params;

    // Check if user is in this guild and has admin rights using Discord API
    const botGuildIds = await fetchBotGuildIds();
    const userGuilds = await fetchUserGuilds(accessToken, botGuildIds);
    const adminGuild = userGuilds.find(g => g.guildId === guildId && (g.isAdmin || g.isOwner));

    if (!adminGuild) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    
    // Validate the incoming body against expected fields
    const { 
      chatbotEnabled, 
      chatChannelId, 
      persona, 
      temperature,
      contextLimit,
      responseStyle,
      smartModEnabled, 
      modLogChannelId, 
      tldrEnabled, 
      quoteEnabled 
    } = body;

    const updatedSettings = await prisma.aiSettings.upsert({
      where: { guildId },
      create: {
        guildId,
        chatbotEnabled,
        chatChannelId,
        persona,
        temperature,
        contextLimit,
        responseStyle,
        smartModEnabled,
        modLogChannelId,
        tldrEnabled,
        quoteEnabled
      },
      update: {
        chatbotEnabled,
        chatChannelId,
        persona,
        temperature,
        contextLimit,
        responseStyle,
        smartModEnabled,
        modLogChannelId,
        tldrEnabled,
        quoteEnabled
      },
    });

    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error('Error updating AI settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
