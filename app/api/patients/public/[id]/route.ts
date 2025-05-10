import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Patient from '@/models/Patient';
import User from '@/models/User';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const patient = await Patient.findById(params.id);
    
    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Get user information
    const user = await User.findById(patient.userId);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Combine patient and user data
    const patientData = {
      name: user.name,
      email: user.email,
      phone: patient.phone,
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      bloodGroup: patient.bloodGroup,
      height: patient.height,
      weight: patient.weight,
      allergies: patient.allergies,
      medicalConditions: patient.medicalConditions,
      medications: patient.medications,
      emergencyContact: patient.emergencyContact
    };

    return NextResponse.json({ patient: patientData });
  } catch (error) {
    console.error('Error fetching patient data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patient data' },
      { status: 500 }
    );
  }
} 