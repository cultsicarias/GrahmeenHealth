'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiAlertTriangle } from 'react-icons/fi';

export default function NewEarlyDetectionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    symptoms: '',
    age: '',
    gender: '',
    medicalHistory: '',
    familyHistory: '',
    lifestyle: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/early-detection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create analysis');
      }

      const data = await response.json();
      router.push(`/early-detection/${data.data.id}`);
    } catch (error) {
      console.error('Error creating analysis:', error);
      setError('Failed to create analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow rounded-lg p-6"
        >
          <div className="flex items-center mb-8">
            <button
              onClick={() => router.push('/early-detection/list')}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <FiArrowLeft className="h-5 w-5 mr-2" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              New Early Detection Analysis
            </h1>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
              <FiAlertTriangle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="symptoms"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Symptoms
              </label>
              <textarea
                id="symptoms"
                name="symptoms"
                rows={4}
                value={formData.symptoms}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="Describe your symptoms in detail..."
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="age"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="0"
                  max="120"
                />
              </div>

              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="medicalHistory"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Medical History
              </label>
              <textarea
                id="medicalHistory"
                name="medicalHistory"
                rows={3}
                value={formData.medicalHistory}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Any relevant medical history..."
              />
            </div>

            <div>
              <label
                htmlFor="familyHistory"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Family History
              </label>
              <textarea
                id="familyHistory"
                name="familyHistory"
                rows={3}
                value={formData.familyHistory}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Any relevant family medical history..."
              />
            </div>

            <div>
              <label
                htmlFor="lifestyle"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Lifestyle
              </label>
              <textarea
                id="lifestyle"
                name="lifestyle"
                rows={3}
                value={formData.lifestyle}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your lifestyle habits..."
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Analyzing...' : 'Start Analysis'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
} 