'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MedicalChatbot from '@/app/components/MedicalChatbot';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Heart, 
  Activity, 
  Thermometer, 
  Droplet, 
  Pill, 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  QrCode,
  Download
} from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Appointment {
  date: string;
  time: string;
  doctorName: string;
  purpose: string;
}

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
}

interface VitalSigns {
  bloodPressure: { systolic: number; diastolic: number };
  heartRate: number;
  oxygenLevel: number;
  temperature: number;
}

interface PatientQRData {
  patientId: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
  }[];
  medicalRecords: {
    date: string;
    diagnosis: string;
    prescription: string;
  }[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export default function PatientDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [vitalSigns, setVitalSigns] = useState<VitalSigns>({
    bloodPressure: { systolic: 120, diastolic: 80 },
    heartRate: 75,
    oxygenLevel: 98,
    temperature: 37.0
  });
  const [bmi, setBmi] = useState({ weight: 70, height: 170, bmi: 24.2 });
  const [showBMICalculator, setShowBMICalculator] = useState(false);
  const [qrData, setQrData] = useState<PatientQRData | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);

  // Sample data for vital signs history
  const vitalSignsHistory = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Heart Rate (bpm)',
        data: [72, 75, 73, 76, 74, 75, 75],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.4,
      },
      {
        label: 'Oxygen Level (%)',
        data: [98, 97, 98, 99, 98, 97, 98],
        borderColor: 'rgb(53, 162, 235)',
        tension: 0.4,
      },
    ],
  };

  useEffect(() => {
    // Fetch patient data
    const fetchPatientData = async () => {
      try {
        const [appointmentsRes, medicationsRes] = await Promise.all([
          fetch('/api/appointments'),
          fetch('/api/medications')
        ]);

        if (appointmentsRes.ok) {
          const appointmentsData = await appointmentsRes.json();
          // Get the next upcoming appointment
          const upcomingAppointments = appointmentsData.data
            .filter((apt: any) => apt.status === 'scheduled')
            .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
          
          setAppointments(upcomingAppointments);
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

  useEffect(() => {
    if (session?.user?.email) {
      // Fetch patient QR data
      const fetchPatientQRData = async () => {
        try {
          const response = await fetch(`/api/patients/${session.user.email}`);
          if (response.ok) {
            const data = await response.json();
            setQrData({
              patientId: data.id,
              name: data.name,
              age: data.age,
              gender: data.gender,
              bloodGroup: data.bloodGroup,
              medications: medications.map(med => ({
                name: med.name,
                dosage: med.dosage,
                frequency: med.frequency
              })),
              medicalRecords: data.medicalRecords || [],
              emergencyContact: data.emergencyContact || {
                name: "Not Set",
                relationship: "Not Set",
                phone: "Not Set"
              }
            });
          }
        } catch (error) {
          console.error('Error fetching patient QR data:', error);
        }
      };

      fetchPatientQRData();
    }
  }, [session?.user?.email, medications]);

  const calculateBMI = (weight: number, height: number) => {
    const heightInMeters = height / 100;
    const bmiValue = weight / (heightInMeters * heightInMeters);
    return bmiValue.toFixed(1);
  };

  const handleBMIChange = (type: 'weight' | 'height', value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const newBMI = {
        ...bmi,
        [type]: numValue,
        bmi: parseFloat(calculateBMI(
          type === 'weight' ? numValue : bmi.weight,
          type === 'height' ? numValue : bmi.height
        ))
      };
      setBmi(newBMI);
    }
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-500' };
    if (bmi < 25) return { category: 'Normal', color: 'text-green-500' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-500' };
    return { category: 'Obese', color: 'text-red-500' };
  };

  const downloadQRCode = () => {
    const canvas = document.getElementById('patient-qr-code') as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = 'patient-medical-info-qr.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-amber-50 via-white to-orange-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Welcome, {session?.user?.name}</h1>
      
      {/* Vital Signs Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Blood Pressure</p>
              <p className="text-lg font-semibold">{vitalSigns.bloodPressure.systolic}/{vitalSigns.bloodPressure.diastolic} mmHg</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Heart Rate</p>
              <p className="text-lg font-semibold">{vitalSigns.heartRate} bpm</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Oxygen Level</p>
              <p className="text-lg font-semibold">{vitalSigns.oxygenLevel}%</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Temperature</p>
              <p className="text-lg font-semibold">{vitalSigns.temperature}°C</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Vital Signs Chart */}
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Vital Signs History</h2>
        <div className="h-64">
          <Line
            data={vitalSignsHistory}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
              },
              scales: {
                y: {
                  beginAtZero: false,
                },
              },
            }}
          />
        </div>
      </div>

      {/* BMI Calculator */}
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">BMI Calculator</h2>
          <button
            onClick={() => setShowBMICalculator(!showBMICalculator)}
            className="text-blue-500 hover:text-blue-600"
          >
            {showBMICalculator ? 'Hide Calculator' : 'Show Calculator'}
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute h-full bg-gradient-to-r from-blue-500 via-green-500 to-red-500"
                style={{ width: `${Math.min(100, (bmi.bmi / 40) * 100)}%` }}
              />
            </div>
            <div className="mt-2 text-center">
              <span className={`text-lg font-semibold ${getBMICategory(bmi.bmi).color}`}>
                BMI: {bmi.bmi} - {getBMICategory(bmi.bmi).category}
              </span>
            </div>
          </div>
        </div>

        {showBMICalculator && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 grid grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
              <input
                type="number"
                value={bmi.weight}
                onChange={(e) => handleBMIChange('weight', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
              <input
                type="number"
                value={bmi.height}
                onChange={(e) => handleBMIChange('height', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Next Appointment */}
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Next Appointment</h2>
        {appointments.length > 0 ? (
          <div className="space-y-2">
            {appointments.map((appointment, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{appointment.purpose}</p>
                  <p className="text-sm text-gray-500">{new Date(appointment.date).toLocaleDateString()} at {appointment.time}</p>
                </div>
                <p className="text-sm text-gray-500">Dr. {appointment.doctorName}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No upcoming appointments</p>
        )}
      </div>

      {/* Current Medications */}
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow mb-6">
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
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow">
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

      {/* Medical Chatbot */}
      <MedicalChatbot />

      {/* Add QR Code Section after the grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-full lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-amber-600" />
            Medical Information QR Code
          </h2>
          <button
            onClick={() => setShowQRModal(true)}
            className="text-sm text-amber-600 hover:text-amber-700 font-medium"
          >
            View Full QR
          </button>
        </div>
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-amber-100">
          {qrData ? (
            <>
              <QRCodeSVG
                value={JSON.stringify(qrData)}
                size={200}
                level="H"
                includeMargin={true}
                className="mb-4"
              />
              <p className="text-sm text-gray-600 text-center mb-4">
                Scan this QR code to access your complete medical information, including medications, medical records, and emergency contacts.
              </p>
              <button
                onClick={downloadQRCode}
                className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download QR Code
              </button>
            </>
          ) : (
            <div className="text-center text-gray-500">
              <QrCode className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>Loading QR code data...</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* QR Code Modal */}
      {showQRModal && qrData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-8 max-w-md w-full mx-4"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Medical Information QR Code</h3>
              <button
                onClick={() => setShowQRModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col items-center">
              <QRCodeSVG
                value={JSON.stringify(qrData)}
                size={300}
                level="H"
                includeMargin={true}
                className="mb-6"
              />
              <div className="w-full space-y-4">
                <div className="p-4 bg-amber-50 rounded-lg">
                  <h4 className="font-medium text-amber-800 mb-2">QR Code Contains:</h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• Patient ID and Basic Information</li>
                    <li>• Current Medications and Dosages</li>
                    <li>• Medical Records and History</li>
                    <li>• Emergency Contact Details</li>
                  </ul>
                </div>
                <button
                  onClick={downloadQRCode}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download QR Code
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
} 