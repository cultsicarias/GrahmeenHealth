import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Appointment from '@/models/Appointment';
import { getDoctorById } from '@/lib/hardcodedDoctors';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Please login first' }, { status: 401 });
    }

    const data = await req.json();
    console.log('Received booking data:', {
      ...data,
      doctorId: data.doctorId,
      doctorIdType: typeof data.doctorId
    });

    await connectDB();
    console.log('Connected to MongoDB');

    // Get current user
    const user = await User.findById(session.user.id);
    if (!user) {
      console.log('User not found:', session.user.id);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create appointment
    const appointment = await Appointment.create({
      patientId: user._id,
      patientName: user.name,
      doctorId: data.doctorId,
      doctorName: data.doctorName,
      date: data.date,
      time: data.time,
      symptoms: data.symptoms || [],
      additionalInfo: data.additionalInfo || {},
      status: 'scheduled'
    });

    console.log('Created appointment:', appointment);

    return NextResponse.json({
      success: true,
      message: 'Appointment booked successfully',
      appointment
    });

  } catch (error: any) {
    console.error('Booking error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to book appointment'
    }, { 
      status: 500 
    });
  }
}
