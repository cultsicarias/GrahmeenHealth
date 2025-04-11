'use client';

import { useSession } from 'next-auth/react';
import DoctorView from './appointments/doctor-view';

export default function DoctorDashboard() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow mb-6">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome, Dr. {session?.user?.name}</h1>
        </div>
      </div>

      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DoctorView />
        </div>
      </main>
    </div>
  );
}