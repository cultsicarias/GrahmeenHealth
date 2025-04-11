'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const severityLevels = ['Mild', 'Moderate', 'Severe'];
const durationOptions = ['Less than a day', '1-3 days', '3-7 days', '1-2 weeks', 'More than 2 weeks'];

const commonSymptoms = [
  'Fever', 'Cough', 'Shortness of breath', 'Fatigue', 'Headache',
  'Sore throat', 'Muscle ache', 'Nausea', 'Vomiting', 'Diarrhea',
  'Chest pain', 'Abdominal pain', 'Back pain', 'Joint pain', 'Dizziness',
  'Skin rash', 'Loss of appetite', 'Swelling', 'Bleeding', 'Weight loss'
];

export default function SymptomsAssessment() {
  const router = useRouter();
  const [symptoms, setSymptoms] = useState([{ name: '', severity: 'Mild', duration: '' }]);
  const [additionalInfo, setAdditionalInfo] = useState({
    allergies: '',
    currentMedications: '',
    previousTreatments: '',
    additionalNotes: ''
  });

  const handleSymptomChange = (index: number, field: string, value: string) => {
    const updatedSymptoms = [...symptoms];
    updatedSymptoms[index] = { ...updatedSymptoms[index], [field]: value };
    setSymptoms(updatedSymptoms);
  };

  const addSymptom = () => {
    setSymptoms([...symptoms, { name: '', severity: 'Mild', duration: '' }]);
  };

  const removeSymptom = (index: number) => {
    if (symptoms.length === 1) return;
    setSymptoms(symptoms.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    // Validate symptoms
    if (!symptoms.every(s => s.name && s.severity && s.duration)) {
      toast.error('Please fill in all symptom details');
      return;
    }

    // Store in session storage for next step
    sessionStorage.setItem('appointmentSymptoms', JSON.stringify({
      symptoms,
      additionalInfo
    }));

    // Navigate to doctor selection
    router.push('/dashboard/appointments/select-doctor');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Tell us about your symptoms</h1>
      
      <div className="space-y-6">
        {symptoms.map((symptom, index) => (
          <div key={index} className="p-4 bg-white rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Symptom {index + 1}</h3>
              {symptoms.length > 1 && (
                <button
                  onClick={() => removeSymptom(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Symptom</label>
                <input
                  type="text"
                  list="symptoms"
                  value={symptom.name}
                  onChange={(e) => handleSymptomChange(index, 'name', e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter symptom"
                />
                <datalist id="symptoms">
                  {commonSymptoms.map((s) => (
                    <option key={s} value={s} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Severity</label>
                <select
                  value={symptom.severity}
                  onChange={(e) => handleSymptomChange(index, 'severity', e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  {severityLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Duration</label>
                <select
                  value={symptom.duration}
                  onChange={(e) => handleSymptomChange(index, 'duration', e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select duration</option>
                  {durationOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addSymptom}
          className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
        >
          + Add another symptom
        </button>

        <div className="space-y-4 mt-8">
          <div>
            <label className="block text-sm font-medium mb-1">Any allergies?</label>
            <textarea
              value={additionalInfo.allergies}
              onChange={(e) => setAdditionalInfo({ ...additionalInfo, allergies: e.target.value })}
              className="w-full p-2 border rounded-md"
              rows={2}
              placeholder="List any allergies you have..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Current medications</label>
            <textarea
              value={additionalInfo.currentMedications}
              onChange={(e) => setAdditionalInfo({ ...additionalInfo, currentMedications: e.target.value })}
              className="w-full p-2 border rounded-md"
              rows={2}
              placeholder="List any medications you're currently taking..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Previous treatments</label>
            <textarea
              value={additionalInfo.previousTreatments}
              onChange={(e) => setAdditionalInfo({ ...additionalInfo, previousTreatments: e.target.value })}
              className="w-full p-2 border rounded-md"
              rows={2}
              placeholder="Any previous treatments for these symptoms..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Additional notes</label>
            <textarea
              value={additionalInfo.additionalNotes}
              onChange={(e) => setAdditionalInfo({ ...additionalInfo, additionalNotes: e.target.value })}
              className="w-full p-2 border rounded-md"
              rows={3}
              placeholder="Any other information you'd like to share..."
            />
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
          >
            Next: Select Doctor
          </button>
        </div>
      </div>
    </div>
  );
}
