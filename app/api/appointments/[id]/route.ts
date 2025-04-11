import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Appointment from '@/models/Appointment';
import User from '@/models/User';
import { getDoctorById } from '@/lib/hardcodedDoctors';
import mongoose from 'mongoose';

interface RouteParams {
  params: {
    id: string;
  };
}

// Helper function to validate MongoDB ObjectId
function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id) && 
    /^[0-9a-fA-F]{24}$/.test(id);
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check authentication
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Validate that id is a valid MongoDB ObjectId
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { 
          error: 'Invalid appointment ID format',
          details: `'${id}' is not a valid MongoDB ObjectId`
        },
        { status: 400 }
      );
    }

    await connectDB();

    // Get user details
    const user = await User.findById(session.user.id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get appointment
    const appointment = await Appointment.findById(id);
    
    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Check authorization (user must be either the patient or the doctor)
    const isPatient = user.role === 'patient' && appointment.patientId.toString() === user._id.toString();
    const isDoctor = user.role === 'doctor' && appointment.doctorId === user._id.toString();
    const isHardcodedDoctor = user.role === 'doctor' && user.isHardcoded && appointment.doctorId === session.user.profileId;
    
    if (!isPatient && !isDoctor && !isHardcodedDoctor) {
      return NextResponse.json(
        { error: 'You are not authorized to view this appointment' },
        { status: 403 }
      );
    }

    return NextResponse.json({ 
      success: true,
      appointment
    });
  } catch (error) {
    console.error('Appointment fetch error:', error);
    return NextResponse.json(
      { 
        error: 'Something went wrong while fetching the appointment',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check authentication
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    
    // Validate that id is a valid MongoDB ObjectId
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { 
          error: 'Invalid appointment ID format',
          details: `'${id}' is not a valid MongoDB ObjectId`
        },
        { status: 400 }
      );
    }
    
    const body = await req.json();
    
    await connectDB();

    // Get user details
    const user = await User.findById(session.user.id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get appointment
    const appointment = await Appointment.findById(id);
    
    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Check authorization
    const isPatient = user.role === 'patient' && appointment.patientId.toString() === user._id.toString();
    const isDoctor = user.role === 'doctor' && appointment.doctorId === user._id.toString();
    const isHardcodedDoctor = user.role === 'doctor' && user.isHardcoded && appointment.doctorId === session.user.profileId;
    
    // For appointment status changes
    if (body.status) {
      // Status changes are allowed by both doctors and patients
      if (body.status === 'cancelled' && !isPatient && !isDoctor && !isHardcodedDoctor) {
        return NextResponse.json(
          { error: 'Only the patient or doctor can cancel this appointment' },
          { status: 403 }
        );
      }
      
      // Marking as completed is doctor-only
      if (body.status === 'completed' && !isDoctor && !isHardcodedDoctor) {
        return NextResponse.json(
          { error: 'Only the doctor can mark appointment as completed' },
          { status: 403 }
        );
      }
      
      // Update the appointment status
      const updatedAppointment = await Appointment.findByIdAndUpdate(
        id,
        { status: body.status },
        { new: true }
      );
      
      return NextResponse.json({ 
        success: true,
        message: `Appointment ${body.status} successfully`,
        appointment: updatedAppointment
      });
    } 
    // For other updates (symptoms, notes, etc.)
    else {
      if (!isPatient && !isDoctor && !isHardcodedDoctor) {
        return NextResponse.json(
          { error: 'You are not authorized to update this appointment' },
          { status: 403 }
        );
      }
      
      // Different allowed updates for patients and doctors
      let updatedFields = {};
      
      if (isPatient) {
        // Patients can only update certain fields
        const allowedPatientUpdates = ['symptoms', 'severity', 'duration', 'reason', 'previousTreatments', 'allergies', 'currentMedications', 'additionalNotes'];
        Object.keys(body).forEach(key => {
          if (allowedPatientUpdates.includes(key)) {
            updatedFields[key] = body[key];
          }
        });
      } else if (isDoctor || isHardcodedDoctor) {
        // Doctors can update diagnosis, prescriptions, notes, etc.
        updatedFields = body;
      }
      
      // Update appointment with allowed fields
      const updatedAppointment = await Appointment.findByIdAndUpdate(
        id,
        { $set: updatedFields },
        { new: true }
      );
      
      return NextResponse.json({ 
        success: true,
        message: 'Appointment updated successfully',
        appointment: updatedAppointment
      });
    }
  } catch (error) {
    console.error('Appointment update error:', error);
    return NextResponse.json(
      { 
        error: 'Something went wrong while updating the appointment',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check authentication
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    
    // Validate that id is a valid MongoDB ObjectId
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { 
          error: 'Invalid appointment ID format',
          details: `'${id}' is not a valid MongoDB ObjectId`
        },
        { status: 400 }
      );
    }
    
    await connectDB();

    // Get user details
    const user = await User.findById(session.user.id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get appointment
    const appointment = await Appointment.findById(id);
    
    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Check authorization (patient can cancel their own appointment, doctor can cancel any of their appointments)
    const isPatient = user.role === 'patient' && appointment.patientId.toString() === user._id.toString();
    const isDoctor = user.role === 'doctor' && appointment.doctorId === user._id.toString();
    const isHardcodedDoctor = user.role === 'doctor' && user.isHardcoded && appointment.doctorId === session.user.profileId;
    
    if (!isPatient && !isDoctor && !isHardcodedDoctor) {
      return NextResponse.json(
        { error: 'You are not authorized to cancel this appointment' },
        { status: 403 }
      );
    }

    // Instead of deleting, mark as cancelled
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { status: 'cancelled' },
      { new: true }
    );

    return NextResponse.json({ 
      success: true,
      message: 'Appointment cancelled successfully',
      appointment: updatedAppointment
    });
  } catch (error) {
    console.error('Appointment cancellation error:', error);
    return NextResponse.json(
      { 
        error: 'Something went wrong while cancelling the appointment',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 