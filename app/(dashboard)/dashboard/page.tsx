'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import DoctorDashboard from './doctor-dashboard';
import PatientDashboard from './patient-dashboard';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  return session?.user?.role === 'doctor' ? <DoctorDashboard /> : <PatientDashboard />;
} 