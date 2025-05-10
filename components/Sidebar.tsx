'use client';


import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  userRole: 'doctor' | 'patient' | null;
}

export default function Sidebar({ isOpen, setIsOpen, userRole }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const router = useRouter();

  const doctorNavLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: 'grid' },
    { name: 'Appointments', href: '/dashboard/appointments', icon: 'calendar' },
    { name: 'Patients', href: '/dashboard/patients', icon: 'users' },
    { name: 'Profile', href: '/dashboard/profile', icon: 'user' },
  ];

  const patientNavLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: 'grid' },
    { name: 'Appointments', href: '/dashboard/appointments', icon: 'calendar' },
    { name: 'Medical Records', href: '/dashboard/medical-records', icon: 'file-text' },
    { name: 'Video Call', href: '/dashboard/video-call', icon: 'video' },
    { name: 'Medications', href: '/dashboard/medications', icon: 'pill' },
    { name: 'Profile', href: '/dashboard/profile', icon: 'user' },
  ];

  const navLinks = userRole === 'doctor' ? doctorNavLinks : patientNavLinks;

  const handleLogout = async () => {
    try {
      await signOut({ 
        redirect: false,
        callbackUrl: '/'
      });
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect to home page even if there's an error
      router.push('/');
    }
  };

  return (
    <>
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 flex flex-col z-50 max-w-xs w-full bg-white transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:h-screen md:w-64`}
      >
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="flex items-center justify-center h-16 px-4 bg-gradient-to-r from-amber-600 to-orange-600">
            <Link href="/dashboard" className="text-white font-black text-2xl tracking-wider hover:text-yellow-200 transition-colors">
              Grahmeen Health
            </Link>
          </div>

          <nav className="mt-5 flex-1 px-4 space-y-1">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  pathname === item.href
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`mr-3 h-5 w-5 ${
                    pathname === item.href
                      ? 'text-blue-500'
                      : 'text-gray-400 group-hover:text-gray-500'
                  }`} 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  {renderIcon(item.icon)}
                </svg>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* User info and Logout */}
        <div className="flex-shrink-0 flex flex-col border-t border-gray-200 p-4 space-y-4">
          <button
            onClick={handleLogout}
            className="flex items-center px-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-3 h-5 w-5 text-red-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>

          <div className="flex-shrink-0 w-full group block">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                {session?.user?.name?.charAt(0) || 'U'}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {session?.user?.name || 'User'}
                </p>
                <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                  {userRole === 'doctor' ? 'Doctor' : 'Patient'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function renderIcon(icon: string) {
  switch (icon) {
    case 'grid':
      return (
        <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zm0 11h7v7h-7v-7zm-11 0h7v7H3v-7z" />
      );
    case 'calendar':
      return (
        <>
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </>
      );
    case 'users':
      return (
        <>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </>
      );
    case 'user':
      return (
        <>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </>
      );
    case 'file-text':
      return (
        <>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </>
      );
    case 'video':
      return (
        <>
          <path d="M23 7l-7 5 7 5V7z" />
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </>
      );
    case 'pill':
      return (
        <>
          <path d="M10.5 20H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v7.5" />
          <path d="M17 14l-5 5M15 16l-3 3M19 16a3 3 0 1 0 0-6a3 3 0 0 0 0 6z" />
        </>
      );
    default:
      return null;
  }
} 
