import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Validate user ID
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Validate date range
    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Start date and end date are required' },
        { status: 400 }
      );
    }

    // Parse dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validate date format
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format. Please use ISO 8601 format (YYYY-MM-DD)' },
        { status: 400 }
      );
    }

    // Validate date range
    if (end < start) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    // Set end date to end of day
    end.setHours(23, 59, 59, 999);

    // Fetch all analyses for the user within the date range
    const analyses = await prisma.earlyDetection.findMany({
      where: {
        userId,
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ data: analyses });
  } catch (error) {
    console.error('Error fetching user early detection analyses by date range:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analyses' },
      { status: 500 }
    );
  }
} 