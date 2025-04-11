import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    // Validate user ID
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Fetch all analyses for the user from the database
    const analyses = await prisma.earlyDetection.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ data: analyses });
  } catch (error) {
    console.error('Error fetching user early detection analyses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analyses' },
      { status: 500 }
    );
  }
} 