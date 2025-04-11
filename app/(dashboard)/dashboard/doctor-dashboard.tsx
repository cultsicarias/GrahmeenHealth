'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function DoctorDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalPatients: 0,
    pendingTasks: 0,
    predictedDiseases: [],
    expectedVisitTimes: []
  });

  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard/doctor');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Welcome, Dr. {session?.user?.name}</h1>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Today's Appointments</h2>
          <p className="text-3xl font-bold text-primary">{stats.todayAppointments}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Total Patients</h2>
          <p className="text-3xl font-bold text-primary">{stats.totalPatients}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Pending Tasks</h2>
          <p className="text-3xl font-bold text-primary">{stats.pendingTasks}</p>
        </div>
      </div>

      {/* AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">AI-Predicted Diseases</h2>
          <div className="space-y-2">
            {stats.predictedDiseases.length > 0 ? (
              stats.predictedDiseases.map((disease, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span>{disease.name}</span>
                  <span className="text-sm text-gray-500">{disease.confidence}% confidence</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No predictions available</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Expected Visit Times</h2>
          <div className="space-y-2">
            {stats.expectedVisitTimes.length > 0 ? (
              stats.expectedVisitTimes.map((visit, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span>{visit.patientName}</span>
                  <span className="text-sm text-gray-500">{visit.expectedTime}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No expected visits</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/appointments"
            className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <h3 className="font-medium text-blue-800">View Appointments</h3>
            <p className="text-sm text-blue-600">Manage today's schedule</p>
          </Link>
          <Link
            href="/dashboard/patients"
            className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <h3 className="font-medium text-green-800">Patient List</h3>
            <p className="text-sm text-green-600">View all patients</p>
          </Link>
          <Link
            href="/dashboard/adr"
            className="p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <h3 className="font-medium text-red-800">ADR Monitoring</h3>
            <p className="text-sm text-red-600">Check adverse reactions</p>
          </Link>
        </div>
      </div>
    </div>
  );
} 