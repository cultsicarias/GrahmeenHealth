'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="relative z-10">
        <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-[#6085FF]/90 shadow-md py-3' : 'bg-[#6085FF]/75 py-6'
        }`}>
          <div className="container mx-auto px-4 flex justify-between items-center backdrop-blur-sm">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-white">
                VaidyaCare
              </span>
            </div>
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link href="/login" className="text-white hover:text-gray-200 transition font-medium">
                    Login
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/register" 
                    className="bg-white text-[#6085FF] px-5 py-2 rounded-full hover:shadow-lg transition transform hover:-translate-y-0.5"
                  >
                    Sign Up
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <main className="pt-24">
          {/* Hero Section */}
          <section className="py-20">
            <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">Smart Care Assistant</span> for Modern Healthcare
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Empowering healthcare with precision and compassion — where technology meets the heart of healing.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/register?role=doctor" 
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg text-center hover:shadow-lg transition transform hover:-translate-y-0.5 flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.5 2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 6a4 4 0 00-8 0v7h8V6zM8 8a1 1 0 100-2 1 1 0 000 2z" />
                    </svg>
                    I am a Doctor
                  </Link>
                  <Link 
                    href="/register?role=patient" 
                    className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-lg text-center hover:shadow-lg transition transform hover:-translate-y-0.5 flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    I am a Patient
                  </Link>
                </div>
              </div>
              <div className="relative h-[500px]">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-blue-100 to-teal-100 rounded-full opacity-40 animate-pulse"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Smart Features</h2>
                    <ul className="space-y-4">
                      {[
                        { 
                          icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", 
                          title: "Intelligent Symptom Analysis", 
                          desc: "AI-powered symptom tracking and analysis" 
                        },
                        { 
                          icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", 
                          title: "Drug Interaction Detection", 
                          desc: "Instant alerts for potential medication conflicts" 
                        },
                        { 
                          icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", 
                          title: "Smart Appointment Booking", 
                          desc: "Priority-based scheduling system" 
                        },
                        { 
                          icon: "M13 10V3L4 14h7v7l9-11h-7z", 
                          title: "Early Warning System", 
                          desc: "Proactive health issue detection" 
                        },
                      ].map((item, i) => (
                        <li 
                          key={i}
                          className="flex p-3 rounded-lg hover:bg-blue-50 transition group"
                        >
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-400 rounded-full flex items-center justify-center flex-shrink-0 mr-4 shadow-md group-hover:shadow-lg transition">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition">{item.title}</h3>
                            <p className="text-sm text-gray-500">{item.desc}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
