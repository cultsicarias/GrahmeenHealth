'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfileRouter() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (session?.user?.role === 'doctor') {
      router.push('/dashboard/profile/doctor-profile');
    } else if (session?.user?.role === 'patient') {
      router.push('/dashboard/profile/patient-profile');
    } else {
      // If role is undefined or not recognized
      router.push('/dashboard');
    }
  }, [session, status, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
    </div>
  );
} 