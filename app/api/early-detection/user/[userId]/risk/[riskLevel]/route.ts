import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { userId: string; riskLevel: string } }
) {
  try {
    const { userId, riskLevel } = params;

    // Validate user ID and risk level
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!riskLevel) {
      return NextResponse.json(
        { error: 'Risk level is required' },
        { status: 400 }
      );
    }

    // Validate risk level
    const validRiskLevels = ['low', 'medium', 'high'];
    if (!validRiskLevels.includes(riskLevel.toLowerCase())) {
      return NextResponse.json(
        { error: 'Invalid risk level. Must be low, medium, or high' },
        { status: 400 }
      );
    }

    // Fetch all analyses for the user with the specified risk level
    const analyses = await prisma.earlyDetection.findMany({
      where: {
        userId,
        riskLevel: riskLevel.toLowerCase(),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ data: analyses });
  } catch (error) {
    console.error('Error fetching user early detection analyses by risk level:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analyses' },
      { status: 500 }
    );
  }
} 