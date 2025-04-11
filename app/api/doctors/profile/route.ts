import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Doctor from '@/models/Doctor';
import User from '@/models/User';
import { getDoctorById } from '@/lib/hardcodedDoctors';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only doctors can access this endpoint
    if (session.user.role !== 'doctor') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Check if this is a hardcoded doctor
    if (session.user.isHardcoded && session.user.profileId) {
      const doctor = getDoctorById(session.user.profileId);
      if (doctor) {
        return NextResponse.json({ doctor });
      }
    }

    await connectDB();
    
    // If the doctor has a profileId in their session, use that directly
    if (session.user.profileId) {
      const doctor = await Doctor.findById(session.user.profileId);
      
      if (doctor) {
        return NextResponse.json({ doctor });
      }
    }
    
    // Otherwise look up the doctor by userId
    const user = await User.findById(session.user.id);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const doctor = await Doctor.findOne({ userId: user._id });
    
    if (!doctor) {
      return NextResponse.json({ error: 'Doctor profile not found' }, { status: 404 });
    }
    
    return NextResponse.json({ doctor });
  } catch (error) {
    console.error('Error fetching doctor profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch doctor profile' },
      { status: 500 }
    );
  }
} 