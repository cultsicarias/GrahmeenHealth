'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  FiUser, FiCalendar, FiActivity, FiAlertCircle, 
  FiThermometer, FiHeart, FiList, FiClock, FiCheckCircle, 
  FiXCircle, FiTrendingUp
} from 'react-icons/fi';

interface MedicalCondition {
  name: string;
  diagnosedDate?: string;
  severity?: 'mild' | 'moderate' | 'severe';
  notes?: string;
}

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  startDate?: string;
  endDate?: string;
}

interface Visit {
  _id: string;
  doctorName: string;
  date: string;
  symptoms: string[];
  diagnosis: string;
  treatment: string;
  followUpDate?: string;
  notes?: string;
  status: 'completed' | 'scheduled' | 'cancelled';
}

interface PatientProfile {
  _id: string;
  userId: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  bloodGroup?: string;
  height?: number;
  weight?: number;
  allergies?: string[];
  medicalConditions?: MedicalCondition[];
  medications?: Medication[];
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  visits?: Visit[];
}

export default function PatientProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Redirect doctors away from this page
    if (status === 'authenticated' && session?.user?.role === 'doctor') {
      router.push('/dashboard');
      return;
    }

    if (status === 'authenticated' && session?.user?.role === 'patient') {
      fetchPatientProfile();
    }
  }, [session, status, router]);

  const fetchPatientProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/patients/profile');
      
      if (!response.ok) {
        throw new Error('Failed to fetch patient profile');
      }
      
      const data = await response.json();
      setPatient(data.patient);
    } catch (err) {
      console.error('Error fetching patient profile:', err);
      setError('Failed to load profile information. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded shadow">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">No profile information found. Please complete your profile.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'mild':
        return 'bg-green-100 text-green-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'severe':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Patient Profile</h1>
      
      <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-teal-400 px-6 py-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="relative mb-4 md:mb-0 md:mr-6">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center text-4xl font-bold text-blue-500 border-4 border-white">
                {session?.user?.name?.charAt(0) || 'P'}
              </div>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-white">{session?.user?.name}</h2>
              <p className="text-blue-100">{formatDate(patient.dateOfBirth)}</p>
              
              <div className="mt-3 flex flex-wrap gap-2 justify-center md:justify-start">
                {patient.gender && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-200 text-blue-800">
                    <FiUser className="mr-1" /> {patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}
                  </span>
                )}
                {patient.bloodGroup && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-200 text-red-800">
                    <FiHeart className="mr-1" /> {patient.bloodGroup}
                  </span>
                )}
                {patient.medicalConditions && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-200 text-purple-800">
                    <FiActivity className="mr-1" /> {patient.medicalConditions.length} Conditions
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            {[
              { id: 'overview', label: 'Overview', icon: <FiUser /> },
              { id: 'visits', label: 'Visit History', icon: <FiCalendar /> },
              { id: 'conditions', label: 'Medical Conditions', icon: <FiActivity /> },
              { id: 'medications', label: 'Medications', icon: <FiList /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FiUser className="mr-2 text-blue-500" /> Personal Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-800">{session?.user?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-800">{session?.user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="font-medium text-gray-800">{formatDate(patient.dateOfBirth)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium text-gray-800">{patient.gender ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1) : 'Not specified'}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FiHeart className="mr-2 text-blue-500" /> Health Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Blood Group</p>
                      <p className="font-medium text-gray-800">{patient.bloodGroup || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Height</p>
                      <p className="font-medium text-gray-800">{patient.height ? `${patient.height} cm` : 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Weight</p>
                      <p className="font-medium text-gray-800">{patient.weight ? `${patient.weight} kg` : 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">BMI</p>
                      <p className="font-medium text-gray-800">
                        {patient.height && patient.weight 
                          ? (patient.weight / Math.pow(patient.height/100, 2)).toFixed(1)
                          : 'Not available'}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Allergies</p>
                    {patient.allergies && patient.allergies.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {patient.allergies.map((allergy, index) => (
                          <span key={index} className="bg-red-50 text-red-700 px-2 py-1 rounded-md text-xs">
                            {allergy}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="font-medium text-gray-800">No known allergies</p>
                    )}
                  </div>
                </div>
              </div>
              
              {patient.emergencyContact && (
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <FiAlertCircle className="mr-2 text-blue-500" /> Emergency Contact
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium text-gray-800">{patient.emergencyContact.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium text-gray-800">{patient.emergencyContact.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Relationship</p>
                        <p className="font-medium text-gray-800">{patient.emergencyContact.relationship}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'visits' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FiCalendar className="mr-2 text-blue-500" /> Visit History
              </h3>
              
              {patient.visits && patient.visits.length > 0 ? (
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Date</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Doctor</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Symptoms</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Diagnosis</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {patient.visits.map((visit, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {formatDate(visit.date)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{visit.doctorName}</td>
                          <td className="px-3 py-4 text-sm text-gray-500">
                            <div className="flex flex-wrap gap-1">
                              {visit.symptoms.map((symptom, idx) => (
                                <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                  {symptom}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500">{visit.diagnosis}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(visit.status)}`}>
                              {visit.status === 'completed' && <FiCheckCircle className="mr-1" />}
                              {visit.status === 'scheduled' && <FiClock className="mr-1" />}
                              {visit.status === 'cancelled' && <FiXCircle className="mr-1" />}
                              {visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-gray-50 p-8 rounded-lg text-center">
                  <FiCalendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No visits yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Your visit history will be displayed here.</p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'conditions' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FiActivity className="mr-2 text-blue-500" /> Medical Conditions
              </h3>
              
              {patient.medicalConditions && patient.medicalConditions.length > 0 ? (
                <div className="grid gap-4">
                  {patient.medicalConditions.map((condition, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                        <h4 className="text-lg font-medium text-gray-900">{condition.name}</h4>
                        {condition.severity && (
                          <span className={`mt-2 md:mt-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(condition.severity)}`}>
                            {condition.severity.charAt(0).toUpperCase() + condition.severity.slice(1)}
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {condition.diagnosedDate && (
                          <div>
                            <p className="text-xs text-gray-500">Diagnosed Date</p>
                            <p className="text-sm text-gray-700">{formatDate(condition.diagnosedDate)}</p>
                          </div>
                        )}
                        
                        {condition.notes && (
                          <div className="md:col-span-2">
                            <p className="text-xs text-gray-500">Notes</p>
                            <p className="text-sm text-gray-700">{condition.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-8 rounded-lg text-center">
                  <FiActivity className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No medical conditions</h3>
                  <p className="mt-1 text-sm text-gray-500">Your medical conditions will be displayed here.</p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'medications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FiList className="mr-2 text-blue-500" /> Medications
              </h3>
              
              {patient.medications && patient.medications.length > 0 ? (
                <div className="grid gap-4">
                  {patient.medications.map((medication, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                      <h4 className="text-lg font-medium text-gray-900 mb-3">{medication.name}</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Dosage</p>
                          <p className="text-sm text-gray-700">{medication.dosage}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Frequency</p>
                          <p className="text-sm text-gray-700">{medication.frequency}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Duration</p>
                          <p className="text-sm text-gray-700">
                            {formatDate(medication.startDate)} 
                            {medication.endDate ? ` to ${formatDate(medication.endDate)}` : ' (ongoing)'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-8 rounded-lg text-center">
                  <FiList className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No medications</h3>
                  <p className="mt-1 text-sm text-gray-500">Your medications will be displayed here.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Health Trends */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <FiTrendingUp className="mr-2 text-blue-500" /> Health Insights
          </h3>
        </div>
        
        <div className="p-6 text-center">
          <div className="bg-gradient-to-b from-blue-50 to-white p-6 rounded-lg shadow-inner">
            <p className="text-gray-600 mb-4">
              Health insights and trends will be available as more data is collected during your medical visits.
            </p>
            <p className="text-sm text-gray-500">
              Stay tuned for personalized health recommendations based on your medical history.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 