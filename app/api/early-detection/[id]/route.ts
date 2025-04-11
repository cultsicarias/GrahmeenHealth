import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validate ID
    if (!id) {
      return NextResponse.json(
        { error: 'Analysis ID is required' },
        { status: 400 }
      );
    }

    // Find the analysis in the database
    const analysis = await prisma.earlyDetection.findUnique({
      where: { id },
    });

    if (!analysis) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: analysis });
  } catch (error) {
    console.error('Error fetching early detection analysis:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analysis' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validate ID
    if (!id) {
      return NextResponse.json(
        { error: 'Analysis ID is required' },
        { status: 400 }
      );
    }

    // Check if analysis exists
    const existingAnalysis = await prisma.earlyDetection.findUnique({
      where: { id },
    });

    if (!existingAnalysis) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }

    // Delete the analysis from the database
    await prisma.earlyDetection.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Analysis deleted successfully' });
  } catch (error) {
    console.error('Error deleting early detection analysis:', error);
    return NextResponse.json(
      { error: 'Failed to delete analysis' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const {
      symptoms,
      age,
      gender,
      medicalHistory,
      familyHistory,
      lifestyle,
    } = body;

    // Validate ID
    if (!id) {
      return NextResponse.json(
        { error: 'Analysis ID is required' },
        { status: 400 }
      );
    }

    // Check if analysis exists
    const existingAnalysis = await prisma.earlyDetection.findUnique({
      where: { id },
    });

    if (!existingAnalysis) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }

    // Analyze symptoms and determine severity and risk level
    const severity = determineSeverity(symptoms);
    const riskLevel = determineRiskLevel(symptoms, age, gender, medicalHistory, familyHistory, lifestyle);
    const recommendations = generateRecommendations(severity, riskLevel);

    // Update the analysis in the database
    const updatedAnalysis = await prisma.earlyDetection.update({
      where: { id },
      data: {
        symptoms,
        severity,
        riskLevel,
        recommendations,
        age,
        gender,
        medicalHistory,
        familyHistory,
        lifestyle,
      },
    });

    return NextResponse.json({ data: updatedAnalysis });
  } catch (error) {
    console.error('Error updating early detection analysis:', error);
    return NextResponse.json(
      { error: 'Failed to update analysis' },
      { status: 500 }
    );
  }
}

function determineSeverity(symptoms: string): string {
  // This is a simplified example. In a real application, you would use
  // more sophisticated analysis, possibly with machine learning
  const severeKeywords = ['severe', 'intense', 'unbearable', 'extreme'];
  const moderateKeywords = ['moderate', 'manageable', 'intermittent'];
  
  const symptomLower = symptoms.toLowerCase();
  
  if (severeKeywords.some(keyword => symptomLower.includes(keyword))) {
    return 'severe';
  } else if (moderateKeywords.some(keyword => symptomLower.includes(keyword))) {
    return 'moderate';
  }
  
  return 'mild';
}

function determineRiskLevel(
  symptoms: string,
  age: string,
  gender: string,
  medicalHistory: string,
  familyHistory: string,
  lifestyle: string
): string {
  // This is a simplified example. In a real application, you would use
  // more sophisticated analysis, possibly with machine learning
  let riskScore = 0;
  
  // Age factor
  const ageNum = parseInt(age);
  if (ageNum >= 60) riskScore += 2;
  else if (ageNum >= 40) riskScore += 1;
  
  // Symptoms factor
  const severeKeywords = ['severe', 'intense', 'unbearable', 'extreme'];
  const moderateKeywords = ['moderate', 'manageable', 'intermittent'];
  
  const symptomLower = symptoms.toLowerCase();
  if (severeKeywords.some(keyword => symptomLower.includes(keyword))) {
    riskScore += 3;
  } else if (moderateKeywords.some(keyword => symptomLower.includes(keyword))) {
    riskScore += 2;
  } else {
    riskScore += 1;
  }
  
  // Medical history factor
  if (medicalHistory && medicalHistory.length > 0) {
    riskScore += 1;
  }
  
  // Family history factor
  if (familyHistory && familyHistory.length > 0) {
    riskScore += 1;
  }
  
  // Lifestyle factor
  if (lifestyle && lifestyle.toLowerCase().includes('smok')) {
    riskScore += 2;
  }
  
  // Determine risk level based on score
  if (riskScore >= 6) return 'high';
  if (riskScore >= 4) return 'medium';
  return 'low';
}

function generateRecommendations(severity: string, riskLevel: string): string {
  const recommendations: string[] = [];
  
  // Severity-based recommendations
  if (severity === 'severe') {
    recommendations.push(
      'Seek immediate medical attention.',
      'Contact your healthcare provider as soon as possible.',
      'Consider visiting the emergency department if symptoms worsen.'
    );
  } else if (severity === 'moderate') {
    recommendations.push(
      'Schedule an appointment with your healthcare provider.',
      'Monitor your symptoms closely.',
      'Keep a symptom diary to track changes.'
    );
  } else {
    recommendations.push(
      'Monitor your symptoms.',
      'Consider scheduling a routine check-up.',
      'Maintain a healthy lifestyle and follow preventive measures.'
    );
  }
  
  // Risk level-based recommendations
  if (riskLevel === 'high') {
    recommendations.push(
      'Follow up with regular medical check-ups.',
      'Consider additional diagnostic tests.',
      'Implement lifestyle changes to reduce risk factors.'
    );
  } else if (riskLevel === 'medium') {
    recommendations.push(
      'Schedule regular health screenings.',
      'Maintain a healthy diet and exercise routine.',
      'Reduce stress and get adequate sleep.'
    );
  } else {
    recommendations.push(
      'Continue with regular health check-ups.',
      'Maintain healthy habits.',
      'Stay informed about preventive health measures.'
    );
  }
  
  return recommendations.join('\n\n');
} 