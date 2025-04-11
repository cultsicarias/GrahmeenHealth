import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const earlyDetections = await prisma.earlyDetection.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ data: earlyDetections });
  } catch (error) {
    console.error('Error fetching early detection history:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 