import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Patient from '@/models/Patient';
import User from '@/models/User';

// Mock visit data for demonstration purposes
// In a real app, this would come from a proper database collection
const mockVisits = [
  {
    _id: '111aaa222bbb333ccc444ddd',
    doctorName: 'Dr. Sarah Johnson',
    date: '2023-11-15T10:00:00.000Z',
    symptoms: ['Fever', 'Cough', 'Fatigue'],
    diagnosis: 'Acute bronchitis',
    treatment: 'Rest, fluids, and prescribed antibiotics',
    followUpDate: '2023-11-29T10:00:00.000Z',
    notes: 'Patient should return if symptoms worsen',
    status: 'completed'
  },
  {
    _id: '222bbb333ccc444ddd555eee',
    doctorName: 'Dr. Michael Chen',
    date: '2023-10-03T14:30:00.000Z',
    symptoms: ['Headache', 'Dizziness'],
    diagnosis: 'Migraine',
    treatment: 'Prescribed sumatriptan, dark room rest',
    notes: 'Patient reports history of migraines in family',
    status: 'completed'
  },
  {
    _id: '333ccc444ddd555eee666fff',
    doctorName: 'Dr. Sarah Johnson',
    date: '2023-12-20T09:15:00.000Z',
    symptoms: ['Annual check-up'],
    diagnosis: 'Routine examination',
    treatment: 'No treatment necessary',
    status: 'scheduled'
  }
];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only patients can access this endpoint
    if (session.user.role !== 'patient') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    await connectDB();
    
    // If the patient has a profileId in their session, use that directly
    let patient = null;
    if (session.user.profileId) {
      patient = await Patient.findById(session.user.profileId);
      
      if (patient) {
        // Add mock visit data for demonstration
        const patientData = patient.toObject();
        patientData.visits = mockVisits;
        return NextResponse.json({ patient: patientData });
      }
    }
    
    // Otherwise look up the patient by userId
    const user = await User.findById(session.user.id);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    patient = await Patient.findOne({ userId: user._id });
    
    if (!patient) {
      return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 });
    }
    
    // Add mock visit data for demonstration
    const patientData = patient.toObject();
    patientData.visits = mockVisits;
    
    return NextResponse.json({ patient: patientData });
  } catch (error) {
    console.error('Error fetching patient profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patient profile' },
      { status: 500 }
    );
  }
} 