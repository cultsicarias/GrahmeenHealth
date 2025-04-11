import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { userId: string; severity: string } }
) {
  try {
    const { userId, severity } = params;

    // Validate user ID and severity
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!severity) {
      return NextResponse.json(
        { error: 'Severity level is required' },
        { status: 400 }
      );
    }

    // Validate severity level
    const validSeverityLevels = ['mild', 'moderate', 'severe'];
    if (!validSeverityLevels.includes(severity.toLowerCase())) {
      return NextResponse.json(
        { error: 'Invalid severity level. Must be mild, moderate, or severe' },
        { status: 400 }
      );
    }

    // Fetch all analyses for the user with the specified severity level
    const analyses = await prisma.earlyDetection.findMany({
      where: {
        userId,
        severity: severity.toLowerCase(),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ data: analyses });
  } catch (error) {
    console.error('Error fetching user early detection analyses by severity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analyses' },
      { status: 500 }
    );
  }
} 