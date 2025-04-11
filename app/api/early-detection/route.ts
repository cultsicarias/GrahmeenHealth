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

    // TODO: Implement AI analysis logic here
    // For now, we'll just return a mock analysis
    const mockAnalysis = {
      riskLevel: 'low',
      potentialConditions: ['Common cold', 'Seasonal allergies'],
      recommendations: [
        'Get plenty of rest',
        'Stay hydrated',
        'Monitor symptoms',
        'Consult a doctor if symptoms worsen',
      ],
    };

    // Update analysis with results
    const updatedAnalysis = await prisma.earlyDetection.update({
      where: { id: analysis.id },
      data: {
        status: 'completed',
        riskLevel: mockAnalysis.riskLevel,
        potentialConditions: mockAnalysis.potentialConditions,
        recommendations: mockAnalysis.recommendations,
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

function generatePossibleConditions(symptoms: string[]): string[] {
  // This is a simplified version. In a real application, you would use
  // a more sophisticated algorithm or ML model to determine possible conditions
  const conditions: { [key: string]: string[] } = {
    fever: ['Common Cold', 'Flu', 'COVID-19', 'Infection'],
    cough: ['Common Cold', 'Flu', 'COVID-19', 'Bronchitis'],
    headache: ['Migraine', 'Tension Headache', 'Sinusitis'],
    fatigue: ['Anemia', 'Depression', 'Chronic Fatigue Syndrome'],
    'chest pain': ['Angina', 'Heart Attack', 'Pneumonia'],
    'shortness of breath': ['Asthma', 'COPD', 'Heart Failure'],
  };

  const possibleConditions = new Set<string>();
  symptoms.forEach((symptom) => {
    const condition = conditions[symptom.toLowerCase()];
    if (condition) {
      condition.forEach((c) => possibleConditions.add(c));
    }
  });

  return Array.from(possibleConditions);
}

function generateRecommendations(
  severity: string,
  possibleConditions: string[],
  emergencyRating: number
): string[] {
  const recommendations: string[] = [];

  if (emergencyRating >= 8) {
    recommendations.push('Seek immediate medical attention');
  } else if (emergencyRating >= 5) {
    recommendations.push('Schedule a doctor appointment within 24 hours');
  } else {
    recommendations.push('Monitor symptoms and rest');
  }

  if (possibleConditions.includes('COVID-19')) {
    recommendations.push('Get tested for COVID-19');
    recommendations.push('Self-isolate until test results are available');
  }

  if (possibleConditions.includes('Flu')) {
    recommendations.push('Get tested for influenza');
    recommendations.push('Stay hydrated and rest');
  }

  if (possibleConditions.includes('Heart Attack')) {
    recommendations.push('Call emergency services immediately');
    recommendations.push('Take aspirin if available and not allergic');
  }

  recommendations.push('Stay hydrated');
  recommendations.push('Get adequate rest');
  recommendations.push('Monitor symptoms for any changes');

  return recommendations;
}

function calculateEstimatedDuration(severity: string): number {
  const durationMap: { [key: string]: number } = {
    mild: 3,
    moderate: 7,
    severe: 14,
    critical: 30,
  };

  return durationMap[severity] || 7;
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

export async function GET() {
  try {
    // Fetch all analyses from the database
    const analyses = await prisma.earlyDetection.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ data: analyses });
  } catch (error) {
    console.error('Error fetching early detection analyses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analyses' },
      { status: 500 }
    );
  }
} 