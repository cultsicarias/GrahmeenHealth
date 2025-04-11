'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaThermometerHalf, FaHeartbeat, FaBrain, FaLungs, FaStomach, FaHeadSideCough } from 'react-icons/fa';
import { FiAlertTriangle, FiClock, FiList, FiUser } from 'react-icons/fi';

const symptoms = [
  { name: 'Fever', icon: <FaThermometerHalf /> },
  { name: 'Chest Pain', icon: <FaHeartbeat /> },
  { name: 'Headache', icon: <FaBrain /> },
  { name: 'Difficulty Breathing', icon: <FaLungs /> },
  { name: 'Nausea', icon: <FaStomach /> },
  { name: 'Cough', icon: <FaHeadSideCough /> },
  // Add more symptoms as needed
];

const severityLevels = [
  { value: 'mild', label: 'Mild' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'severe', label: 'Severe' },
  { value: 'critical', label: 'Critical' },
];

interface EarlyDetectionForm {
  symptoms: string;
  severity: string;
  age: string;
  gender: string;
  medicalHistory: string;
  familyHistory: string;
  lifestyle: string;
}

export default function EarlyDetectionPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [severity, setSeverity] = useState<string>('mild');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [medicalHistory, setMedicalHistory] = useState<string>('');
  const [familyHistory, setFamilyHistory] = useState<string>('');
  const [lifestyle, setLifestyle] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [formData, setFormData] = useState<EarlyDetectionForm>({
    symptoms: '',
    severity: 'mild',
    age: '',
    gender: '',
    medicalHistory: '',
    familyHistory: '',
    lifestyle: '',
  });

  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/early-detection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze symptoms');
      }

      const data = await response.json();
      toast.success('Early detection analysis completed successfully');
      router.push(`/early-detection/${data.id}`);
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      toast.error('Failed to analyze symptoms. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please sign in to use early detection
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Early Detection Analysis
          </h1>

          {!result ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Symptoms
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {symptoms.map((symptom) => (
                    <motion.button
                      key={symptom.name}
                      type="button"
                      onClick={() => handleSymptomToggle(symptom.name)}
                      className={`flex items-center space-x-2 p-3 rounded-lg border ${
                        selectedSymptoms.includes(symptom.name)
                          ? 'bg-blue-100 border-blue-500'
                          : 'bg-white border-gray-300'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-blue-500">{symptom.icon}</span>
                      <span>{symptom.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Severity Level
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {severityLevels.map((level) => (
                    <motion.button
                      key={level.value}
                      type="button"
                      onClick={() => setSeverity(level.value)}
                      className={`p-3 rounded-lg border ${
                        severity === level.value
                          ? 'bg-blue-100 border-blue-500'
                          : 'bg-white border-gray-300'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {level.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medical History
                </label>
                <textarea
                  value={medicalHistory}
                  onChange={(e) => setMedicalHistory(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  rows={3}
                  placeholder="Any previous medical conditions or treatments"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Family History
                </label>
                <textarea
                  value={familyHistory}
                  onChange={(e) => setFamilyHistory(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  rows={3}
                  placeholder="Any significant medical conditions in your family"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lifestyle
                </label>
                <textarea
                  value={lifestyle}
                  onChange={(e) => setLifestyle(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  rows={3}
                  placeholder="Your daily habits, diet, exercise routine, etc."
                />
              </div>

              <motion.button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
              >
                {isLoading ? 'Analyzing...' : 'Analyze Symptoms'}
              </motion.button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="bg-blue-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Analysis Results
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Emergency Rating
                    </h3>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                          className="bg-blue-600 h-4 rounded-full"
                          style={{ width: `${result.emergencyRating * 10}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {result.emergencyRating}/10
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Possible Conditions
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {result.possibleConditions.map((condition: string) => (
                        <span
                          key={condition}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Estimated Appointment Duration
                    </h3>
                    <p className="text-gray-600">
                      {result.estimatedDuration} minutes
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Recommendations
                    </h3>
                    <ul className="mt-2 space-y-2">
                      {result.recommendations.map((rec: string) => (
                        <li
                          key={rec}
                          className="flex items-start space-x-2 text-gray-600"
                        >
                          <span className="text-blue-500">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <motion.button
                onClick={() => setResult(null)}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start New Analysis
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
} 