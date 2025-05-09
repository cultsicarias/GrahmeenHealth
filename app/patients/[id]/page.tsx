'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function PatientDataPage() {
  const params = useParams();
  const [patientData, setPatientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await fetch(`/api/patients/public/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch patient data');
        }
        const data = await response.json();
        setPatientData(data.patient);
      } catch (err) {
        setError('Failed to load patient data');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!patientData) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <p className="text-yellow-700">No patient data found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-teal-400 px-6 py-6">
          <h1 className="text-2xl font-bold text-white">{patientData.name}</h1>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Email:</span> {patientData.email}</p>
                <p><span className="font-medium">Phone:</span> {patientData.phone || 'Not specified'}</p>
                <p><span className="font-medium">Date of Birth:</span> {new Date(patientData.dateOfBirth).toLocaleDateString()}</p>
                <p><span className="font-medium">Gender:</span> {patientData.gender}</p>
                <p><span className="font-medium">Blood Group:</span> {patientData.bloodGroup || 'Not specified'}</p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Health Information</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Height:</span> {patientData.height ? `${patientData.height} cm` : 'Not specified'}</p>
                <p><span className="font-medium">Weight:</span> {patientData.weight ? `${patientData.weight} kg` : 'Not specified'}</p>
              </div>
            </div>
          </div>

          {patientData.medicalConditions && patientData.medicalConditions.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4">Medical Conditions</h2>
              <div className="space-y-2">
                {patientData.medicalConditions.map((condition: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-3 rounded">
                    <p className="font-medium">{condition.name}</p>
                    <p className="text-sm text-gray-600">Severity: {condition.severity}</p>
                    {condition.diagnosedDate && (
                      <p className="text-sm text-gray-600">
                        Diagnosed: {new Date(condition.diagnosedDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {patientData.medications && patientData.medications.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4">Medications</h2>
              <div className="space-y-2">
                {patientData.medications.map((medication: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-3 rounded">
                    <p className="font-medium">{medication.name}</p>
                    <p className="text-sm text-gray-600">Dosage: {medication.dosage}</p>
                    <p className="text-sm text-gray-600">Frequency: {medication.frequency}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {patientData.emergencyContact && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4">Emergency Contact</h2>
              <div className="bg-gray-50 p-3 rounded">
                <p><span className="font-medium">Name:</span> {patientData.emergencyContact.name}</p>
                <p><span className="font-medium">Phone:</span> {patientData.emergencyContact.phone}</p>
                <p><span className="font-medium">Relationship:</span> {patientData.emergencyContact.relationship}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 