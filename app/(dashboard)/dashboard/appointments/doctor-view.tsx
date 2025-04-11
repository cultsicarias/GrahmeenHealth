'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { generateAIInsights } from '@/lib/aiInsights';

interface Symptom {
  name: string;
  severity: string;
  duration: string;
}

interface AIInsights {
  predictedDiseases: Array<{ name: string; probability: number }>;
  possibleADRs: Array<{ drug: string; reaction: string; severity: string }>;
  estimatedConsultationTime: number;
  severityScore: number;
  impactFactors: {
    urgency: number;
    complexity: number;
    chronicityRisk: number;
  };
}

interface Appointment {
  _id: string;
  patientId: string;
  doctorId: string;
  patientName: string;
  date: string;
  time: string;
  symptoms: Symptom[];
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  aiInsights?: AIInsights;
}

interface Stats {
  todayAppointments: number;
  totalPatients: number;
  urgentCases: number;
}

export default function DoctorView() {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState<Stats>({
    todayAppointments: 0,
    totalPatients: 0,
    urgentCases: 0
  });

  const getStatusColor = (status: string) => {
    const colors = {
      'scheduled': 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      console.log('Fetching appointments...');
      console.log('Current user ID:', session?.user?.id);

      const response = await fetch('/api/book-appointment');
      if (!response.ok) throw new Error('Failed to fetch appointments');
      
      const data = await response.json();
      console.log('All appointments:', data.appointments);
      
      // Filter appointments for the current doctor
      const doctorAppointments = data.appointments.filter((apt: Appointment) => {
        console.log('Comparing:', { aptDoctorId: apt.doctorId, sessionUserId: session?.user?.id });
        return apt.doctorId === session?.user?.id;
      });
      
      console.log('Filtered doctor appointments:', doctorAppointments);

      const appointmentsWithInsights = doctorAppointments.map((apt: Appointment) => {
        const insights = generateAIInsights(apt.symptoms);
        console.log('Generated insights for appointment:', { aptId: apt._id, insights });
        return {
          ...apt,
          aiInsights: insights
        };
      });
      
      console.log('Appointments with insights:', appointmentsWithInsights);
      setAppointments(appointmentsWithInsights);

      // Calculate stats
      const today = new Date().toDateString();
      console.log('Today:', today);

      const todayAppts = appointmentsWithInsights.filter((apt: Appointment) => {
        const aptDate = new Date(apt.date).toDateString();
        console.log('Comparing dates:', { aptDate, today });
        return aptDate === today;
      }).length;

      const uniquePatients = new Set(
        appointmentsWithInsights.map((apt: Appointment) => {
          console.log('Patient ID:', apt.patientId);
          return apt.patientId;
        })
      ).size;

      const urgentCases = appointmentsWithInsights.filter((apt: Appointment) => {
        const isUrgent = apt.status === 'scheduled' && 
          apt.symptoms.some((s: { severity: string }) => s.severity === 'severe');
        console.log('Checking urgency:', { aptId: apt._id, isUrgent });
        return isUrgent;
      }).length;

      const newStats = {
        todayAppointments: todayAppts,
        totalPatients: uniquePatients,
        urgentCases
      };
      console.log('Setting stats:', newStats);
      setStats(newStats);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appointmentId: string, newStatus: string) => {
    try {
      console.log('Updating status:', { appointmentId, newStatus });
      const response = await fetch(`/api/appointments/${appointmentId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Status update failed:', errorData);
        throw new Error('Failed to update status');
      }
      
      const updatedData = await response.json();
      console.log('Status updated successfully:', updatedData);
      toast.success('Status updated successfully');
      fetchAppointments();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  useEffect(() => {
    console.log('Session changed:', { userId: session?.user?.id, role: session?.user?.role });
    if (session?.user?.id) {
      fetchAppointments();
    }
  }, [session?.user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  const filteredAppointments = appointments.filter(apt => 
    filter === 'all' ? true : apt.status === filter
  );

  return (
    <div className="p-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-700">Today's Appointments</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.todayAppointments}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-700">Total Patients</h3>
          <p className="text-3xl font-bold text-green-600">{stats.totalPatients}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-700">Urgent Cases</h3>
          <p className="text-3xl font-bold text-red-600">{stats.urgentCases}</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'scheduled', 'in-progress', 'completed', 'cancelled'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg ${
              filter === status 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            } capitalize`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Appointments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No appointments found
            </div>
          ) : (
            filteredAppointments.map(appointment => (
              <motion.div
                key={appointment._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow ${
                  selectedAppointment?._id === appointment._id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedAppointment(appointment)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{appointment.patientName}</h3>
                    <p className="text-gray-600">
                      {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">Symptoms:</span>
                    <span className="font-medium">
                      {appointment.symptoms.map(s => s.name).join(', ')}
                    </span>
                  </div>
                  {appointment.aiInsights && (
                    <>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600">Severity:</span>
                        <span className={`font-semibold ${
                          appointment.aiInsights.severityScore > 7 ? 'text-red-600' :
                          appointment.aiInsights.severityScore > 4 ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {appointment.aiInsights.severityScore}/10
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600">Est. Time:</span>
                        <span className="font-semibold">
                          {appointment.aiInsights.estimatedConsultationTime} min
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Appointment Details */}
        {selectedAppointment && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold">{selectedAppointment.patientName}</h2>
                <p className="text-gray-600">
                  {new Date(selectedAppointment.date).toLocaleDateString()} at {selectedAppointment.time}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {['scheduled', 'in-progress', 'completed', 'cancelled'].map(status => (
                  <button
                    key={status}
                    onClick={() => updateStatus(selectedAppointment._id, status)}
                    className={`px-3 py-1 rounded text-sm ${
                      selectedAppointment.status === status
                        ? getStatusColor(status)
                        : 'bg-gray-100 hover:bg-gray-200'
                    } capitalize`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {/* Symptoms */}
              <div>
                <h3 className="font-semibold mb-2">Symptoms</h3>
                <div className="space-y-2">
                  {selectedAppointment.symptoms.map((symptom, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded">
                      <div className="flex justify-between">
                        <span className="font-medium">{symptom.name}</span>
                        <span className={`px-2 py-0.5 rounded text-sm ${
                          symptom.severity === 'severe' ? 'bg-red-100 text-red-800' :
                          symptom.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {symptom.severity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">Duration: {symptom.duration}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Insights */}
              {selectedAppointment.aiInsights && (
                <div>
                  <h3 className="font-semibold mb-2">AI Insights</h3>
                  <div className="space-y-4">
                    {/* Predicted Diseases */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-1">Predicted Diseases</h4>
                      <div className="space-y-2">
                        {selectedAppointment.aiInsights.predictedDiseases.map((disease, index) => (
                          <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                            <span>{disease.name}</span>
                            <span className="text-sm text-gray-600">
                              {Math.round(disease.probability * 100)}% probability
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Possible ADRs */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-1">Possible ADRs</h4>
                      <div className="space-y-2">
                        {selectedAppointment.aiInsights.possibleADRs.map((adr, index) => (
                          <div key={index} className="bg-gray-50 p-2 rounded">
                            <div className="flex justify-between">
                              <span>{adr.drug}</span>
                              <span className={`px-2 py-0.5 rounded text-sm ${
                                adr.severity === 'high' ? 'bg-red-100 text-red-800' :
                                adr.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {adr.severity}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{adr.reaction}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Impact Factors */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-3 rounded">
                        <h4 className="text-sm font-medium text-gray-600">Urgency</h4>
                        <p className="text-lg font-semibold">
                          {selectedAppointment.aiInsights.impactFactors.urgency}/10
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <h4 className="text-sm font-medium text-gray-600">Complexity</h4>
                        <p className="text-lg font-semibold">
                          {selectedAppointment.aiInsights.impactFactors.complexity}/10
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <h4 className="text-sm font-medium text-gray-600">Chronicity Risk</h4>
                        <p className="text-lg font-semibold">
                          {selectedAppointment.aiInsights.impactFactors.chronicityRisk}/10
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
