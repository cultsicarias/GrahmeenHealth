'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState<'doctor' | 'patient' | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session?.user?.role) {
      setUserRole(session.user.role as 'doctor' | 'patient');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} userRole={userRole} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header setIsOpen={setIsOpen} />
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4">
          {children}
        </main>
      </div>
    </div>
  );
} 