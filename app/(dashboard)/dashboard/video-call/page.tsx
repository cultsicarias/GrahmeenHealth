'use client';

import { useState } from 'react';
import { FiVideo, FiSearch } from 'react-icons/fi';

// Sample doctor data - replace with your actual data source
const doctors = [
  { id: '1', name: 'Dr. Lavish', specialization: 'General Medicine' },
  { id: '2', name: 'Dr. Johnson', specialization: 'Pediatrician' },
  { id: '3', name: 'Dr. Williams', specialization: 'Dermatologist' },
  { id: '4', name: 'Dr. Brown', specialization: 'Neurologist' },
];

export default function VideoCallPage() {
  const [selectedDoctor, setSelectedDoctor] = useState<typeof doctors[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const meetingUrl = 'https://meet.google.com/pvg-vjmy-rvn  ';

  const filteredDoctors = doctors.filter(doctor => 
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const joinMeeting = () => {
    window.open(meetingUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Search and Select Doctor */}
        {!selectedDoctor ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">Select a Doctor</h2>
            
            {/* Search Bar */}
            <div className="relative mb-6">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search doctors by name or specialization..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Doctor List */}
            <div className="space-y-4">
              {filteredDoctors.map(doctor => (
                <button
                  key={doctor.id}
                  className="w-full p-4 text-left border rounded-lg hover:bg-blue-50 transition-colors"
                  onClick={() => setSelectedDoctor(doctor)}
                >
                  <h3 className="font-semibold">{doctor.name}</h3>
                  <p className="text-gray-600">{doctor.specialization}</p>
                </button>
              ))}
              {filteredDoctors.length === 0 && (
                <p className="text-center text-gray-500">No doctors found</p>
              )}
            </div>
          </div>
        ) : (
          // Video Call Interface
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-semibold mb-2">Video Call with {selectedDoctor.name}</h2>
            <p className="text-gray-600 mb-6">{selectedDoctor.specialization}</p>
            
            <button
              onClick={joinMeeting}
              className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors mx-auto mb-4"
            >
              <FiVideo size={24} />
              <span>Join Google Meet</span>
            </button>
            
            <p className="text-gray-600 mb-4">
              Meeting ID: uzw-vymp-dsf
            </p>
            
            <button
              onClick={() => setSelectedDoctor(null)}
              className="text-blue-600 hover:underline"
            >
              Select Different Doctor
            </button>
          </div>
        )}
      </div>
    </div>
  );
}