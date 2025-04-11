import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const search = searchParams.get('search') || '';

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build where clause for search
    const where = search
      ? {
          OR: [
            { symptoms: { contains: search, mode: 'insensitive' } },
            { severity: { contains: search, mode: 'insensitive' } },
            { riskLevel: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    // Get total count for pagination
    const total = await prisma.earlyDetection.count({ where });

    // Fetch analyses with pagination and sorting
    const analyses = await prisma.earlyDetection.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
      select: {
        id: true,
        symptoms: true,
        severity: true,
        riskLevel: true,
        createdAt: true,
        age: true,
        gender: true,
      },
    });

    return NextResponse.json({
      data: analyses,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching early detection analyses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analyses' },
      { status: 500 }
    );
  }
} 