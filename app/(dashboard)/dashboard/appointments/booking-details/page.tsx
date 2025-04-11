'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  availability: {
    days: string[];
    startTime: string;
    endTime: string;
  };
}

export default function BookingDetails() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const doctorData = sessionStorage.getItem('selectedDoctor');
    if (!doctorData) {
      toast.error('Please select a doctor first');
      router.push('/dashboard/appointments/select-doctor');
      return;
    }

    try {
      const parsedDoctor = JSON.parse(doctorData);
      setDoctor(parsedDoctor);
      setLoading(false);
    } catch (error) {
      toast.error('Error loading doctor data');
      router.push('/dashboard/appointments/select-doctor');
    }
  }, [router]);

  const morningSlots = [
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
  ];

  const eveningSlots = [
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
    '5:00 PM',
    '6:00 PM'
  ];

  const generateTimeSlots = (date: string) => {
    if (!doctor) return [];

    const selectedDay = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
    if (!doctor.availability.days.includes(selectedDay)) {
      toast.error(`Doctor is not available on ${selectedDay}s`);
      return [];
    }

    return [...morningSlots, ...eveningSlots];
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    const slots = generateTimeSlots(date);
    setAvailableTimeSlots(slots);
    setSelectedTime('');
  };

  const handleSubmit = async () => {
    if (!doctor?._id || !selectedDate || !selectedTime) {
      toast.error('Please select appointment date and time');
      return;
    }

    setIsSubmitting(true);

    try {
      const symptomsData = JSON.parse(sessionStorage.getItem('appointmentSymptoms') || '{}');
      
      if (!symptomsData.symptoms) {
        toast.error('Please fill in your symptoms first');
        router.push('/dashboard/appointments/symptoms');
        return;
      }

      // Format symptoms data to match schema
      const formattedSymptoms = symptomsData.symptoms.map((symptom: any) => ({
        name: symptom.name,
        severity: symptom.severity || 'moderate',
        duration: symptom.duration || '1-3 days'
      }));

      const response = await fetch('/api/appointments/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          doctorId: doctor._id,
          date: selectedDate,
          time: selectedTime,
          symptoms: formattedSymptoms,
          additionalInfo: symptomsData.additionalInfo || {},
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to book appointment');
      }

      // Show success message
      toast.success('Appointment booked successfully!');
      setShowSuccess(true);

      // Clear session storage
      sessionStorage.removeItem('appointmentSymptoms');
      sessionStorage.removeItem('selectedDoctor');

      // Redirect after a short delay
      setTimeout(() => {
        router.push('/dashboard/appointments');
      }, 2000);

    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to book appointment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 border-2 border-green-100"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-6 text-green-500 bg-green-50 rounded-full flex items-center justify-center"
          >
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-gray-800 mb-3"
          >
            Booking Confirmed!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600"
          >
            Redirecting to your appointments...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Book Appointment</h1>
        {doctor && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="font-medium">Selected Doctor: {doctor.name}</p>
            <p className="text-sm text-gray-600">{doctor.specialization}</p>
          </div>
        )}
      </div>

      <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {selectedDate && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Morning Slots</h3>
                <div className="grid grid-cols-3 gap-3">
                  {morningSlots.map(time => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-4 text-center rounded-lg border-2 transition-all ${
                        selectedTime === time
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'hover:border-blue-500 hover:bg-blue-50'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Evening Slots</h3>
                <div className="grid grid-cols-3 gap-3">
                  {eveningSlots.map(time => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-4 text-center rounded-lg border-2 transition-all ${
                        selectedTime === time
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'hover:border-blue-500 hover:bg-blue-50'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Appointment Summary</h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-600">Doctor:</span> {doctor?.name}</p>
              <p><span className="text-gray-600">Date:</span> {new Date(selectedDate).toLocaleDateString()}</p>
              <p>
                <span className="text-gray-600">Time:</span>{' '}
                {selectedTime}
              </p>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleSubmit}
              disabled={!selectedDate || !selectedTime || isSubmitting}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  <span>Booking...</span>
                </>
              ) : (
                'Confirm Booking'
              )}
            </button>
          </div>
        </div>
    </div>
  );
}
