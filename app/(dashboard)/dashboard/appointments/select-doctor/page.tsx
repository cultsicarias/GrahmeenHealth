'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  imageUrl: string;
  about: string;
  availability: {
    days: string[];
    startTime: string;
    endTime: string;
  };
}

export default function SelectDoctor() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('/api/doctors?includeHardcoded=true');
        if (!response.ok) {
          throw new Error('Failed to fetch doctors');
        }
        const data = await response.json();
        if (!data.success || !Array.isArray(data.doctors)) {
          throw new Error('Invalid response format');
        }
        setDoctors(data.doctors);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        toast.error('Failed to load doctors');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleContinue = () => {
    if (!selectedDoctorId) {
      toast.error('Please select a doctor');
      return;
    }

    const selectedDoctor = doctors.find(d => d._id === selectedDoctorId);
    if (!selectedDoctor) return;

    // Save selected doctor to session storage
    sessionStorage.setItem('selectedDoctor', JSON.stringify(selectedDoctor));
    
    // Navigate to booking details page
    router.push('/dashboard/appointments/new-booking');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }



  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Select Your Doctor</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <motion.div
            key={doctor._id}
            whileHover={{ scale: 1.02 }}
            className={`p-6 rounded-xl shadow-lg transition-all cursor-pointer ${
              selectedDoctorId === doctor._id ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-white'
            }`}
            onClick={() => setSelectedDoctorId(doctor._id)}
          >
            <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
              <Image
                src={doctor.imageUrl || '/default-doctor.jpg'}
                alt={doctor.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2">{doctor.name}</h3>
              <p className="text-gray-600 mb-2">{doctor.specialization}</p>
              <p className="text-sm text-gray-500 mb-2">{doctor.about}</p>
            </div>

            <p className="text-gray-600">{doctor.experience} years experience</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleContinue}
          disabled={!selectedDoctorId}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg disabled:opacity-50 hover:bg-blue-600 transition-colors"
        >
          Continue to Booking
        </button>
      </div>
    </div>
  );
}
