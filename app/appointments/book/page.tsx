'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { FiChevronLeft, FiCalendar, FiClock, FiUser, FiAlertTriangle, FiMessageCircle, FiCheckCircle } from 'react-icons/fi';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  imageUrl: string;
}

export default function BookAppointmentPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get doctor, date and time from URL if available
  const preselectedDoctorId = searchParams.get('doctorId');
  const preselectedDate = searchParams.get('date');
  const preselectedTime = searchParams.get('time');

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    doctorId: preselectedDoctorId || '',
    date: preselectedDate || '',
    time: preselectedTime || '',
    reason: '',
    symptoms: '',
    severity: 'moderate',
    duration: '',
    previousTreatments: '',
    allergies: '',
    currentMedications: '',
    additionalNotes: ''
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('/api/doctors');
        if (!response.ok) {
          throw new Error('Failed to fetch doctors');
        }
        const data = await response.json();
        setDoctors(data.doctors);
        
        // If doctor ID is preselected, find that doctor
        if (preselectedDoctorId) {
          const doctor = data.doctors.find((doc: Doctor) => doc.id === preselectedDoctorId);
          if (doctor) {
            setSelectedDoctor(doctor);
          }
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setError('Failed to load doctors. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchDoctors();
    } else {
      setIsLoading(false);
    }
  }, [session, preselectedDoctorId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // When doctor changes, update selectedDoctor
    if (name === 'doctorId') {
      const doctor = doctors.find(doctor => doctor.id === value);
      setSelectedDoctor(doctor || null);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.doctorId || !formData.date || !formData.time) {
      toast.error('Please select doctor, date and time');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to book appointment');
      }

      toast.success('Appointment booked successfully!');
      router.push('/appointments');
    } catch (error: any) {
      console.error('Error booking appointment:', error);
      setError(error.message || 'Failed to book appointment');
      toast.error(error.message || 'Failed to book appointment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please sign in to book an appointment
          </h1>
          <Link 
            href="/login" 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link 
          href="/doctors" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <FiChevronLeft className="mr-1" /> Back to Doctors
        </Link>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <h1 className="text-2xl font-bold text-gray-900">
              Book an Appointment
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Fill out the form below to schedule your appointment
            </p>
          </div>
          
          {error && (
            <div className="px-6 py-4 bg-red-50 border-l-4 border-red-500">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiAlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Doctor Selection */}
            <div>
              <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700 mb-1">
                Select Doctor
              </label>
              {preselectedDoctorId && selectedDoctor ? (
                <div className="flex items-center p-4 border border-gray-300 rounded-md bg-gray-50">
                  <img 
                    src={selectedDoctor.imageUrl || '/doctor-placeholder.png'} 
                    alt={selectedDoctor.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{selectedDoctor.name}</p>
                    <p className="text-sm text-gray-500">{selectedDoctor.specialization}</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, doctorId: '' }));
                      setSelectedDoctor(null);
                    }}
                    className="ml-auto text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <select
                  id="doctorId"
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                >
                  <option value="">Select a doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialization}
                    </option>
                  ))}
                </select>
              )}
              
              <div className="mt-2">
                <Link 
                  href="/doctors" 
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  View all doctors and their details
                </Link>
              </div>
            </div>
            
            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Appointment Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                  <FiCalendar className="absolute right-3 top-3 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                  Appointment Time
                </label>
                <div className="relative">
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                  <FiClock className="absolute right-3 top-3 text-gray-400" />
                </div>
              </div>
            </div>
            
            {/* Reason */}
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Visit
              </label>
              <input
                type="text"
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="e.g. Annual checkup, Follow-up, New symptoms"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
            
            {/* Symptoms */}
            <div>
              <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-1">
                Symptoms
              </label>
              <textarea
                id="symptoms"
                name="symptoms"
                rows={3}
                value={formData.symptoms}
                onChange={handleChange}
                placeholder="Describe your symptoms in detail"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            {/* Symptom Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">
                  Symptom Severity
                </label>
                <select
                  id="severity"
                  name="severity"
                  value={formData.severity}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                  Symptom Duration
                </label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g. 2 days, 1 week, 3 months"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            
            {/* Additional Medical Info */}
            <div>
              <label htmlFor="previousTreatments" className="block text-sm font-medium text-gray-700 mb-1">
                Previous Treatments (if any)
              </label>
              <input
                type="text"
                id="previousTreatments"
                name="previousTreatments"
                value={formData.previousTreatments}
                onChange={handleChange}
                placeholder="e.g. Medications, therapies, or procedures"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-1">
                Allergies
              </label>
              <input
                type="text"
                id="allergies"
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                placeholder="e.g. Penicillin, latex, peanuts"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="currentMedications" className="block text-sm font-medium text-gray-700 mb-1">
                Current Medications
              </label>
              <input
                type="text"
                id="currentMedications"
                name="currentMedications"
                value={formData.currentMedications}
                onChange={handleChange}
                placeholder="e.g. Aspirin 81mg daily, Metformin 500mg twice daily"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                id="additionalNotes"
                name="additionalNotes"
                rows={2}
                value={formData.additionalNotes}
                onChange={handleChange}
                placeholder="Any other details you would like the doctor to know"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                  isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Booking...
                  </>
                ) : (
                  <>
                    <FiCheckCircle className="mr-2 h-5 w-5" />
                    Book Appointment
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 