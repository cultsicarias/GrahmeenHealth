'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface MedicalRecord {
  id: string;
  type: string;
  title: string;
  date: string;
  doctor: string;
  status: string;
  details: string;
}

export default function MedicalRecordsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');

  const medicalRecords: MedicalRecord[] = [
    {
      id: '1',
      type: 'Lab Test',
      title: 'Complete Blood Count (CBC)',
      date: '2025-03-15',
      doctor: 'Dr. Sarah Johnson',
      status: 'Completed',
      details: 'WBC: Normal, RBC: Normal, Platelets: Slightly elevated'
    },
    {
      id: '2',
      type: 'Imaging',
      title: 'Chest X-Ray',
      date: '2025-02-28',
      doctor: 'Dr. Michael Chen',
      status: 'Completed',
      details: 'No abnormalities detected'
    },
    {
      id: '3',
      type: 'Prescription',
      title: 'Hypertension Medication',
      date: '2025-03-01',
      doctor: 'Dr. Sarah Johnson',
      status: 'Active',
      details: 'Amlodipine 5mg daily'
    },
    {
      id: '4',
      type: 'Vaccination',
      title: 'COVID-19 Booster',
      date: '2025-01-15',
      doctor: 'Dr. Robert Wilson',
      status: 'Completed',
      details: 'Moderna Booster Shot'
    },
    {
      id: '5',
      type: 'Surgery',
      title: 'Appendectomy',
      date: '2024-11-20',
      doctor: 'Dr. Emily Martinez',
      status: 'Completed',
      details: 'Laparoscopic appendectomy - successful procedure'
    }
  ];

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session?.user?.role !== 'patient') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  const filteredRecords = activeTab === 'all' 
    ? medicalRecords 
    : medicalRecords.filter(record => record.type.toLowerCase() === activeTab);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Medical Records</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          Download Records
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['all', 'lab test', 'imaging', 'prescription', 'vaccination', 'surgery'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
            >
              {tab === 'all' ? 'All Records' : tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Records List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200">
          {filteredRecords.map((record) => (
            <div key={record.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{record.title}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  record.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {record.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                <div>
                  <p><span className="font-medium text-gray-900">Type:</span> {record.type}</p>
                  <p><span className="font-medium text-gray-900">Date:</span> {record.date}</p>
                </div>
                <div>
                  <p><span className="font-medium text-gray-900">Doctor:</span> {record.doctor}</p>
                  <p><span className="font-medium text-gray-900">Details:</span> {record.details}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}