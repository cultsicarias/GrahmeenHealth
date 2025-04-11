import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Appointment from '@/models/Appointment';
import { getDoctorById } from '@/lib/hardcodedDoctors';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    // Handle different request formats from different forms
    const { 
      doctorId, 
      date, 
      time, 
      symptoms, 
      severity, 
      duration, 
      reason,
      previousTreatments, 
      allergies, 
      currentMedications, 
      additionalNotes 
    } = body;

    // Validate required fields
    if (!doctorId || !date || !time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
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

    // Check if doctor is a registered doctor or hardcoded doctor
    let doctorName = '';
    const hardcodedDoctor = getDoctorById(doctorId);
    
    if (hardcodedDoctor) {
      // Use hardcoded doctor
      doctorName = hardcodedDoctor.name;
    } else {
      // Check if it's a registered doctor
      const registeredDoctor = await User.findOne({ 
        _id: doctorId,
        role: 'doctor'
      });
      
      if (!registeredDoctor) {
        return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
      }
      
      doctorName = registeredDoctor.name;
    }

    // Format symptoms if array of objects
    let formattedSymptoms = '';
    if (Array.isArray(symptoms)) {
      formattedSymptoms = symptoms
        .filter(s => s.name)
        .map(s => `${s.name} (${s.severity}, ${s.duration})`)
        .join('; ');
    } else {
      formattedSymptoms = symptoms || '';
    }

    // Format medications if array of objects
    let formattedMedications = '';
    if (Array.isArray(currentMedications)) {
      formattedMedications = currentMedications
        .filter(m => m.name)
        .map(m => `${m.name} (${m.dosage}, ${m.frequency})`)
        .join('; ');
    } else {
      formattedMedications = currentMedications || '';
    }

    // Create the appointment
    const appointment = await Appointment.create({
      patientId: user._id,
      doctorId: doctorId,
      doctorName: doctorName,
      date: new Date(date),
      time,
      symptoms: formattedSymptoms,
      severity: typeof severity === 'string' ? severity : 'moderate',
      duration: duration || '',
      reason: reason || '',
      previousTreatments: previousTreatments || null,
      allergies: allergies || null,
      currentMedications: formattedMedications,
      additionalNotes: additionalNotes || null,
      status: 'scheduled'
    });

    return NextResponse.json({ 
      success: true,
      appointment
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function GET(req: Request) {
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
            doctorSpecialization: 'Specialist', // You might want to fetch from Doctor model
            doctorImageUrl: '', // You might want to add default image
          };
        }
      }));
    } 
    else if (user.role === 'doctor') {
      // Fetch appointments for doctor
      appointments = await Appointment.find({ doctorId: user._id.toString() })
        .sort({ date: 1 });
        
      // Format with patient information
      appointments = await Promise.all(appointments.map(async (appointment) => {
        const appointmentObj = appointment.toObject();
        
        const patient = await User.findById(appointmentObj.patientId);
        
        return {
          ...appointmentObj,
          patientName: patient?.name || 'Unknown Patient',
          patientEmail: patient?.email || '',
        };
      }));
    }

    return NextResponse.json({ 
      success: true,
      appointments 
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch appointments',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// Helper function to calculate age from date of birth
function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDifference = today.getMonth() - dateOfBirth.getMonth();
  
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dateOfBirth.getDate())) {
    age--;
  }
  
  return age;
} 