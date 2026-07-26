/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const OWNER_ID = process.env.NEXT_PUBLIC_OWNER_ID || '';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const discordId = (session?.user as any)?.discordId || (session?.user as any)?.id;

    if (!discordId || discordId !== OWNER_ID) {
      return NextResponse.json({ error: 'Unauthorized or Forbidden' }, { status: 403 });
    }

    let botSettings = await prisma.botSettings.findFirst();

    if (!botSettings) {
      botSettings = await prisma.botSettings.create({
        data: {
          activityType: "Watching",
          activityText: "over servers",
          status: "online",
          aiModel: "glm-5.2-free",
        },
      });
    }

    return NextResponse.json(botSettings);
  } catch (error) {
    console.error('Error fetching bot settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const discordId = (session?.user as any)?.discordId || (session?.user as any)?.id;

    if (!discordId || discordId !== OWNER_ID) {
      return NextResponse.json({ error: 'Unauthorized or Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { activityType, activityText, status, maintenanceMode, maintenanceMessage, aiModel } = body;

    let botSettings = await prisma.botSettings.findFirst();

    if (!botSettings) {
      botSettings = await prisma.botSettings.create({
        data: {
          activityType: activityType || "Watching",
          activityText: activityText || "over servers",
          status: status || "online",
          maintenanceMode: maintenanceMode || false,
          maintenanceMessage: maintenanceMessage || null,
          aiModel: aiModel || "glm-5.2-free",
        },
      });
    } else {
      botSettings = await prisma.botSettings.update({
        where: { id: botSettings.id },
        data: {
          activityType: activityType ?? botSettings.activityType,
          activityText: activityText ?? botSettings.activityText,
          status: status ?? botSettings.status,
          maintenanceMode: maintenanceMode ?? botSettings.maintenanceMode,
          maintenanceMessage: maintenanceMessage ?? botSettings.maintenanceMessage,
          aiModel: aiModel ?? botSettings.aiModel,
        },
      });
    }

    return NextResponse.json(botSettings);
  } catch (error) {
    console.error('Error updating bot settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
