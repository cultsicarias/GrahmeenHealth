import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Doctor from '@/models/Doctor';
import { getAllDoctors } from '@/lib/hardcodedDoctors';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const specialization = searchParams.get('specialization');
    const availability = searchParams.get('availability');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined;
    const includeHardcoded = searchParams.get('includeHardcoded') !== 'false'; // Default to true
    const doctorId = searchParams.get('doctorId');
    
    // Get hardcoded doctors
    let hardcodedDoctorsList = [];
    if (includeHardcoded) {
      hardcodedDoctorsList = getAllDoctors()
        .filter(doctor => 
          !specialization || doctor.specialization.toLowerCase().includes(specialization.toLowerCase())
        )
        .map(doctor => ({
          id: doctor._id,
          _id: doctor._id,
          name: doctor.name,
          email: doctor.email,
          specialization: doctor.specialization,
          experience: doctor.experience,
          qualifications: doctor.qualifications,
          licenseNumber: doctor.licenseNumber,
          availability: doctor.availability,
          about: doctor.about,
          imageUrl: doctor.imageUrl,
          rating: 4.8,
          isHardcoded: true
        }));
    }

    // Connect to MongoDB for registered doctors
    await connectDB();

    // Build the query for registered doctors
    let query: any = {};
    if (specialization) {
      query.specialization = { $regex: specialization, $options: 'i' };
    }

    // Find registered doctors with their user info
    const registeredDoctors = await Doctor.find(query)
      .populate('userId', 'name email')
      .lean();

    // Format registered doctors to match the structure
    const formattedRegisteredDoctors = registeredDoctors.map(doctor => ({
      id: doctor._id.toString(),
      _id: doctor._id.toString(),
      name: doctor.userId.name,
      email: doctor.userId.email,
      specialization: doctor.specialization,
      experience: doctor.experience || 0,
      qualifications: doctor.qualifications || '',
      licenseNumber: doctor.licenseNumber || '',
      availability: doctor.availability,
      about: doctor.about || '',
      imageUrl: doctor.imageUrl || 'https://randomuser.me/api/portraits/men/1.jpg',
      rating: doctor.rating || 4.0,
      isHardcoded: false
    }));

    // Combine both lists
    let allDoctors = [...hardcodedDoctorsList, ...formattedRegisteredDoctors];
    
    // Apply limit if specified
    if (limit && limit > 0) {
      allDoctors = allDoctors.slice(0, limit);
    }

    // Add handling for doctorId query parameter
    if (doctorId) {
      // If doctorId is provided, return just that doctor
      // First check hardcoded doctors
      if (includeHardcoded) {
        const hardcodedDoctor = hardcodedDoctorsList.find(
          doctor => doctor._id === doctorId || doctor.id === doctorId
        );
        if (hardcodedDoctor) {
          return NextResponse.json({ 
            success: true,
            doctors: [hardcodedDoctor]
          });
        }
      }

      // Then check registered doctors
      const registeredDoctor = await Doctor.findById(doctorId)
        .populate('userId', 'name email')
        .lean();
      
      if (registeredDoctor) {
        const formattedDoctor = {
          id: registeredDoctor._id.toString(),
          _id: registeredDoctor._id.toString(),
          name: registeredDoctor.userId.name,
          email: registeredDoctor.userId.email,
          specialization: registeredDoctor.specialization,
          experience: registeredDoctor.experience || 0,
          qualifications: registeredDoctor.qualifications || '',
          licenseNumber: registeredDoctor.licenseNumber || '',
          availability: registeredDoctor.availability,
          about: registeredDoctor.about || '',
          imageUrl: registeredDoctor.imageUrl || 'https://randomuser.me/api/portraits/men/1.jpg',
          rating: registeredDoctor.rating || 4.0,
          isHardcoded: false
        };
        
        return NextResponse.json({ 
          success: true,
          doctors: [formattedDoctor]
        });
      }
      
      // If no doctor found with this ID
      return NextResponse.json({ 
        success: false,
        doctors: [],
        message: 'Doctor not found'
      });
    }

    return NextResponse.json({ 
      success: true,
      doctors: allDoctors
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 