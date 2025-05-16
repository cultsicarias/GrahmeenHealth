import { NextResponse } from 'next/server';
import { calculateEmergencyRating, predictPossibleConditions, estimateAppointmentDuration, generateRecommendations } from '@/lib/earlyDetection';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      symptoms,
      severity,
      age,
      gender,
      medicalHistory,
      familyHistory,
      lifestyle,
    } = body;

    // Create early detection analysis
    const analysis = await prisma.earlyDetection.create({
      data: {
        userId: session.user.id,
        symptoms,
        severity,
        age: parseInt(age),
        gender,
        medicalHistory,
        familyHistory,
        lifestyle,
        status: 'pending',
      },
    });

    // Calculate emergency rating and possible conditions
    const emergencyRating = calculateEmergencyRating(symptoms, severity);
    const possibleConditions = predictPossibleConditions(symptoms);
    const recommendations = generateRecommendations(symptoms, severity);

    // Update analysis with results
    const updatedAnalysis = await prisma.earlyDetection.update({
      where: { id: analysis.id },
      data: {
        status: 'completed',
        riskLevel: emergencyRating > 7 ? 'high' : emergencyRating > 4 ? 'medium' : 'low',
        potentialConditions: possibleConditions,
        recommendations: recommendations,
      },
    });

    return NextResponse.json({ data: updatedAnalysis });
  } catch (error) {
    console.error('Error in early detection analysis:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (userId && userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const earlyDetections = await prisma.earlyDetection.findMany({
      where: {
        userId: userId || session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ success: true, data: earlyDetections });
  } catch (error) {
    console.error('Error fetching early detections:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 