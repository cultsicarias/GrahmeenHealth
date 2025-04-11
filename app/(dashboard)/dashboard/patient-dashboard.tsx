'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function PatientDashboard() {
  const { data: session } = useSession();
  const [nextAppointment, setNextAppointment] = useState(null);
  const [medications, setMedications] = useState([]);

  useEffect(() => {
    // Fetch patient data
    const fetchPatientData = async () => {
      try {
        const [appointmentsRes, medicationsRes] = await Promise.all([
          fetch('/api/appointments/next'),
          fetch('/api/medications')
        ]);

        if (appointmentsRes.ok) {
          const appointmentsData = await appointmentsRes.json();
          setNextAppointment(appointmentsData.nextAppointment);
        }

        if (medicationsRes.ok) {
          const medicationsData = await medicationsRes.json();
          setMedications(medicationsData.medications);
        }
      } catch (error) {
        console.error('Error fetching patient data:', error);
      }
    };

    fetchPatientData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Welcome, {session?.user?.name}</h1>
      
      {/* Next Appointment */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Next Appointment</h2>
        {nextAppointment ? (
          <div className="space-y-2">
            <p className="text-gray-600">
              <span className="font-medium">Date:</span> {new Date(nextAppointment.date).toLocaleDateString()}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Time:</span> {nextAppointment.time}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Doctor:</span> Dr. {nextAppointment.doctorName}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Purpose:</span> {nextAppointment.purpose}
            </p>
          </div>
        ) : (
          <p className="text-gray-500">No upcoming appointments</p>
        )}
      </div>

      {/* Current Medications */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Current Medications</h2>
        {medications.length > 0 ? (
          <div className="space-y-2">
            {medications.map((medication, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{medication.name}</p>
                  <p className="text-sm text-gray-500">{medication.dosage}</p>
                </div>
                <p className="text-sm text-gray-500">{medication.frequency}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No current medications</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/dashboard/book-appointment"
            className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <h3 className="font-medium text-blue-800">Book Appointment</h3>
            <p className="text-sm text-blue-600">Schedule a new appointment</p>
          </Link>
          <Link
            href="/dashboard/medical-records"
            className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <h3 className="font-medium text-green-800">Medical Records</h3>
            <p className="text-sm text-green-600">View and upload records</p>
          </Link>
        </div>
      </div>
    </div>
  );
} 