'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { FiSearch, FiFilter, FiStar, FiClock, FiDollarSign, FiMapPin, FiCheckCircle } from 'react-icons/fi';

// Define Doctor type
interface Doctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  experience: number;
  qualifications: string;
  imageUrl: string;
  about: string;
  rating: number;
  availability: {
    days: string[];
    startTime: string;
    endTime: string;
  };
  isHardcoded?: boolean;
  consultationFee?: number;
  languages?: string[];
}

export default function DoctorsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filtering states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/doctors');
        if (!response.ok) {
          throw new Error('Failed to fetch doctors');
        }

        const data = await response.json();
        setDoctors(data.doctors);

        // Extract unique specializations for filter
        const uniqueSpecializations = Array.from(
          new Set(data.doctors.map((doctor: Doctor) => doctor.specialization))
        );
        setSpecializations(uniqueSpecializations as string[]);
      } catch (err: any) {
        setError(err.message || 'Error loading doctors');
        console.error('Error fetching doctors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Filter doctors based on search and specialization
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      searchTerm === '' ||
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.about.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecialization =
      selectedSpecialization === '' ||
      doctor.specialization === selectedSpecialization;

    return matchesSearch && matchesSpecialization;
  });

  const handleBookAppointment = (doctorId: string) => {
    router.push(`/appointments/book?doctorId=${doctorId}`);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Please sign in to view doctors</h1>
        <Link href="/login" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Sign In
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 w-full max-w-2xl">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-blue-500 hover:text-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Find a Doctor</h1>
        <p className="text-gray-600 mt-2">
          Choose from our network of experienced healthcare professionals
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-8 bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search doctors by name, specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiFilter className="mr-2 h-5 w-5" />
            Filter
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialization
                </label>
                <select
                  value={selectedSpecialization}
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">All Specializations</option>
                  {specializations.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setSelectedSpecialization('');
                  setSearchTerm('');
                }}
                className="mr-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Doctors List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No doctors found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          filteredDoctors.map((doctor) => (
            <div key={doctor.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-16 w-16">
                    <img
                      className="h-16 w-16 rounded-full object-cover"
                      src={doctor.imageUrl || '/doctor-placeholder.png'}
                      alt={doctor.name}
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {doctor.name}
                    </h3>
                    <p className="text-sm text-blue-600 font-medium">
                      {doctor.specialization}
                    </p>
                    <div className="flex items-center mt-1">
                      <div className="flex items-center">
                        <FiStar className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-600">
                          {doctor.rating || 4.5}
                        </span>
                      </div>
                      <span className="mx-2 text-gray-300">•</span>
                      <div className="flex items-center">
                        <FiClock className="h-4 w-4 text-gray-400" />
                        <span className="ml-1 text-sm text-gray-600">
                          {doctor.experience} years exp.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-500 line-clamp-3">
                    {doctor.about || `Experienced ${doctor.specialization} with over ${doctor.experience} years of practice.`}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <FiCheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      <span>Available Today</span>
                    </div>
                    <div>
                      <button
                        onClick={() => handleBookAppointment(doctor.id)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View Doctor Detail Link */}
      <div className="mt-8 text-center">
        <Link 
          href="/appointments/book" 
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Go to Appointment Booking →
        </Link>
      </div>
    </div>
  );
} 