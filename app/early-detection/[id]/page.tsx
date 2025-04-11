'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiAlertTriangle, FiClock } from 'react-icons/fi';

interface Analysis {
  id: string;
  symptoms: string;
  severity: string;
  riskLevel: string;
  recommendations: string;
  createdAt: string;
  age: string;
  gender: string;
  medicalHistory: string;
  familyHistory: string;
  lifestyle: string;
}

export default function EarlyDetectionDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await fetch(`/api/early-detection/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch analysis');
        }
        const data = await response.json();
        setAnalysis(data.data);
      } catch (error) {
        console.error('Error fetching analysis:', error);
        setError('Failed to load analysis. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [params.id]);

  const getRiskLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white shadow rounded-lg p-6 max-w-md w-full">
          <div className="flex items-center justify-center mb-4">
            <FiAlertTriangle className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
            {error || 'Analysis not found'}
          </h2>
          <p className="text-gray-600 text-center mb-6">
            {error
              ? 'Please try again later.'
              : 'The analysis you are looking for does not exist.'}
          </p>
          <button
            onClick={() => router.push('/early-detection/list')}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow rounded-lg overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center mb-6">
              <button
                onClick={() => router.push('/early-detection/list')}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <FiArrowLeft className="h-5 w-5 mr-2" />
                Back
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Analysis Details
              </h1>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelColor(
                    analysis.riskLevel
                  )}`}
                >
                  {analysis.riskLevel} Risk
                </span>
                <div className="flex items-center text-gray-500 text-sm">
                  <FiClock className="h-4 w-4 mr-1" />
                  {new Date(analysis.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  Symptoms
                </h2>
                <p className="text-gray-600 whitespace-pre-line">
                  {analysis.symptoms}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-2">
                    Patient Information
                  </h2>
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      <span className="font-medium">Age:</span> {analysis.age}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Gender:</span>{' '}
                      {analysis.gender}
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-2">
                    Severity
                  </h2>
                  <p className="text-gray-600 capitalize">{analysis.severity}</p>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  Medical History
                </h2>
                <p className="text-gray-600 whitespace-pre-line">
                  {analysis.medicalHistory || 'No medical history provided'}
                </p>
              </div>

              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  Family History
                </h2>
                <p className="text-gray-600 whitespace-pre-line">
                  {analysis.familyHistory || 'No family history provided'}
                </p>
              </div>

              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  Lifestyle
                </h2>
                <p className="text-gray-600 whitespace-pre-line">
                  {analysis.lifestyle || 'No lifestyle information provided'}
                </p>
              </div>

              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  Recommendations
                </h2>
                <p className="text-gray-600 whitespace-pre-line">
                  {analysis.recommendations}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 