'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Toaster, toast } from 'react-hot-toast';
import { 
  FiChevronLeft, FiChevronRight, FiCalendar, FiClock, 
  FiAlertTriangle, FiCheckCircle, FiThermometer, FiUser
} from 'react-icons/fi';

// Step types
type BookingStep = 'symptoms' | 'doctor-selection' | 'confirmation';

// Doctor interface
interface Doctor {
  id: string;
  name: string;
  specialization: string;
  imageUrl?: string;
  experience?: number;
  rating?: number;
}

// Symptoms form data interface
interface SymptomFormData {
  symptoms: string;
  severity: 'mild' | 'moderate' | 'severe';
  duration: string;
  previousTreatments: string;
  allergies: string;
  currentMedications: string;
  additionalNotes: string;
}

// Initial symptom form data
const initialSymptomData: SymptomFormData = {
  symptoms: '',
  severity: 'moderate',
  duration: '',
  previousTreatments: '',
  allergies: '',
  currentMedications: '',
  additionalNotes: ''
};

// Mock doctors data (replace with API call)
const mockDoctors: Doctor[] = [
  { 
    id: '1', 
    name: 'Dr. Sarah Johnson', 
    specialization: 'General Physician',
    imageUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80',
    experience: 12,
    rating: 4.8
  },
  { 
    id: '2', 
    name: 'Dr. Michael Patel', 
    specialization: 'Cardiologist',
    imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80',
    experience: 15,
    rating: 4.9
  },
  { 
    id: '3', 
    name: 'Dr. Emily Chen', 
    specialization: 'Pediatrician',
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80',
    experience: 8,
    rating: 4.7
  },
  { 
    id: '4', 
    name: 'Dr. James Wilson', 
    specialization: 'Neurologist',
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80',
    experience: 20,
    rating: 4.9
  }
];

export default function BookAppointmentPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // State management
  const [currentStep, setCurrentStep] = useState<BookingStep>('symptoms');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [error, setError] = useState('');
  const [symptomData, setSymptomData] = useState<SymptomFormData>(initialSymptomData);
  const [appointmentDateTime, setAppointmentDateTime] = useState({
    date: '',
    time: ''
  });
  
  // Handle symptom form change
  const handleSymptomFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSymptomData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle date and time changes
  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAppointmentDateTime(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Select a doctor
  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
  };

  // Go to next step
  const handleNextStep = () => {
    if (currentStep === 'symptoms') {
      // Validate symptoms form
      if (!symptomData.symptoms || !symptomData.severity || !symptomData.duration) {
        toast.error('Please fill in all required fields');
        return;
      }
      
      if (!appointmentDateTime.date || !appointmentDateTime.time) {
        toast.error('Please select appointment date and time');
        return;
      }
      
      setCurrentStep('doctor-selection');
    } else if (currentStep === 'doctor-selection') {
      // Validate doctor selection
      if (!selectedDoctor) {
        toast.error('Please select a doctor');
        return;
      }
      
      // Submit the appointment
      handleSubmitAppointment();
    }
  };

  // Go to previous step
  const handlePrevStep = () => {
    if (currentStep === 'doctor-selection') {
      setCurrentStep('symptoms');
    } else if (currentStep === 'confirmation') {
      setCurrentStep('doctor-selection');
    }
  };

  // Submit appointment
  const handleSubmitAppointment = async () => {
    if (!selectedDoctor || !appointmentDateTime.date || !appointmentDateTime.time) {
      toast.error('Please complete all required information');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      
      const appointmentData = {
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        date: appointmentDateTime.date,
        time: appointmentDateTime.time,
        ...symptomData
      };
      
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Appointment data:', appointmentData);
      
      // Show success 
      setCurrentStep('confirmation');
      
      // Redirect after a delay
      setTimeout(() => {
        router.push('/appointments');
      }, 3000);
      
    } catch (error: any) {
      console.error('Error booking appointment:', error);
      setError(error.message || 'Failed to book appointment');
      toast.error(error.message || 'Failed to book appointment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
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
      <Toaster position="top-center" />
      <div className="max-w-3xl mx-auto">
        <Link 
          href="/appointments" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <FiChevronLeft className="mr-1" /> Back to Appointments
        </Link>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <h1 className="text-2xl font-bold text-gray-900">
              Book an Appointment
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              {currentStep === 'symptoms' && 'Tell us about your symptoms'}
              {currentStep === 'doctor-selection' && 'Choose a healthcare professional'}
              {currentStep === 'confirmation' && 'Appointment confirmed'}
            </p>
          </div>
          
          {/* Progress Steps */}
          {currentStep !== 'confirmation' && (
          <div className="px-6 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className={`h-2 rounded-full ${currentStep === 'symptoms' ? 'bg-blue-500' : 'bg-blue-200'}`}></div>
              </div>
              <div className="mx-2 w-6 h-6 flex items-center justify-center rounded-full border-2 border-blue-500 bg-white text-xs font-medium text-blue-500">
                1
              </div>
              <div className="flex-1">
                <div className={`h-2 rounded-full ${currentStep === 'doctor-selection' ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
              </div>
              <div className={`mx-2 w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium ${
                currentStep === 'doctor-selection' 
                  ? 'border-2 border-blue-500 bg-white text-blue-500' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <div className="flex-1">
                <div className="h-2 rounded-full bg-gray-200"></div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <div className="w-1/3 text-center">Symptoms</div>
              <div className="w-1/3 text-center">Choose Doctor</div>
              <div className="w-1/3 text-center">Confirmation</div>
            </div>
          </div>
          )}
          
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
          
          <div className="p-6">
            {/* Step 1: Symptoms Form */}
            {currentStep === 'symptoms' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">Tell us about your symptoms</h2>
                
                {/* Symptoms description */}
                <div>
                  <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-1">
                    What symptoms are you experiencing? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="symptoms"
                    name="symptoms"
                    rows={3}
                    value={symptomData.symptoms}
                    onChange={handleSymptomFormChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Describe your symptoms in detail"
                    required
                  />
                </div>
                
                {/* Severity */}
                <div>
                  <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">
                    How severe are your symptoms? <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setSymptomData(prev => ({ ...prev, severity: 'mild' }))}
                      className={`flex items-center justify-center py-2 px-3 border rounded-md text-sm font-medium ${
                        symptomData.severity === 'mild'
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <FiThermometer className="mr-2" /> Mild
                    </button>
                    <button
                      type="button"
                      onClick={() => setSymptomData(prev => ({ ...prev, severity: 'moderate' }))}
                      className={`flex items-center justify-center py-2 px-3 border rounded-md text-sm font-medium ${
                        symptomData.severity === 'moderate'
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <FiThermometer className="mr-2" /> Moderate
                    </button>
                    <button
                      type="button"
                      onClick={() => setSymptomData(prev => ({ ...prev, severity: 'severe' }))}
                      className={`flex items-center justify-center py-2 px-3 border rounded-md text-sm font-medium ${
                        symptomData.severity === 'severe'
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <FiThermometer className="mr-2" /> Severe
                    </button>
                  </div>
                </div>
                
                {/* Duration */}
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                    How long have you had these symptoms? <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiClock className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="duration"
                      name="duration"
                      value={symptomData.duration}
                      onChange={handleSymptomFormChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="e.g. 3 days, 2 weeks, 1 month"
                      required
                    />
                  </div>
                </div>
                
                {/* Appointment Date & Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                      Appointment Date <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiCalendar className="text-gray-400" />
                      </div>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={appointmentDateTime.date}
                        onChange={handleDateTimeChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                      Appointment Time <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiClock className="text-gray-400" />
                      </div>
                      <input
                        type="time"
                        id="time"
                        name="time"
                        value={appointmentDateTime.time}
                        onChange={handleDateTimeChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                {/* Previous Treatments */}
                <div>
                  <label htmlFor="previousTreatments" className="block text-sm font-medium text-gray-700 mb-1">
                    Have you tried any treatments already?
                  </label>
                  <textarea
                    id="previousTreatments"
                    name="previousTreatments"
                    rows={2}
                    value={symptomData.previousTreatments}
                    onChange={handleSymptomFormChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="List any medications or treatments you've already tried"
                  />
                </div>
                
                {/* Allergies & Current Medications as row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-1">
                      Do you have any allergies?
                    </label>
                    <input
                      type="text"
                      id="allergies"
                      name="allergies"
                      value={symptomData.allergies}
                      onChange={handleSymptomFormChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="List any known allergies"
                    />
                  </div>
                  <div>
                    <label htmlFor="currentMedications" className="block text-sm font-medium text-gray-700 mb-1">
                      Are you taking any medications?
                    </label>
                    <input
                      type="text"
                      id="currentMedications"
                      name="currentMedications"
                      value={symptomData.currentMedications}
                      onChange={handleSymptomFormChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="List any current medications"
                    />
                  </div>
                </div>
                
                {/* Additional Notes */}
                <div>
                  <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    id="additionalNotes"
                    name="additionalNotes"
                    rows={2}
                    value={symptomData.additionalNotes}
                    onChange={handleSymptomFormChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Any other information you'd like to share"
                  />
                </div>
              </div>
            )}
            
            {/* Step 2: Doctor Selection */}
            {currentStep === 'doctor-selection' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">Choose Your Doctor</h2>
                <p className="text-gray-600">Select a healthcare professional who's right for you</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {doctors.map((doctor) => (
                    <div 
                      key={doctor.id} 
                      className={`border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer ${
                        selectedDoctor?.id === doctor.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
                      }`}
                      onClick={() => handleDoctorSelect(doctor)}
                    >
                      <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                        <img 
                          src={doctor.imageUrl || 'https://source.unsplash.com/random/300x200/?doctor'} 
                          alt={doctor.name}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-900">{doctor.name}</h3>
                          <div className="flex items-center">
                            <span className="text-yellow-500">★</span>
                            <span className="ml-1 text-sm text-gray-700">{doctor.rating?.toFixed(1) || "4.5"}</span>
                          </div>
                        </div>
                        <p className="text-sm text-blue-600 font-medium">{doctor.specialization}</p>
                        <p className="text-sm text-gray-600 mt-2">{doctor.experience || 5} years experience</p>
                        <div className="mt-4 flex justify-between items-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Available
                          </span>
                          {selectedDoctor?.id === doctor.id && (
                            <FiCheckCircle className="text-blue-500 text-xl" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Step 3: Confirmation */}
            {currentStep === 'confirmation' && (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="bg-blue-50 rounded-full p-6 mb-6 shadow-lg">
                  <FiCheckCircle className="text-6xl text-green-500" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                  Appointment Confirmed!
                </h2>
                
                <p className="text-gray-600 text-center mb-8">
                  Your appointment has been successfully booked
                </p>
                
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm w-full max-w-md">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500">Doctor:</span>
                    <span className="font-medium text-gray-900">{selectedDoctor?.name}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500">Date:</span>
                    <span className="font-medium text-gray-900">{new Date(appointmentDateTime.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Time:</span>
                    <span className="font-medium text-gray-900">{appointmentDateTime.time}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 mt-8">
                  Redirecting to your appointments...
                </p>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          {currentStep !== 'confirmation' && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
              {currentStep === 'doctor-selection' ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  <FiChevronLeft className="mr-2" /> Back
                </button>
              ) : (
                <div></div>
              )}
              
              <button
                type="button"
                onClick={handleNextStep}
                disabled={isSubmitting}
                className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                  isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {currentStep === 'doctor-selection' ? 'Booking...' : 'Next...'}
                  </>
                ) : (
                  <>
                    {currentStep === 'symptoms' && (
                      <>Next <FiChevronRight className="ml-2" /></>
                    )}
                    {currentStep === 'doctor-selection' && (
                      <>Book Appointment <FiCheckCircle className="ml-2" /></>
                    )}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 