'use client';

import { useSession } from 'next-auth/react';
import DoctorDashboardContent from './appointments/doctor-dashboard-content';

export default function DoctorDashboard() {
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  return (
    <div className="space-y-6 bg-gradient-to-br from-blue-50 via-white to-cyan-50 min-h-screen p-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Doctor Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your appointments and patient records below.
        </p>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm">
        <DoctorDashboardContent />
      </div>
    </div>
  );
}