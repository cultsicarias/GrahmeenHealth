'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface Appointment {
  _id: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  symptoms: Array<{
    name: string;
    severity: string;
    duration: string;
  }>;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export default function AppointmentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const fetchAppointments = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await fetch('/api/appointments');
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch appointments');
      }

      setAppointments(result.data || []);
    } catch (error: any) {
      console.error('Error:', error);
      setError(error.message || 'Failed to load appointments');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchAppointments();
    }
  }, [session]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Appointments</h1>
        <Link
          href="/dashboard/appointments/symptoms"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Book New Appointment
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => {
              setLoading(true);
              fetchAppointments();
            }}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Try again
          </button>
        </div>
      ) : appointments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-white rounded-lg shadow-md"
        >
          <div className="mb-4">
            <Image
              src="/empty-appointments.svg"
              alt="No appointments"
              width={200}
              height={200}
              className="mx-auto"
            />
          </div>
          <h2 className="text-xl font-semibold mb-2">No Appointments Yet</h2>
          <p className="text-gray-600 mb-6">Book your first appointment to get started</p>
          <Link
            href="/dashboard/appointments/symptoms"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold inline-flex items-center"
          >
            Book Now
          </Link>
        </motion.div>
      ) : (
        <div className="grid gap-6">
          {appointments.map((appointment) => (
            <motion.div
              key={appointment._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Dr. {appointment.doctorName}</h3>
                    <p className="text-gray-600">
                      {new Date(appointment.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                      {' at '}
                      {appointment.time}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        appointment.status === 'scheduled'
                          ? 'bg-green-100 text-green-800'
                          : appointment.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Symptoms</h4>
                  <div className="flex flex-wrap gap-2">
                    {appointment.symptoms.map((symptom: { name: string; severity: string }, index: number) => (
                      <div
                        key={index}
                        className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700"
                      >
                        {symptom.name} ({symptom.severity})
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}