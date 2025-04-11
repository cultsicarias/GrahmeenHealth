'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  FiCalendar, FiClock, FiUser, FiPlus, 
  FiInfo, FiAlertCircle, FiCheckCircle, FiXCircle, 
  FiEdit, FiTrash2, FiRefreshCw 
} from 'react-icons/fi';

interface Appointment {
  _id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization?: string;
  doctorImageUrl?: string;
  date: string;
  time: string;
  symptoms: string;
  severity: string;
  reason: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
}

export default function AppointmentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null); // Clear any previous errors
        
        console.log('Fetching appointments...');
        const response = await fetch('/api/appointments');
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Appointments fetch error response:', errorData);
          throw new Error(errorData.error || 'Failed to fetch appointments');
        }
        
        const data = await response.json();
        console.log(`Fetched ${data.appointments?.length || 0} appointments`);
        
        // Add missing doctor details if needed
        if (data.appointments && data.appointments.length > 0) {
          const appointmentsWithDetails = await Promise.all(
            data.appointments.map(appointment => fetchDoctorDetails(appointment))
          );
          setAppointments(appointmentsWithDetails || []);
        } else {
          setAppointments([]);
        }
      } catch (err: any) {
        console.error('Error fetching appointments:', err);
        setError(err.message || 'Error loading appointments');
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchAppointments();
    } else {
      setLoading(false);
    }
  }, [session]);

  const cancelAppointment = async (appointmentId: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }
    
    try {
      console.log(`Cancelling appointment ${appointmentId}...`);
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'cancelled' }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Cancellation error response:', errorData);
        throw new Error(errorData.error || 'Failed to cancel appointment');
      }
      
      // Update the appointments state
      setAppointments(appointments.map(appointment => 
        appointment._id === appointmentId 
          ? { ...appointment, status: 'cancelled' } 
          : appointment
      ));
      
      // Show success message
      alert('Appointment cancelled successfully');
    } catch (err: any) {
      console.error('Error cancelling appointment:', err);
      setError(`Failed to cancel appointment: ${err.message}`);
      alert(`Failed to cancel appointment: ${err.message}`);
    }
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Sort and filter appointments
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingAppointments = sortedAppointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    appointmentDate.setHours(0, 0, 0, 0);
    return appointmentDate >= today && appointment.status !== 'cancelled';
  });

  const pastAppointments = sortedAppointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    appointmentDate.setHours(0, 0, 0, 0);
    return appointmentDate < today || appointment.status === 'cancelled';
  });

  const displayedAppointments = activeTab === 'upcoming' 
    ? upcomingAppointments 
    : pastAppointments;

  // Add a fetch method to properly show doctor information in appointments
  const fetchDoctorDetails = async (appointment) => {
    if (appointment.doctorImageUrl) {
      // Already has doctor info
      return appointment;
    }

    try {
      // Try to get doctor info from API
      console.log(`Fetching details for doctor ${appointment.doctorId}...`);
      const response = await fetch(`/api/doctors?doctorId=${appointment.doctorId}`);
      
      if (!response.ok) {
        console.warn(`Failed to fetch doctor details for ${appointment.doctorId}:`, 
          await response.text());
        return {
          ...appointment,
          doctorImageUrl: '/doctor-placeholder.png'
        };
      }
      
      const data = await response.json();
      
      if (data.success && data.doctors && data.doctors.length > 0) {
        const doctor = data.doctors[0];
        console.log(`Found doctor: ${doctor.name}`);
        
        return {
          ...appointment,
          doctorName: doctor.name || appointment.doctorName,
          doctorSpecialization: doctor.specialization || 'Specialist',
          doctorImageUrl: doctor.imageUrl || '/doctor-placeholder.png',
        };
      }
      
      console.warn(`No doctor found with ID ${appointment.doctorId}`);
      return {
        ...appointment,
        doctorImageUrl: '/doctor-placeholder.png'
      };
    } catch (error) {
      console.error("Error fetching doctor details:", error);
      // Return appointment with default image
      return {
        ...appointment,
        doctorImageUrl: '/doctor-placeholder.png'
      };
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please sign in to view your appointments
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
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Appointments</h1>
            <p className="mt-1 text-sm text-gray-600">
              {displayedAppointments.length} {activeTab === 'upcoming' ? 'upcoming' : 'past'} appointment(s)
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              href="/doctors"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiPlus className="mr-2 h-4 w-4" />
              Book New Appointment
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex -mb-px space-x-8">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'upcoming'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'past'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Past & Cancelled
            </button>
          </nav>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-2 text-sm text-red-700 hover:text-red-600 font-medium flex items-center"
                >
                  <FiRefreshCw className="mr-1 h-4 w-4" /> Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Appointments List */}
        {displayedAppointments.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-10 text-center">
            <FiCalendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab === 'upcoming' 
                ? 'No upcoming appointments' 
                : 'No past appointments'}
            </h3>
            <p className="text-gray-500 mb-6">
              {activeTab === 'upcoming' 
                ? 'Book an appointment with one of our doctors.'
                : 'Your past appointments will appear here.'}
            </p>
            {activeTab === 'upcoming' && (
              <Link
                href="/doctors"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiPlus className="mr-2 h-4 w-4" />
                Book Appointment
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {displayedAppointments.map((appointment) => (
              <div key={appointment._id} className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start mb-4 md:mb-0">
                      <div className="flex-shrink-0 h-12 w-12">
                        <img
                          className="h-12 w-12 rounded-full object-cover"
                          src={appointment.doctorImageUrl || '/doctor-placeholder.png'}
                          alt={appointment.doctorName}
                        />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {appointment.doctorName}
                        </h3>
                        <p className="text-sm text-blue-600 font-medium">
                          {appointment.doctorSpecialization || 'Specialist'}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {appointment.status === 'scheduled' && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <FiCheckCircle className="mr-1 h-3 w-3" /> Scheduled
                        </span>
                      )}
                      {appointment.status === 'completed' && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <FiCheckCircle className="mr-1 h-3 w-3" /> Completed
                        </span>
                      )}
                      {appointment.status === 'cancelled' && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <FiXCircle className="mr-1 h-3 w-3" /> Cancelled
                        </span>
                      )}
                      {appointment.severity === 'severe' && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <FiAlertCircle className="mr-1 h-3 w-3" /> Urgent
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <FiCalendar className="mr-2 h-4 w-4 text-gray-400" />
                        <span>{formatDate(appointment.date)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <FiClock className="mr-2 h-4 w-4 text-gray-400" />
                        <span>{appointment.time}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        <span className="font-medium">Reason:</span> {appointment.reason || 'Medical consultation'}
                      </div>
                      {appointment.symptoms && (
                        <div className="text-sm text-gray-500">
                          <span className="font-medium">Symptoms:</span> {appointment.symptoms}
                        </div>
                      )}
                    </div>
                  </div>

                  {activeTab === 'upcoming' && appointment.status === 'scheduled' && (
                    <div className="mt-5 flex justify-end space-x-3">
                      <button
                        onClick={() => cancelAppointment(appointment._id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent rounded text-xs font-medium text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <FiXCircle className="mr-1 h-3 w-3" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 