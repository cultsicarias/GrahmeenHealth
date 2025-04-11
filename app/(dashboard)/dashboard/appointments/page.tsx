'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AppointmentsPage() {
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Appointments</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
        </div>
        <div className="p-4">
          <p className="text-gray-500">No appointments scheduled yet.</p>
        </div>
      </div>
    </div>
  );
} 