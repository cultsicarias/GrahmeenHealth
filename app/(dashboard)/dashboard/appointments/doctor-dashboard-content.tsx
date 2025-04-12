'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { getAppointmentPredictions, getImpactColor, getDurationColor } from './appointment-predictions';
import ConsultationPage from './consultation';

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
  additionalInfo?: {
    allergies?: string;
    currentMedications?: string;
    previousTreatments?: string;
    additionalNotes?: string;
  };
}

interface Report {
  id: string;
  patientName: string;
  date: string;
  diagnosis: string;
  treatment: string;
  nextVisit?: string;
  status: 'critical' | 'stable' | 'improving';
}

// Hardcoded appointments for demonstration
const SAMPLE_APPOINTMENTS = [
  {
    _id: '1',
    patientId: 'p1',
    doctorId: 'd1',
    patientName: 'John Doe',
    date: '2025-04-15',
    time: '10:00 AM',
    status: 'scheduled' as const,
    symptoms: [
      { name: 'Chest pain', severity: 'Moderate', duration: '2 days' },
      { name: 'Fever', severity: 'Mild', duration: '1 day' }
    ],
    additionalInfo: {
      allergies: 'Penicillin',
      currentMedications: 'None',
      previousTreatments: 'None',
      additionalNotes: 'First time experiencing these symptoms'
    }
  },
  {
    _id: '2',
    patientId: 'p2',
    doctorId: 'd1',
    patientName: 'Sarah Johnson',
    date: '2025-04-13',
    time: '2:30 PM',
    status: 'scheduled' as const,
    symptoms: [
      { name: 'Headache', severity: 'Mild', duration: '3 days' }
    ],
    additionalInfo: {
      allergies: 'None',
      currentMedications: 'Vitamin D supplements',
      previousTreatments: 'Regular checkups',
      additionalNotes: 'Works long hours at computer'
    }
  },
  {
    _id: '3',
    patientId: 'p3',
    doctorId: 'd1',
    patientName: 'Michael Chen',
    date: '2025-04-11',
    time: '11:00 AM',
    status: 'completed' as const,
    symptoms: [
      { name: 'Back pain', severity: 'Severe', duration: '1 week' },
      { name: 'Headache', severity: 'Moderate', duration: '3 days' }
    ],
    additionalInfo: {
      allergies: 'Dust',
      currentMedications: 'Ibuprofen',
      previousTreatments: 'Physical therapy',
      additionalNotes: 'Recent injury from sports'
    }
  },
  {
    _id: '4',
    patientId: 'p4',
    doctorId: 'd1',
    patientName: 'Emily Wilson',
    date: '2025-04-10',
    time: '3:45 PM',
    status: 'completed' as const,
    symptoms: [
      { name: 'Fever', severity: 'Severe', duration: '4 days' },
      { name: 'Cough', severity: 'Moderate', duration: '1 week' }
    ],
    additionalInfo: {
      allergies: 'None',
      currentMedications: 'Acetaminophen',
      previousTreatments: 'None',
      additionalNotes: 'Recent travel history'
    }
  },
  {
    _id: '5',
    patientId: 'p5',
    doctorId: 'd1',
    patientName: 'David Brown',
    date: '2025-04-09',
    time: '9:15 AM',
    status: 'completed' as const,
    symptoms: [
      { name: 'Chest pain', severity: 'Severe', duration: '1 day' }
    ],
    additionalInfo: {
      allergies: 'Shellfish',
      currentMedications: 'Blood pressure medication',
      previousTreatments: 'Regular cardiac checkups',
      additionalNotes: 'Family history of heart disease'
    }
  },
  {
    _id: '6',
    patientId: 'p6',
    doctorId: 'd1',
    patientName: 'Maria Garcia',
    date: '2025-04-08',
    time: '2:00 PM',
    status: 'completed' as const,
    symptoms: [
      { name: 'Headache', severity: 'Moderate', duration: '5 days' },
      { name: 'Back pain', severity: 'Mild', duration: '2 weeks' }
    ],
    additionalInfo: {
      allergies: 'None',
      currentMedications: 'Migraine medication',
      previousTreatments: 'Physiotherapy',
      additionalNotes: 'Stress-related symptoms'
    }
  },
  {
    _id: '7',
    patientId: 'p7',
    doctorId: 'd1',
    patientName: 'James Wilson',
    date: '2025-04-07',
    time: '4:30 PM',
    status: 'completed' as const,
    symptoms: [
      { name: 'Cough', severity: 'Severe', duration: '2 weeks' },
      { name: 'Fever', severity: 'Moderate', duration: '3 days' }
    ],
    additionalInfo: {
      allergies: 'Pollen',
      currentMedications: 'Antihistamines',
      previousTreatments: 'Bronchitis treatment',
      additionalNotes: 'Recurring respiratory issues'
    }
  }
];

// Hardcoded reports for demonstration
const SAMPLE_REPORTS = [
  {
    id: '1',
    patientName: 'Gaurav Mishra',
    date: '2025-04-12',
    diagnosis: 'Acute Chest Pain',
    treatment: 'Prescribed Nitroglycerin, ECG monitoring',
    nextVisit: '2025-04-19',
    status: 'critical'
  },
  {
    id: '2',
    patientName: 'Avinash Singh',
    date: '2025-04-10',
    diagnosis: 'Seasonal Flu',
    treatment: 'Rest, Paracetamol, Fluids',
    nextVisit: '2025-04-17',
    status: 'improving'
  }
];

// Group reports by date
const groupReportsByDate = (reports: any[]) => {
  return reports.reduce((groups: { [key: string]: any[] }, report) => {
    const date = report.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(report);
    return groups;
  }, {});
};

export default function DoctorDashboardContent() {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'reports'>('upcoming');
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  useEffect(() => {
    fetchAppointments();
  }, [session]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/appointments');
      const result = await response.json();
      
      console.log('Raw API Response:', result);

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch appointments');
      }

      // Merge DB appointments with sample appointments
      const dbAppointments = result.data || [];
      console.log('DB Appointments:', dbAppointments);
      
      // Filter out any sample appointments that have the same date/time as DB appointments
      const filteredSampleAppointments = SAMPLE_APPOINTMENTS.filter(sampleApt => {
        return !dbAppointments.some((dbApt: Appointment) => 
          dbApt.date === sampleApt.date && dbApt.time === sampleApt.time
        );
      });

      const mergedAppointments = [...dbAppointments, ...filteredSampleAppointments];
      console.log('Merged Appointments:', mergedAppointments);
      
      setAppointments(mergedAppointments);
    } catch (error: any) {
      console.error('Error:', error);
      // If there's an error, just use sample appointments
      setAppointments(SAMPLE_APPOINTMENTS);
    } finally {
      setLoading(false);
    }
  };

  const parseAppointmentDate = (dateStr: string, timeStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      const [time, period] = timeStr.split(' ');
      const [hours] = time.split(':');
      let hour = parseInt(hours);
      
      // Convert to 24-hour format
      if (period === 'PM' && hour !== 12) hour += 12;
      if (period === 'AM' && hour === 12) hour = 0;
      
      return new Date(year, month - 1, day, hour);
    } catch (error) {
      console.error('Error parsing date:', { dateStr, timeStr, error });
      return null;
    }
  };

  const formatAppointmentDate = (dateStr: string, timeStr: string) => {
    const date = parseAppointmentDate(dateStr, timeStr);
    if (!date) return 'Invalid date';
    return format(date, 'PPp');
  };

  const now = new Date();
  const filteredAppointments = appointments.filter(apt => {
    const aptDate = parseAppointmentDate(apt.date, apt.time);
    if (!aptDate) return false;
    return activeTab === 'upcoming' ? aptDate >= now : aptDate < now;
  });

  const getStatusColor = (status: string) => {
    if(status === 'treated') {
      return 'text-green-600 bg-green-100';
    }
    const colors = {
      critical: 'bg-red-100 text-red-800',
      stable: 'bg-green-100 text-green-800',
      improving: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 ${activeTab === 'upcoming' ? 'text-blue-600 border-b-2 border-blue-600 -mb-px font-medium' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Upcoming ({appointments.filter(apt => new Date(apt.date) >= new Date()).length})
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 ${activeTab === 'reports' ? 'text-blue-600 border-b-2 border-blue-600 -mb-px font-medium' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Reports ({SAMPLE_REPORTS.length})
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-sm text-gray-500">Loading...</p>
          </div>
        ) : activeTab === 'reports' && SAMPLE_REPORTS.length > 0 ? (
          <div className="space-y-8">
            {Object.entries(groupReportsByDate(SAMPLE_REPORTS)).map(([date, reports]) => (
              <div key={date} className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 sticky top-0 bg-gray-50 p-2 rounded">
                  {format(new Date(date), 'PPPP')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className="bg-white shadow-sm border border-gray-100 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {report.patientName}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {format(new Date(report.date), 'p')}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            report.status === 'critical'
                              ? 'bg-red-100 text-red-800'
                              : report.status === 'stable'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {report.status}
                        </span>
                      </div>

                      <div className="mt-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Diagnosis</h4>
                            <p className="mt-1 text-sm text-gray-600">{report.diagnosis}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Treatment Plan</h4>
                            <p className="mt-1 text-sm text-gray-600">{report.treatment}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Next Visit</h4>
                          <p className="mt-1 text-sm text-gray-600">
                            {format(new Date(report.nextVisit), 'PPp')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Appointments View
          <div className="space-y-4">
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
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
              filteredAppointments.map(appointment => (
                <div
                  key={appointment._id}
                  className="bg-white shadow rounded-lg p-6 hover:bg-gray-50 transition-colors relative"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      {activeTab === 'upcoming' && (
                        <button
                          onClick={() => setSelectedAppointment(appointment)}
                          className="absolute top-4 right-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Start Consultation
                        </button>
                      )}
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-medium text-sm">
                            {appointment.patientName.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {appointment.patientName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {formatAppointmentDate(appointment.date, appointment.time)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                  {appointment.symptoms && appointment.symptoms.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Symptoms
                      </h4>
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
                  {/* AI Predictions */}
                  {appointment.symptoms && appointment.symptoms.length > 0 && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {(() => {
                        const predictions = getAppointmentPredictions(appointment.symptoms);
                        return (
                          <>
                            <div className="rounded-lg p-3 border border-gray-200">
                              <h4 className="text-xs font-medium text-gray-500 uppercase">Predicted Duration</h4>
                              <p className={`mt-1 text-sm font-semibold ${getDurationColor(predictions.duration)}`}>
                                {predictions.duration} minutes
                              </p>
                            </div>
                            <div className="rounded-lg p-3 border border-gray-200">
                              <h4 className="text-xs font-medium text-gray-500 uppercase">Potential Conditions</h4>
                              <p className="mt-1 text-sm font-medium text-gray-900">
                                {predictions.diseases.join(', ')}
                              </p>
                            </div>
                            <div className="rounded-lg p-3 border border-gray-200">
                              <h4 className="text-xs font-medium text-gray-500 uppercase">Impact Factor</h4>
                              <p className={`mt-1 text-sm font-semibold ${getImpactColor(predictions.impact)}`}>
                                {predictions.impact}/10
                              </p>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )}

                  {/* Additional Info */}
                  {appointment.additionalInfo && (
                    <div className="mt-4 space-y-2">
                      {appointment.additionalInfo.allergies && (
                        <div>
                          <h4 className="text-xs font-medium text-gray-500">Allergies</h4>
                          <p className="text-sm text-gray-900">{appointment.additionalInfo.allergies}</p>
                        </div>
                      )}
                      {appointment.additionalInfo.currentMedications && (
                        <div>
                          <h4 className="text-xs font-medium text-gray-500">Current Medications</h4>
                          <p className="text-sm text-gray-900">{appointment.additionalInfo.currentMedications}</p>
                        </div>
                      )}
                      {appointment.additionalInfo.additionalNotes && (
                        <div>
                          <h4 className="text-xs font-medium text-gray-500">Additional Notes</h4>
                          <p className="text-sm text-gray-900">{appointment.additionalInfo.additionalNotes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Consultation Modal */}
      {selectedAppointment && (
        <ConsultationPage
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onComplete={(report) => {
            setSelectedAppointment(null);
            setAppointments(prevAppointments => {
              const updatedAppointments = prevAppointments.map(apt =>
                apt._id === selectedAppointment._id
                  ? { ...apt, status: 'completed' as const }
                  : apt
              );
              return updatedAppointments;
            });
            SAMPLE_REPORTS.unshift(report);
            toast.success('Consultation completed and report generated');
            setActiveTab('reports');
          }}
        />
      )}
    </div>
  );
}
