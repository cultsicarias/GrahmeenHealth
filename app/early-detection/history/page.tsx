'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiAlertTriangle, FiClock, FiTrash2 } from 'react-icons/fi';

interface EarlyDetectionHistory {
  id: string;
  symptoms: string[];
  severity: string;
  emergencyRating: number;
  possibleConditions: string[];
  createdAt: string;
}

export default function EarlyDetectionHistoryPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [history, setHistory] = useState<EarlyDetectionHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/early-detection/history');
        if (!response.ok) {
          throw new Error('Failed to fetch history');
        }
        const data = await response.json();
        setHistory(data.data);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchHistory();
    }
  }, [session]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/early-detection/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete record');
      }

      setHistory(history.filter((record) => record.id !== id));
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please sign in to view history
          </h1>
          <button
            onClick={() => router.push('/auth/signin')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Early Detection History
          </h1>
          <button
            onClick={() => router.push('/early-detection')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            New Analysis
          </button>
        </div>

        {history.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <p className="text-gray-500">No early detection records found</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {history.map((record) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white shadow rounded-lg p-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center mb-2">
                      <FiAlertTriangle className="text-red-600 mr-2" />
                      <h2 className="text-lg font-semibold text-gray-900">
                        Emergency Rating: {record.emergencyRating}/10
                      </h2>
                    </div>
                    <div className="flex items-center mb-2">
                      <FiClock className="text-gray-500 mr-2" />
                      <p className="text-gray-500">
                        {new Date(record.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(record.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-4">
                  <h3 className="font-medium text-gray-900 mb-2">Symptoms:</h3>
                  <div className="flex flex-wrap gap-2">
                    {record.symptoms.map((symptom, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Possible Conditions:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {record.possibleConditions.map((condition, index) => (
                      <span
                        key={index}
                        className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm"
                      >
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => router.push(`/early-detection/${record.id}`)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 