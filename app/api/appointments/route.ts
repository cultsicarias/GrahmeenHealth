import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Appointment from '@/models/Appointment';
import { getDoctorById } from '@/lib/hardcodedDoctors';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    const { 
      doctorId, 
      date, 
      time,
      symptoms,
      additionalInfo
    } = body;

    // Validate required fields
    if (!doctorId || !date || !time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!Array.isArray(symptoms) || !symptoms.every(s => s.name)) {
      return NextResponse.json({ error: 'Invalid symptoms format' }, { status: 400 });
    }

    // Connect to MongoDB
    await connectDB();

    // Get current user
    const user = await User.findById(session.user.id);
    
    if (!user) {
      return NextResponse.json({ 
        error: 'User not found',
        userId: session.user.id
      }, { status: 404 });
    }

    // Verify this is a patient account
    if (user.role !== 'patient') {
      return NextResponse.json({ error: 'Only patients can book appointments' }, { status: 403 });
    }

    // Check if doctor exists
    let doctorName = '';
    const hardcodedDoctor = getDoctorById(doctorId);
    
    if (hardcodedDoctor) {
      doctorName = hardcodedDoctor.name;
    } else {
      const registeredDoctor = await User.findOne({ 
        _id: doctorId,
        role: 'doctor'
      });
      
      if (!registeredDoctor) {
        return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
      }
      
      doctorName = registeredDoctor.name;
    }

    // Create the appointment
    const appointment = await Appointment.create({
      patientId: user._id,
      patientName: user.name,
      doctorId,
      doctorName,
      date,
      time,
      symptoms,
      additionalInfo,
      status: 'scheduled',
      createdAt: new Date()
    });

    return NextResponse.json({
      message: 'Appointment booked successfully',
      appointment
    });
  } catch (error: any) {
    console.error('Error booking appointment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to book appointment' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to MongoDB
    await connectDB();

    // Get the current user
    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ 
        error: 'User not found',
        sessionInfo: {
          userId: session.user.id,
          role: session.user.role
        }
      }, { status: 404 });
    }

    let appointments = [];

    if (user.role === 'patient') {
      // Fetch appointments for patient
      appointments = await Appointment.find({ patientId: user._id })
        .sort({ date: 1 });

      // Format response with doctor information from hardcoded data or registered doctors
      appointments = await Promise.all(appointments.map(async (appointment) => {
        const appointmentObj = appointment.toObject();
        
        // Try to get hardcoded doctor first
        const hardcodedDoctor = getDoctorById(appointmentObj.doctorId.toString() || appointmentObj.doctorId);
        
        if (hardcodedDoctor) {
          return {
            ...appointmentObj,
            doctorName: hardcodedDoctor.name || appointmentObj.doctorName,
            doctorEmail: hardcodedDoctor.email || '',
            doctorSpecialization: hardcodedDoctor.specialization || 'General',
            doctorImageUrl: hardcodedDoctor.imageUrl || '',
          };
        } else {
          // Try to get registered doctor
          const registeredDoctor = await User.findById(appointmentObj.doctorId);
          
          return {
            ...appointmentObj,
            doctorName: registeredDoctor?.name || appointmentObj.doctorName,
            doctorEmail: registeredDoctor?.email || '',
            doctorSpecialization: 'Specialist',
            doctorImageUrl: '/default-doctor.jpg',
          };
        }
      }));
    } 
    else if (user.role === 'doctor') {
      console.log('Fetching appointments for doctor:', { 
        userId: user._id, 
        isHardcoded: session.user.isHardcoded 
      });

      // Debug: Check all appointments in the collection
      const allAppointments = await Appointment.find({}).lean();
      console.log('All appointments in DB:', JSON.stringify(allAppointments, null, 2));

      // For doctors, we need to use their profileId since that's what's stored in appointments
      const doctorId = session.user.profileId || user._id.toString();
      console.log('Using doctorId for query:', doctorId, '(profileId from session:', session.user.profileId, ')')

      // Fetch appointments for doctor
      appointments = await Appointment.find({ doctorId })
        .sort({ date: 1 });

      console.log('Found appointments for this doctor:', appointments.length);
      if (appointments.length === 0) {
        console.log('Debug - checking doctorId type in DB:', {
          queryDoctorId: doctorId,
          queryDoctorIdType: typeof doctorId,
          firstAppointmentDoctorId: allAppointments[0]?.doctorId,
          firstAppointmentDoctorIdType: typeof allAppointments[0]?.doctorId
        });
      }
        
      // Format with patient information
      appointments = await Promise.all(appointments.map(async (appointment) => {
        const appointmentObj = appointment.toObject();
        const patient = await User.findById(appointmentObj.patientId);
        
        return {
          ...appointmentObj,
          patientName: patient?.name || appointmentObj.patientName,
          patientEmail: patient?.email || '',
        };
      }));
    } else {
      return NextResponse.json({ error: 'Invalid user role' }, { status: 403 });
    }

    return NextResponse.json({ 
      status: 'success', 
      data: appointments 
    });
  } catch (error: any) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: error.message || 'Failed to fetch appointments' 
      },
      { status: 500 }
    );
  }
}
