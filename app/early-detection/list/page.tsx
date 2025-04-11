'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiAlertTriangle, FiClock, FiPlus } from 'react-icons/fi';

interface Analysis {
  id: string;
  symptoms: string;
  severity: string;
  riskLevel: string;
  createdAt: string;
}

export default function EarlyDetectionListPage() {
  const router = useRouter();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const response = await fetch('/api/early-detection/list');
        if (!response.ok) {
          throw new Error('Failed to fetch analyses');
        }
        const data = await response.json();
        setAnalyses(data.data);
      } catch (error) {
        console.error('Error fetching analyses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyses();
  }, []);

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
          <p className="text-gray-600">Loading analyses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Early Detection Analyses
          </h1>
          <button
            onClick={() => router.push('/early-detection/new')}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="h-5 w-5 mr-2" />
            New Analysis
          </button>
        </div>

        {analyses.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <FiAlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              No analyses found
            </h2>
            <p className="text-gray-600 mb-4">
              Start by creating a new early detection analysis.
            </p>
            <button
              onClick={() => router.push('/early-detection/new')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create New Analysis
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {analyses.map((analysis) => (
              <motion.div
                key={analysis.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white shadow rounded-lg overflow-hidden cursor-pointer"
                onClick={() => router.push(`/early-detection/${analysis.id}`)}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
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
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Symptoms
                  </h3>
                  <p className="text-gray-600 line-clamp-2 mb-4">
                    {analysis.symptoms}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 capitalize">
                      {analysis.severity} severity
                    </span>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 