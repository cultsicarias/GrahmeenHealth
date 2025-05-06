'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const authError = searchParams.get('error');
  const successMessage = searchParams.get('success');
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Set error from URL param
  useEffect(() => {
    if (authError) {
      switch (authError) {
        case 'CredentialsSignin':
          setError('Invalid email or password');
          break;
        default:
          setError('An error occurred during login');
          break;
      }
    }
  }, [authError]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { email, password } = formData;
      
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password
      });
      
      if (result?.error) {
        setError(result.error);
      } else {
        router.push(callbackUrl);
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Background GIF */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 scale-75 origin-center">
          <Image
            src="https://i.pinimg.com/originals/ce/b1/1f/ceb11f58fa11f9b8c151cc3a4ce49b71.gif"
            alt="Medical Technology Background"
            fill
            className="object-cover opacity-50"
            priority
            quality={100}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 to-blue-800/70 backdrop-blur-sm"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md p-8 bg-black/40 backdrop-blur-md rounded-2xl shadow-xl border border-white/10">
        <Link
          href="/"
          className="absolute top-4 left-4 text-cyan-200 hover:text-cyan-100 transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </Link>

        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent mb-2">
            VaidyaCare
          </h1>
          <h2 className="mt-6 text-2xl font-bold text-white">
            Welcome Back!
          </h2>
          <p className="mt-2 text-lg text-cyan-200 font-medium">
            Sign in to access your healthcare dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-2 rounded font-medium">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-base font-medium text-cyan-100">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 bg-black/30 border border-cyan-300/30 rounded-md text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-base font-medium text-cyan-100">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 bg-black/30 border border-cyan-300/30 rounded-md text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-base text-cyan-200 font-medium">
            Don't have an account?{' '}
            <Link href="/register" className="font-semibold text-cyan-300 hover:text-cyan-100 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 