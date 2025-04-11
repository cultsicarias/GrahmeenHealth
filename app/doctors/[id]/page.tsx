'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FiCalendar, FiStar, FiClock, FiAward, FiBookOpen, FiUser, FiMessageCircle, FiDollarSign, FiChevronLeft } from 'react-icons/fi';

interface Doctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  experience: number;
  qualifications: string;
  licenseNumber: string;
  about: string;
  imageUrl: string;
  rating: number;
  availability: {
    days: string[];
    startTime: string;
    endTime: string;
  };
  education?: Array<{
    degree: string;
    institution: string;
    year: number;
  }>;
  awards?: string[];
  languages?: string[];
  consultationFee?: number;
}

interface DoctorDetailsProps {
  params: {
    id: string;
  };
}

export default function DoctorDetailsPage({ params }: DoctorDetailsProps) {
  const { id } = params;
  const router = useRouter();
  const { data: session, status } = useSession();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/doctors?includeHardcoded=true`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch doctor details');
        }

        const data = await response.json();
        const foundDoctor = data.doctors.find((doc: any) => doc.id === id || doc._id === id);
        
        if (!foundDoctor) {
          throw new Error('Doctor not found');
        }

        // Set default education if none provided
        if (!foundDoctor.education || foundDoctor.education.length === 0) {
          foundDoctor.education = [
            {
              degree: 'MD',
              institution: 'University Medical School',
              year: new Date().getFullYear() - foundDoctor.experience - 4
            },
            {
              degree: 'Residency',
              institution: 'City General Hospital',
              year: new Date().getFullYear() - foundDoctor.experience
            }
          ];
        }

        // Set default languages if none provided
        if (!foundDoctor.languages || foundDoctor.languages.length === 0) {
          foundDoctor.languages = ['English', 'Spanish'];
        }

        // Set default consultation fee
        if (!foundDoctor.consultationFee) {
          foundDoctor.consultationFee = 120;
        }

        setDoctor(foundDoctor);
      } catch (err: any) {
        setError(err.message || 'Error loading doctor details');
        console.error('Error fetching doctor details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [id]);

  useEffect(() => {
    // Generate available time slots based on selected date
    if (selectedDate && doctor) {
      const today = new Date().toISOString().split('T')[0];
      const isToday = selectedDate === today;
      const currentHour = new Date().getHours();
      
      // Generate time slots from 9 AM to 5 PM
      const slots = [];
      const startHour = parseInt(doctor.availability.startTime.split(':')[0]) || 9;
      const endHour = parseInt(doctor.availability.endTime.split(':')[0]) || 17;
      
      for (let hour = startHour; hour < endHour; hour++) {
        // Skip past hours if today
        if (isToday && hour <= currentHour) continue;
        
        // Add 00 and 30 minute slots
        slots.push(`${hour.toString().padStart(2, '0')}:00`);
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
      
      setAvailableSlots(slots);
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDate, doctor]);

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedSlot) {
      alert('Please select both date and time for your appointment');
      return;
    }
    
    router.push(`/appointments/book?doctorId=${id}&date=${selectedDate}&time=${selectedSlot}`);
  };

  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    // Generate next 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      
      // Skip days not in doctor's availability
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      if (doctor?.availability.days.includes(dayName)) {
        dates.push({
          date: date.toISOString().split('T')[0],
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          dayNum: date.getDate()
        });
      }
    }
    
    return dates;
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
        <h1 className="text-2xl font-bold mb-4">Please sign in to view doctor details</h1>
        <Link href="/login" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Sign In
        </Link>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 w-full max-w-2xl">
          <p className="text-red-700">{error || 'Doctor not found'}</p>
          <Link 
            href="/doctors" 
            className="mt-2 inline-flex items-center text-blue-500 hover:text-blue-700"
          >
            <FiChevronLeft className="mr-1" /> Back to Doctors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <Link 
        href="/doctors" 
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <FiChevronLeft className="mr-1" /> Back to Doctors
      </Link>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Doctor Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <div className="flex-shrink-0 h-32 w-32 mb-4 md:mb-0">
              <img
                className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
                src={doctor.imageUrl || '/doctor-placeholder.png'}
                alt={doctor.name}
              />
            </div>
            <div className="md:ml-6 text-center md:text-left">
              <h1 className="text-3xl font-bold">{doctor.name}</h1>
              <p className="text-blue-100 text-lg">{doctor.specialization}</p>
              <div className="flex items-center justify-center md:justify-start mt-2">
                <div className="flex items-center bg-blue-700 bg-opacity-40 rounded-full px-3 py-1">
                  <FiStar className="h-4 w-4 text-yellow-300" />
                  <span className="ml-1 text-white">{doctor.rating.toFixed(1)}</span>
                </div>
                <span className="mx-2 text-blue-200">•</span>
                <div className="flex items-center">
                  <FiClock className="h-4 w-4 text-blue-200" />
                  <span className="ml-1 text-white">{doctor.experience} years experience</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-6">
          {/* Doctor Info Section */}
          <div className="lg:col-span-2 p-6">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">About</h2>
              <p className="text-gray-600">
                {doctor.about || `Dr. ${doctor.name} is a highly skilled ${doctor.specialization} with over ${doctor.experience} years of experience. Specialized in providing comprehensive care and dedicated to improving patient outcomes.`}
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Education</h2>
              <div className="space-y-3">
                {doctor.education?.map((edu, index) => (
                  <div key={index} className="flex">
                    <div className="flex-shrink-0">
                      <FiBookOpen className="h-5 w-5 text-blue-500 mt-0.5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-800 font-medium">{edu.degree}</p>
                      <p className="text-gray-600 text-sm">{edu.institution}, {edu.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Qualifications</h2>
              <p className="text-gray-600">{doctor.qualifications || 'Board Certified'}</p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Languages</h2>
              <div className="flex flex-wrap gap-2">
                {doctor.languages?.map((language, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                    {language}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Appointment Booking Section */}
          <div className="lg:col-span-1 bg-gray-50 p-6 lg:border-l border-gray-200">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Book Appointment</h2>
              <div className="flex items-center text-gray-600 mb-4">
                <FiDollarSign className="h-5 w-5 text-blue-500 mr-2" />
                <span>Consultation Fee: ${doctor.consultationFee}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FiClock className="h-5 w-5 text-blue-500 mr-2" />
                <span>Available: {doctor.availability.days.join(', ')}, {doctor.availability.startTime}-{doctor.availability.endTime}</span>
              </div>
            </div>

            {/* Date Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <div className="flex overflow-x-auto pb-2 space-x-2">
                {generateAvailableDates().map((dateObj) => (
                  <button
                    key={dateObj.date}
                    onClick={() => setSelectedDate(dateObj.date)}
                    className={`flex-shrink-0 p-3 rounded-lg focus:outline-none ${
                      selectedDate === dateObj.date
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-center">
                      <p className="text-xs">{dateObj.day}</p>
                      <p className="text-lg font-semibold">{dateObj.dayNum}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slot Selection */}
            {selectedDate && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Time
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.length > 0 ? (
                    availableSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 px-1 rounded text-sm focus:outline-none ${
                          selectedSlot === slot
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {slot}
                      </button>
                    ))
                  ) : (
                    <p className="col-span-3 text-gray-500 text-sm">No available slots for this date</p>
                  )}
                </div>
              </div>
            )}

            {/* Book Button */}
            <button
              onClick={handleBookAppointment}
              disabled={!selectedDate || !selectedSlot}
              className={`w-full py-3 px-4 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                !selectedDate || !selectedSlot
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 