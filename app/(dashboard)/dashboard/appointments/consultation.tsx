'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';

interface ConsultationProps {
  appointment: any;
  onClose: () => void;
  onComplete: (report: any) => void;
}

export default function ConsultationPage({ appointment, onClose, onComplete }: ConsultationProps) {
  const { data: session } = useSession();
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

  const [prescribedMedications, setPrescribedMedications] = useState<string[]>([]);
  const [adrWarnings, setAdrWarnings] = useState<{drug: string, warning: string}[]>([]);
  const [isCheckingADR, setIsCheckingADR] = useState(false);
  const [adrChecked, setAdrChecked] = useState(false);
  const [showCompleteAnimation, setShowCompleteAnimation] = useState(false);

  // Simulate ADR check with a mock database
  const checkADR = (medication: string, patientHistory: any) => {
    const mockADRDatabase = {
      'Ibuprofen': {
        interactions: ['Aspirin', 'Blood thinners'],
        conditions: ['Peptic ulcer', 'Kidney disease'],
        allergies: ['NSAIDs']
      },
      'Amoxicillin': {
        interactions: ['Allopurinol'],
        conditions: [],
        allergies: ['Penicillin']
      },
      // Add more medications as needed
    };

    const warnings = [];
    const drug = mockADRDatabase[medication as keyof typeof mockADRDatabase];
    
    if (drug) {
      // Check allergies
      if (appointment.additionalInfo?.allergies) {
        const allergyList = appointment.additionalInfo.allergies.split(',').map((a: string) => a.trim().toLowerCase());
        if (drug.allergies.some((a: string) => allergyList.includes(a.toLowerCase()))) {
          warnings.push(`⚠️ Patient has known allergy to ${medication}`);
        }
      }

      // Check interactions with current medications
      if (appointment.additionalInfo?.currentMedications) {
        const currentMeds = appointment.additionalInfo.currentMedications.split(',').map((m: string) => m.trim());
        const interactions = currentMeds.filter((med: string) => 
          drug.interactions.some((i: string) => med.toLowerCase().includes(i.toLowerCase()))
        );
        if (interactions.length > 0) {
          warnings.push(`⚠️ Potential interaction with current medication: ${interactions.join(', ')}`);
        }
      }
    }

    return warnings;
  };

  const handleAddMedication = (medication: string) => {
    if (medication) {
      setPrescribedMedications(prev => [...prev, medication]);
      setAdrChecked(false); // Reset ADR check when new medication is added
    }
  };

  const handleCheckADR = async () => {
    setIsCheckingADR(true);
    setAdrWarnings([]);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    let hasWarnings = false;
    prescribedMedications.forEach(medication => {
      const warnings = checkADR(medication, appointment.additionalInfo);
      if (warnings.length > 0) {
        hasWarnings = true;
        setAdrWarnings(prev => [...prev, ...warnings.map(warning => ({ drug: medication, warning }))]);
      }
    });

    setIsCheckingADR(false);
    setAdrChecked(true);
  };

  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');

  const handleComplete = async () => {
    setShowCompleteAnimation(true);
    setIsSendingEmail(true);
    setEmailStatus('sending');
    setEmailErrorMessage('');

    try {
      // Format medications for prescription
      const formattedMedications = prescribedMedications.map(med => ({
        name: med,
        dosage: 'As prescribed'
      }));

      // Send prescription email
      const emailResponse = await fetch('/api/send-prescription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientName: appointment.patientName,
          date: format(new Date(), 'yyyy-MM-dd'),
          diagnosis,
          medications: formattedMedications,
          treatment,
          nextVisit: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
          doctorName: session?.user?.name || 'Doctor'
        }),
      });

      const responseData = await emailResponse.json();
      if (!emailResponse.ok) {
        throw new Error(responseData.details || responseData.error || 'Failed to send prescription');
      }

      setEmailStatus('success');
    } catch (error) {
      console.error('Error sending prescription:', error);
      setEmailStatus('error');
      setEmailErrorMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setIsSendingEmail(false);
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    const report = {
      id: Math.random().toString(36).substr(2, 9),
      patientName: appointment.patientName,
      date: format(new Date(), 'yyyy-MM-dd'),
      diagnosis,
      treatment,
      medications: prescribedMedications,
      adrChecks: adrWarnings,
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

          {showCompleteAnimation && (
            <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
              <div className="text-center">
                <div className="mb-4">
                  <svg
                    className="mx-auto h-16 w-16 text-green-500 animate-bounce"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-lg font-medium text-gray-900">Consultation Completed!</p>
                <div className="text-sm text-gray-600 mt-2">
                  {emailStatus === 'sending' && (
                    <div className="flex items-center">
                      <div className="mr-2 animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                      Sending prescription to gauravmishraokok@gmail.com...
                    </div>
                  )}
                  {emailStatus === 'success' && (
                    <div className="flex items-center text-green-600">
                      <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Prescription sent successfully!
                    </div>
                  )}
                  {emailStatus === 'error' && (
                    <div className="flex items-center text-red-600">
                      <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      {emailErrorMessage || 'Failed to send prescription. Please try again.'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Medication Section */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Prescribe Medications</label>
              <div className="mt-2 flex space-x-2">
                <select
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  onChange={(e) => handleAddMedication(e.target.value)}
                  value=""
                >
                  <option value="">Select medication...</option>
                  <option value="Ibuprofen">Ibuprofen</option>
                  <option value="Amoxicillin">Amoxicillin</option>
                  <option value="Paracetamol">Paracetamol</option>
                  {/* Add more medications */}
                </select>
              </div>
            </div>

            {/* Prescribed Medications List */}
            {prescribedMedications.length > 0 && (
              <div className="mt-2">
                <h4 className="text-sm font-medium text-gray-700">Prescribed Medications:</h4>
                <div className="mt-1 flex flex-wrap gap-2">
                  {prescribedMedications.map((med, index) => (
                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {med}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ADR Check Button */}
            {prescribedMedications.length > 0 && (
              <div className="mt-4">
                <button
                  onClick={handleCheckADR}
                  disabled={isCheckingADR}
                  className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isCheckingADR ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {isCheckingADR ? (
                    <>
                      <div className="mr-2 animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Checking ADR...
                    </>
                  ) : (
                    'Check for Adverse Drug Reactions (ADR)'
                  )}
                </button>
              </div>
            )}

            {/* ADR Results */}
            {adrChecked && (
              <div className={`mt-4 p-4 rounded-md ${
                adrWarnings.length > 0 ? 'bg-yellow-50' : 'bg-green-50'
              }`}>
                {adrWarnings.length > 0 ? (
                  <>
                    <h4 className="text-sm font-medium text-yellow-800">⚠️ Potential ADR Warnings Found:</h4>
                    <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
                      {adrWarnings.map((warning, index) => (
                        <li key={index}>{warning.warning}</li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-sm font-medium text-green-800">No ADR warnings found. Safe to proceed.</p>
                  </div>
                )}
              </div>
            )}

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
