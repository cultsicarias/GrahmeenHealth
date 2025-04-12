'use client';

import { useState } from 'react';
import { format } from 'date-fns';

interface ConsultationProps {
  appointment: any;
  onClose: () => void;
  onComplete: (report: any) => void;
}

export default function ConsultationPage({ appointment, onClose, onComplete }: ConsultationProps) {
  const [transcription, setTranscription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');

  // Simulate voice transcription
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate incoming transcription
      const transcriptionTimer = setInterval(() => {
        setTranscription(prev => prev + getNextTranscriptionChunk());
      }, 1500);

      // Stop after 10 seconds
      setTimeout(() => {
        clearInterval(transcriptionTimer);
        setIsRecording(false);
        // Auto-generate diagnosis and treatment
        setDiagnosis(generateDiagnosis(appointment.symptoms));
        setTreatment(generateTreatment(appointment.symptoms));
      }, 10000);
    }
  };

  const handleComplete = () => {
    const report = {
      id: Math.random().toString(36).substr(2, 9),
      patientName: appointment.patientName,
      date: format(new Date(), 'yyyy-MM-dd'),
      diagnosis,
      treatment,
      nextVisit: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      status: getDiagnosisSeverity(diagnosis)
    };
    onComplete(report);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Consultation with {appointment.patientName}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {format(new Date(), 'PPp')}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Voice Recording Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Voice Recording</h3>
              <button
                onClick={toggleRecording}
                className={`px-4 py-2 rounded-full flex items-center space-x-2 ${
                  isRecording ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}
              >
                <div className={`h-3 w-3 rounded-full ${isRecording ? 'bg-red-500' : 'bg-blue-500'}`} />
                <span>{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 min-h-[100px] relative">
              {transcription || 'Transcription will appear here...'}
              {isRecording && (
                <div className="absolute bottom-2 right-2 flex items-center space-x-1">
                  <div className="animate-bounce h-2 w-2 bg-red-500 rounded-full" />
                  <div className="animate-bounce h-2 w-2 bg-red-500 rounded-full" style={{ animationDelay: '0.2s' }} />
                  <div className="animate-bounce h-2 w-2 bg-red-500 rounded-full" style={{ animationDelay: '0.4s' }} />
                </div>
              )}
            </div>
          </div>

          {/* Diagnosis and Treatment */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Diagnosis</label>
              <textarea
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Treatment Plan</label>
              <textarea
                value={treatment}
                onChange={(e) => setTreatment(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                rows={3}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleComplete}
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
            >
              Complete & Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions to simulate AI responses
function getNextTranscriptionChunk() {
  const chunks = [
    "Patient reports experiencing symptoms for the past week... ",
    "No previous history of similar conditions... ",
    "Current medications include... ",
    "Physical examination shows... ",
    "Patient describes the pain as... ",
    "Vital signs are within normal range... ",
    "No allergic reactions noted... ",
    "Recommending following treatment plan... "
  ];
  return chunks[Math.floor(Math.random() * chunks.length)];
}

function generateDiagnosis(symptoms: any[]) {
  const diagnoses = {
    'Chest pain': 'Acute costochondritis with possible anxiety component',
    'Fever': 'Viral upper respiratory infection',
    'Cough': 'Acute bronchitis',
    'Back pain': 'Muscular strain with possible nerve impingement',
    'Headache': 'Tension headache with migraine features'
  };
  
  const mainSymptom = symptoms[0]?.name;
  return diagnoses[mainSymptom as keyof typeof diagnoses] || 'Requires further investigation';
}

function generateTreatment(symptoms: any[]) {
  const treatments = {
    'Chest pain': 'NSAIDs for pain relief, anxiety management techniques, follow-up in 1 week',
    'Fever': 'Rest, hydration, antipyretics as needed, monitor temperature',
    'Cough': 'Expectorants, steam inhalation, avoid irritants',
    'Back pain': 'Physical therapy, NSAIDs, posture correction exercises',
    'Headache': 'Stress management, proper sleep hygiene, migraine prophylaxis'
  };
  
  const mainSymptom = symptoms[0]?.name;
  return treatments[mainSymptom as keyof typeof treatments] || 'Symptomatic treatment and observation';
}

function getDiagnosisSeverity(diagnosis: string): 'critical' | 'stable' | 'improving' {
  if (diagnosis.toLowerCase().includes('acute') || diagnosis.toLowerCase().includes('severe')) {
    return 'critical';
  }
  if (diagnosis.toLowerCase().includes('mild') || diagnosis.toLowerCase().includes('improving')) {
    return 'improving';
  }
  return 'stable';
}
