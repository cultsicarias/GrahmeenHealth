'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

export default function BookAppointment() {
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [doctors, setDoctors] = useState<any[]>([]);
  
  // Appointment data
  const [appointmentData, setAppointmentData] = useState({
    doctorId: '',
    date: '',
    time: '',
    reason: '',
    symptoms: [{ name: '', severity: 'mild', duration: '' }],
    currentMedications: [{ name: '', dosage: '', frequency: '' }]
  });

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/doctors');
        if (response.ok) {
          const data = await response.json();
          setDoctors(data.doctors);
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setError('Failed to load doctors. Please try again later.');
        toast.error('Failed to load doctors');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Redirect if not patient
  useEffect(() => {
    if (session?.user?.role === 'doctor') {
      router.push('/dashboard/appointments');
    }
  }, [session, router]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAppointmentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle symptom changes
  const handleSymptomChange = (index: number, field: string, value: string) => {
    const updatedSymptoms = [...appointmentData.symptoms];
    updatedSymptoms[index] = { ...updatedSymptoms[index], [field]: value };
    setAppointmentData(prev => ({
      ...prev,
      symptoms: updatedSymptoms
    }));
  };

  // Add new symptom
  const addSymptom = () => {
    setAppointmentData(prev => ({
      ...prev,
      symptoms: [...prev.symptoms, { name: '', severity: 'mild', duration: '' }]
    }));
  };

  // Remove symptom
  const removeSymptom = (index: number) => {
    if (appointmentData.symptoms.length === 1) return;
    const updatedSymptoms = appointmentData.symptoms.filter((_, i) => i !== index);
    setAppointmentData(prev => ({
      ...prev,
      symptoms: updatedSymptoms
    }));
  };

  // Handle medication changes
  const handleMedicationChange = (index: number, field: string, value: string) => {
    const updatedMedications = [...appointmentData.currentMedications];
    updatedMedications[index] = { ...updatedMedications[index], [field]: value };
    setAppointmentData(prev => ({
      ...prev,
      currentMedications: updatedMedications
    }));
  };

  // Add new medication
  const addMedication = () => {
    setAppointmentData(prev => ({
      ...prev,
      currentMedications: [...prev.currentMedications, { name: '', dosage: '', frequency: '' }]
    }));
  };

  // Remove medication
  const removeMedication = (index: number) => {
    if (appointmentData.currentMedications.length === 1) return;
    const updatedMedications = appointmentData.currentMedications.filter((_, i) => i !== index);
    setAppointmentData(prev => ({
      ...prev,
      currentMedications: updatedMedications
    }));
  };

  // Move to next step
  const nextStep = () => {
    if (step === 1) {
      if (!appointmentData.doctorId || !appointmentData.date || !appointmentData.time) {
        setError('Please select a doctor, date, and time');
        return;
      }
    } else if (step === 2) {
      if (!appointmentData.reason) {
        setError('Please provide a reason for your appointment');
        return;
      }

      const validSymptoms = appointmentData.symptoms.every(s => s.name && s.duration);
      if (!validSymptoms) {
        setError('Please provide complete information for all symptoms');
        return;
      }
    }

    setError('');
    setStep(step + 1);
  };

  // Move to previous step
  const prevStep = () => {
    setStep(step - 1);
    setError('');
  };

  // Submit appointment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // Filter out empty medications
      const filteredMedications = appointmentData.currentMedications.filter(
        med => med.name && med.dosage && med.frequency
      );

      const dataToSubmit = {
        ...appointmentData,
        currentMedications: filteredMedications
      };

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSubmit)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to book appointment');
      }

      // Redirect to appointments page with success message
      toast.success('Appointment booked successfully!');
      router.push('/dashboard/appointments');
    } catch (err: any) {
      console.error('Error booking appointment:', err);
      setError(err.message || 'Failed to book appointment');
    } finally {
      setSubmitting(false);
    }
  };

  // Common symptoms list for autocomplete
  const commonSymptoms = [
    'Fever', 'Cough', 'Shortness of breath', 'Fatigue', 'Headache',
    'Sore throat', 'Muscle ache', 'Nausea', 'Vomiting', 'Diarrhea',
    'Chest pain', 'Abdominal pain', 'Back pain', 'Joint pain', 'Dizziness',
    'Skin rash', 'Loss of appetite', 'Swelling', 'Bleeding', 'Weight loss'
  ];

  // Common medications list for autocomplete
  const commonMedications = [
    'Aspirin', 'Ibuprofen', 'Acetaminophen', 'Lisinopril', 'Metformin',
    'Atorvastatin', 'Levothyroxine', 'Amlodipine', 'Metoprolol', 'Omeprazole',
    'Albuterol', 'Gabapentin', 'Losartan', 'Simvastatin', 'Hydrochlorothiazide'
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Book an Appointment</h1>
        <p className="mt-1 text-sm text-gray-500">
          Fill out the form below to schedule your appointment.
        </p>
      </div>

      {/* Progress steps */}
      <div className="mb-8">
        <div className="flex items-center space-x-2">
          <div className={`flex-1 h-2 ${step >= 1 ? 'bg-blue-500' : 'bg-gray-200'} rounded-full`}></div>
          <div className={`flex-1 h-2 ${step >= 2 ? 'bg-blue-500' : 'bg-gray-200'} rounded-full`}></div>
          <div className={`flex-1 h-2 ${step >= 3 ? 'bg-blue-500' : 'bg-gray-200'} rounded-full`}></div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <div>Doctor & Schedule</div>
          <div>Symptoms & Reason</div>
          <div>Review & Submit</div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Step 1: Doctor & Schedule */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900">
                  Select Doctor & Schedule
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Choose a doctor and preferred appointment time.
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <div className="mb-6">
                  <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700">
                    Select Doctor
                  </label>
                  <select
                    id="doctorId"
                    name="doctorId"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={appointmentData.doctorId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a doctor</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialization}
                      </option>
                    ))}
                  </select>
                </div>

                {appointmentData.doctorId && (
                  <div className="mb-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 h-12 w-12">
                        <img
                          className="h-12 w-12 rounded-full"
                          src={doctors.find(d => d.id === appointmentData.doctorId)?.imageUrl || '/avatar-placeholder.png'}
                          alt="Doctor"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {doctors.find(d => d.id === appointmentData.doctorId)?.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {doctors.find(d => d.id === appointmentData.doctorId)?.specialization}
                          {' • '}
                          {doctors.find(d => d.id === appointmentData.doctorId)?.experience} years experience
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {doctors.find(d => d.id === appointmentData.doctorId)?.about}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                      Appointment Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      id="date"
                      min={new Date().toISOString().split('T')[0]}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={appointmentData.date}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                      Preferred Time
                    </label>
                    <input
                      type="time"
                      name="time"
                      id="time"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={appointmentData.time}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Symptoms & Reason */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                Reason for Appointment
              </label>
              <textarea
                id="reason"
                name="reason"
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Please describe why you're seeking this appointment"
                value={appointmentData.reason}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900">Symptoms</h3>
              <p className="text-sm text-gray-500 mb-4">
                Please describe your symptoms. This helps us identify potential issues.
              </p>

              {appointmentData.symptoms.map((symptom, index) => (
                <div key={index} className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-medium text-gray-700">Symptom {index + 1}</h4>
                    {appointmentData.symptoms.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSymptom(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        list={`symptoms-${index}`}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="e.g. Headache, Fever"
                        value={symptom.name}
                        onChange={(e) => handleSymptomChange(index, 'name', e.target.value)}
                        required
                      />
                      <datalist id={`symptoms-${index}`}>
                        {commonSymptoms.map((symptom, i) => (
                          <option key={i} value={symptom} />
                        ))}
                      </datalist>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Severity
                      </label>
                      <select
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        value={symptom.severity}
                        onChange={(e) => handleSymptomChange(index, 'severity', e.target.value)}
                        required
                      >
                        <option value="mild">Mild</option>
                        <option value="moderate">Moderate</option>
                        <option value="severe">Severe</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Duration
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="e.g. 3 days, 2 weeks"
                        value={symptom.duration}
                        onChange={(e) => handleSymptomChange(index, 'duration', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addSymptom}
                className="mt-2 text-sm text-blue-600 hover:text-blue-500"
              >
                + Add Another Symptom
              </button>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900">Current Medications</h3>
              <p className="text-sm text-gray-500 mb-4">
                Please list any medications you're currently taking.
              </p>

              {appointmentData.currentMedications.map((medication, index) => (
                <div key={index} className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-medium text-gray-700">Medication {index + 1}</h4>
                    {appointmentData.currentMedications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMedication(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        list={`medications-${index}`}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="e.g. Aspirin, Lisinopril"
                        value={medication.name}
                        onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                      />
                      <datalist id={`medications-${index}`}>
                        {commonMedications.map((med, i) => (
                          <option key={i} value={med} />
                        ))}
                      </datalist>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Dosage
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="e.g. 100mg, 500mg"
                        value={medication.dosage}
                        onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Frequency
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="e.g. Twice daily, Every 8 hours"
                        value={medication.frequency}
                        onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addMedication}
                className="mt-2 text-sm text-blue-600 hover:text-blue-500"
              >
                + Add Another Medication
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Submit */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Appointment Details
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Please review your appointment details before submitting.
                </p>
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Doctor</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {doctors.find(d => d.id === appointmentData.doctorId)?.name || 'Selected Doctor'}
                      <span className="text-gray-500 ml-2">
                        ({doctors.find(d => d.id === appointmentData.doctorId)?.specialization})
                      </span>
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Date & Time</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {new Date(appointmentData.date).toLocaleDateString()} at {appointmentData.time}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Reason</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {appointmentData.reason}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Symptoms</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <ul className="divide-y divide-gray-200">
                        {appointmentData.symptoms.map((symptom, index) => (
                          <li key={index} className="py-2">
                            <div className="flex justify-between">
                              <div>
                                <span className="font-medium">{symptom.name}</span>
                                <span className="ml-2 text-gray-500">({symptom.severity})</span>
                              </div>
                              <div className="text-gray-500">Duration: {symptom.duration}</div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                  {appointmentData.currentMedications.filter(m => m.name).length > 0 && (
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Current Medications</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <ul className="divide-y divide-gray-200">
                          {appointmentData.currentMedications
                            .filter(m => m.name)
                            .map((medication, index) => (
                              <li key={index} className="py-2">
                                <div className="flex justify-between">
                                  <div className="font-medium">{medication.name}</div>
                                  <div className="text-gray-500">
                                    {medication.dosage}{medication.dosage && medication.frequency ? ', ' : ''}
                                    {medication.frequency}
                                  </div>
                                </div>
                              </li>
                            ))}
                        </ul>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="mt-8 flex justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Previous
            </button>
          ) : (
            <div></div>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Book Appointment'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
} 