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
              <div className="relative h-[500px] overflow-hidden">
                {/* Animated background circle - Now only animates on parent hover */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[800px] max-h-[800px]">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full opacity-40 group-hover:animate-rotate"></div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-teal-50 rounded-full opacity-30 group-hover:animate-pulse"></div>
                </div>

                {/* Smart Features Box - Added group class for hover detection */}
                <div className="absolute inset-0 flex items-center justify-center px-4">
                  <div className="group w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-xl">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                      Smart Features
                    </h2>
                    <ul className="space-y-4 overflow-hidden">
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
                          className="flex p-3 rounded-lg transition-all duration-300 hover:bg-blue-50"
                        >
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-400 rounded-full flex items-center justify-center flex-shrink-0 mr-4 shadow-md transition-all duration-300 hover:shadow-lg group-hover:animate-pulse-custom">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-white transition-transform duration-300 hover:scale-110"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d={item.icon}
                              />
                            </svg>
                          </div>
                          <div className="transition-transform duration-300 hover:translate-x-1">
                            <h3 className="font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-300">
                              {item.title}
                            </h3>
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

          {/* Features Section */}
          <section className="py-20 bg-gradient-to-b from-white to-blue-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">How It Works</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">Our platform seamlessly connects patients and doctors with intelligent tools to improve healthcare outcomes.</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
                    title: "For Doctors",
                    desc: "Efficiently manage patient data, receive smart alerts for critical symptoms, and get early warnings for potential adverse drug reactions."
                  },
                  {
                    icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
                    title: "For Patients",
                    desc: "Track your symptoms, medications, and health trends over time. Book appointments and receive reminders for better health management."
                  },
                  {
                    icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
                    title: "Advanced Analytics",
                    desc: "Our system uses intelligent algorithms to analyze symptoms, detect patterns, and provide early warnings for potential health issues."
                  }
                ].map((item, i) => (
                  <div 
                    key={i}
                    className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-400 rounded-2xl flex items-center justify-center mb-6 shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">{item.title}</h3>
                    <p className="text-gray-600">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
              
              {/* New row with early detection, structured data recording, and ADR */}
              <div className="text-center mt-20 mb-16">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Core Services</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">Cutting-edge technology to enhance the quality of healthcare delivery.</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
                    title: "Early Detection",
                    desc: "AI-powered systems to identify potential health issues before they become serious, enabling preventive care and better outcomes."
                  },
                  {
                    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
                    title: "Structured Data Recording",
                    desc: "Comprehensive digital health records that organize medical data systematically, making it easier to track trends and patterns."
                  },
                  {
                    icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
                    title: "ADR Detection",
                    desc: "Advanced algorithms that detect potential Adverse Drug Reactions by analyzing patient data and medication interactions."
                  }
                ].map((item, i) => (
                  <div 
                    key={i}
                    className="bg-gradient-to-br from-blue-50 to-teal-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 border border-blue-100"
                  >
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">{item.title}</h3>
                    <p className="text-gray-700">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent">VaidyaCare</h3>
                <p className="text-gray-400">
                  Smart Care Assistant for healthcare professionals and patients.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li><Link href="/login" className="text-gray-400 hover:text-teal-300 transition">Login</Link></li>
                  <li><Link href="/register" className="text-gray-400 hover:text-teal-300 transition">Sign Up</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Features</h4>
                <ul className="space-y-2">
                  <li><span className="text-gray-400">Smart Alerts</span></li>
                  <li><span className="text-gray-400">Symptom Tracking</span></li>
                  <li><span className="text-gray-400">Medication Management</span></li>
                  <li><span className="text-gray-400">Appointment Booking</span></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Contact</h4>
                <ul className="space-y-2">
                  <li><span className="text-gray-400">Email: support@vaidyacare.com</span></li>
                  <li><span className="text-gray-400">Phone: +91 123-456-7890</span></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; {new Date().getFullYear()} VaidyaCare. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
