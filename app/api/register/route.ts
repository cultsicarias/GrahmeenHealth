import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Doctor from '@/models/Doctor';
import Patient from '@/models/Patient';
import { hardcodedDoctors } from '@/lib/hardcodedDoctors';
import { generateRandomDoctorData } from '@/lib/defaultDoctorData';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      email, 
      password, 
      name, 
      role,
      // Doctor fields
      specialization,
      licenseNumber,
      experience,
      qualifications,
      availability,
      about,
      // Patient fields
      phone,
      dateOfBirth,
      gender,
      bloodGroup,
      height,
      weight,
      allergies,
      medicalConditions,
      medications,
      emergencyContact,
      ...additionalData 
    } = body;

    // Basic validation
    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Role validation
    if (role !== 'doctor' && role !== 'patient') {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Check if trying to register with a hardcoded doctor email
    const isHardcodedDoctor = hardcodedDoctors.some(
      doctor => doctor.email.toLowerCase() === email.toLowerCase()
    );

    if (isHardcodedDoctor) {
      return NextResponse.json(
        { 
          error: 'This email belongs to our pre-approved doctor list',
          message: 'Please use a different email for registration or contact administrator'
        },
        { status: 403 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create base user account
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role
    });

    // Create role-specific profile
    let profileData = null;

    if (role === 'doctor') {
      // Generate random Indian doctor data
      const randomDoctorData = generateRandomDoctorData();
      
      // Create doctor profile with generated data
      profileData = await Doctor.create({
        userId: user._id,
        specialization: specialization || randomDoctorData.specialization,
        licenseNumber: licenseNumber || `MCI-${Math.floor(100000 + Math.random() * 900000)}`, // Random 6-digit license number
        experience: experience ? parseInt(experience.toString()) : randomDoctorData.experience,
        qualifications: qualifications || randomDoctorData.qualifications,
        availability: availability || randomDoctorData.availability,
        about: about || randomDoctorData.about,
        imageUrl: '', // Empty string to use the fallback avatar with initial
        consultationFee: randomDoctorData.consultationFee,
        rating: 4.5 + (Math.random() * 0.5), // Random rating between 4.5 and 5.0
        reviews: [],
        education: randomDoctorData.education,
        awards: randomDoctorData.awards,
        languages: randomDoctorData.languages,
        isAvailable: randomDoctorData.isAvailable
      });
    } else {
      // Create patient profile
      profileData = await Patient.create({
        userId: user._id,
        phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        gender,
        bloodGroup,
        height,
        weight,
        allergies: Array.isArray(allergies) ? allergies.filter(a => a) : [],
        medicalConditions: Array.isArray(medicalConditions) ? medicalConditions.filter(m => m.name) : [],
        medications: Array.isArray(medications) ? medications.filter(m => m.name && m.dosage && m.frequency) : [],
        emergencyContact: emergencyContact?.name ? emergencyContact : undefined
      });
    }

    // Return success without exposing password
    return NextResponse.json(
      { 
        success: true,
        message: 'User registered successfully', 
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          profileId: profileData?._id
        }
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Return more detailed error for debugging
    return NextResponse.json(
      { 
        error: 'Registration failed',
        message: error.message || 'Unknown error', 
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 