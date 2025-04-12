'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

interface Appointment {
  _id: string;
  patientId: string;
  doctorId: string;
  patientName: string;
  date: string;
  time: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  symptoms: Array<{
    name: string;
    severity: string;
    duration: string;
  }>;
}

export default function DoctorAppointments() {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    fetchAppointments();
  }, [session]);

  const fetchAppointments = async () => {
    if (!session?.user?.id) {
      console.log('No session or user ID');
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching appointments for user:', session.user);
      
      const response = await fetch('/api/appointments');
      const result = await response.json();
      
      console.log('API Response:', {
        status: response.status,
        ok: response.ok,
        result
      });

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch appointments');
      }
      
      const appointments = result.data;
      if (!Array.isArray(appointments)) {
        console.error('Invalid appointments data:', result);
        throw new Error('Invalid appointments data received');
      }

      console.log('Setting appointments:', appointments.length);
      setAppointments(appointments);
    } catch (error: any) {
      console.error('Error fetching appointments:', error);
      toast.error(error.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const now = new Date();
  console.log('Current appointments state:', appointments);
  
  const filteredAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date + 'T' + apt.time);
    const isUpcoming = aptDate >= now;
    console.log('Appointment date check:', {
      appointment: apt,
      aptDate,
      now,
      isUpcoming
    });
    return activeTab === 'upcoming' ? isUpcoming : !isUpcoming;
  });
  
  console.log('Filtered appointments:', {
    activeTab,
    total: appointments.length,
    filtered: filteredAppointments.length
  });

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 ${activeTab === 'upcoming'
              ? 'border-blue-600 text-blue-600 bg-blue-50'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Upcoming
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-600">
              {appointments.filter(apt => new Date(apt.date + 'T' + apt.time) >= now).length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 ${activeTab === 'past'
              ? 'border-blue-600 text-blue-600 bg-blue-50'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Past
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
              {appointments.filter(apt => new Date(apt.date + 'T' + apt.time) < now).length}
            </span>
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-sm text-gray-500">Loading appointments...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg
                className="h-full w-full"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No {activeTab} appointments
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {activeTab === 'upcoming' 
                ? 'You have no upcoming appointments scheduled.'
                : 'You have no past appointments to show.'}
            </p>
          </div>
        ) : (
          filteredAppointments.map((appointment) => (
            <div
              key={appointment._id}
              className="p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <span className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-sm">
                          {appointment.patientName.charAt(0)}
                        </span>
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {appointment.patientName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(appointment.date + 'T' + appointment.time), 'PPp')}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(appointment.status)}`}
                  >
                    {appointment.status}
                  </span>
                </div>
              </div>
              {appointment.symptoms && appointment.symptoms.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Symptoms</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {appointment.symptoms.map((symptom, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {symptom.name}
                        {symptom.severity && (
                          <span className="ml-1 text-gray-500">({symptom.severity})</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
