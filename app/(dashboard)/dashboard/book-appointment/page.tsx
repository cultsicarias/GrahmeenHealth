'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function BookAppointmentPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    doctorId: '',
    date: '',
    time: '',
    symptoms: '',
    severity: 'mild',
    duration: '',
    previousTreatments: '',
    allergies: '',
    currentMedications: '',
    additionalNotes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Book Appointment</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Doctor Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Select Doctor</label>
            <select
              value={formData.doctorId}
              onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select a doctor</option>
              {/* Add doctor options here */}
            </select>
          </div>

          {/* Date and Time */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Time</label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          {/* Symptoms */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Symptoms</label>
            <textarea
              value={formData.symptoms}
              onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
              className="w-full p-2 border rounded-md"
              rows={3}
              required
            />
          </div>

          {/* Severity */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Severity</label>
            <select
              value={formData.severity}
              onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="mild">Mild</option>
              <option value="moderate">Moderate</option>
              <option value="severe">Severe</option>
            </select>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Duration of Symptoms</label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full p-2 border rounded-md"
              placeholder="e.g., 2 days, 1 week"
              required
            />
          </div>

          {/* Previous Treatments */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Previous Treatments</label>
            <textarea
              value={formData.previousTreatments}
              onChange={(e) => setFormData({ ...formData, previousTreatments: e.target.value })}
              className="w-full p-2 border rounded-md"
              rows={2}
            />
          </div>

          {/* Allergies */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Allergies</label>
            <input
              type="text"
              value={formData.allergies}
              onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Current Medications */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Current Medications</label>
            <input
              type="text"
              value={formData.currentMedications}
              onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
            <textarea
              value={formData.additionalNotes}
              onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
              className="w-full p-2 border rounded-md"
              rows={2}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Book Appointment
          </button>
        </div>
      </form>
    </div>
  );
} 