'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get role from URL params
  const initialRole = searchParams.get('role') === 'doctor' ? 'doctor' : 'patient';
  
  // Form state
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Basic info (step 1)
  const [basicInfo, setBasicInfo] = useState({
    name: '',
    email: '',
    password: '',
    role: initialRole
  });
  
  // Doctor info (step 2 for doctors)
  const [doctorInfo, setDoctorInfo] = useState({
    specialization: '',
    licenseNumber: '',
    experience: '',
    qualifications: '',
    availability: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      startTime: '09:00',
      endTime: '17:00'
    },
    about: ''
  });
  
  // Patient info (step 2 for patients)
  const [patientInfo, setPatientInfo] = useState({
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    height: '',
    weight: '',
    allergies: [''],
    medicalConditions: [{
      name: '',
      severity: 'mild'
    }],
    medications: [{
      name: '',
      dosage: '',
      frequency: ''
    }],
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  });
  
  // Handle basic info changes
  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBasicInfo(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle doctor info changes
  const handleDoctorInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('availability.')) {
      const field = name.split('.')[1];
      setDoctorInfo(prev => ({
        ...prev,
        availability: {
          ...prev.availability,
          [field]: value
        }
      }));
    } else {
      setDoctorInfo(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Handle day selection
  const handleDaySelection = (day: string) => {
    setDoctorInfo(prev => {
      const days = [...prev.availability.days];
      const index = days.indexOf(day);
      
      if (index === -1) {
        days.push(day);
      } else {
        days.splice(index, 1);
      }
      
      return {
        ...prev,
        availability: {
          ...prev.availability,
          days
        }
      };
    });
  };
  
  // Handle patient info changes
  const handlePatientInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('emergencyContact.')) {
      const field = name.split('.')[1];
      setPatientInfo(prev => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value
        }
      }));
    } else {
      setPatientInfo(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Handle medical condition changes
  const handleConditionChange = (index: number, field: string, value: string) => {
    setPatientInfo(prev => {
      const conditions = [...prev.medicalConditions];
      conditions[index] = { ...conditions[index], [field]: value };
      return { ...prev, medicalConditions: conditions };
    });
  };
  
  // Add new condition
  const addCondition = () => {
    setPatientInfo(prev => ({
      ...prev,
      medicalConditions: [...prev.medicalConditions, { name: '', severity: 'mild' }]
    }));
  };
  
  // Handle medication changes
  const handleMedicationChange = (index: number, field: string, value: string) => {
    setPatientInfo(prev => {
      const medications = [...prev.medications];
      medications[index] = { ...medications[index], [field]: value };
      return { ...prev, medications };
    });
  };
  
  // Add new medication
  const addMedication = () => {
    setPatientInfo(prev => ({
      ...prev,
      medications: [...prev.medications, { name: '', dosage: '', frequency: '' }]
    }));
  };
  
  // Handle allergy changes
  const handleAllergyChange = (index: number, value: string) => {
    setPatientInfo(prev => {
      const allergies = [...prev.allergies];
      allergies[index] = value;
      return { ...prev, allergies };
    });
  };
  
  // Add new allergy
  const addAllergy = () => {
    setPatientInfo(prev => ({
      ...prev,
      allergies: [...prev.allergies, '']
    }));
  };
  
  // Move to next step
  const nextStep = () => {
    if (step === 1) {
      // Validate basic info
      if (!basicInfo.name || !basicInfo.email || !basicInfo.password) {
        setError('Please fill in all required fields');
        return;
      }
      if (!/\S+@\S+\.\S+/.test(basicInfo.email)) {
        setError('Please enter a valid email address');
        return;
      }
      if (basicInfo.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }
      
      setError('');
      setStep(2);
    }
  };
  
  // Move to previous step
  const prevStep = () => {
    setStep(1);
    setError('');
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Validate step 2 data
      if (basicInfo.role === 'doctor' && !doctorInfo.specialization) {
        setError('Please enter your specialization');
        setLoading(false);
        return;
      }
      
      // Combine data based on role
      const userData = {
        ...basicInfo,
        ...(basicInfo.role === 'doctor' ? doctorInfo : patientInfo)
      };
      
      // Submit registration
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Registration failed');
      }
      
      // Redirect to login page
      router.push('/login?success=Registration successful! Please sign in.');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };
  
  // Render based on step
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            {step === 1 ? 'Create Your Account' : 
              basicInfo.role === 'doctor' ? 'Doctor Information' : 'Patient Information'}
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            {step === 1 ? 'Fill in your basic details to get started' : 
              'Please provide additional information to complete your profile'}
          </p>
        </div>
        
        <div className="mb-8">
          <div className="flex justify-center items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <div className={`h-1 w-16 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
          </div>
          <div className="flex justify-center mt-2">
            <span className="text-sm px-4">Basic Info</span>
            <span className="text-sm px-4">
              {basicInfo.role === 'doctor' ? 'Doctor Details' : 'Medical Info'}
            </span>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={step === 2 ? handleSubmit : e => { e.preventDefault(); nextStep(); }}
                className="p-6 sm:p-8">
            {step === 1 ? (
              // Step 1: Basic information
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={basicInfo.name}
                    onChange={handleBasicInfoChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={basicInfo.email}
                    onChange={handleBasicInfoChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={basicInfo.password}
                    onChange={handleBasicInfoChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Password must be at least 6 characters long
                  </p>
                </div>
                
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    I am a
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={basicInfo.role}
                    onChange={handleBasicInfoChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                  </select>
                </div>
              </div>
            ) : basicInfo.role === 'doctor' ? (
              // Step 2: Doctor information
              <div className="space-y-6">
                <div>
                  <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
                    Specialization
                  </label>
                  <input
                    type="text"
                    id="specialization"
                    name="specialization"
                    value={doctorInfo.specialization}
                    onChange={handleDoctorInfoChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">
                    License Number
                  </label>
                  <input
                    type="text"
                    id="licenseNumber"
                    name="licenseNumber"
                    value={doctorInfo.licenseNumber}
                    onChange={handleDoctorInfoChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    id="experience"
                    name="experience"
                    value={doctorInfo.experience}
                    onChange={handleDoctorInfoChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    min="0"
                  />
                </div>
                
                <div>
                  <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700">
                    Qualifications
                  </label>
                  <input
                    type="text"
                    id="qualifications"
                    name="qualifications"
                    value={doctorInfo.qualifications}
                    onChange={handleDoctorInfoChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <span className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </span>
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleDaySelection(day)}
                        className={`py-2 px-2 text-xs sm:text-sm text-center rounded-md ${
                          doctorInfo.availability.days.includes(day)
                            ? 'bg-blue-100 text-blue-800 border border-blue-500'
                            : 'bg-gray-100 text-gray-800 border border-gray-300'
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="availability.startTime" className="block text-sm font-medium text-gray-700">
                        Start Time
                      </label>
                      <input
                        type="time"
                        id="availability.startTime"
                        name="availability.startTime"
                        value={doctorInfo.availability.startTime}
                        onChange={handleDoctorInfoChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="availability.endTime" className="block text-sm font-medium text-gray-700">
                        End Time
                      </label>
                      <input
                        type="time"
                        id="availability.endTime"
                        name="availability.endTime"
                        value={doctorInfo.availability.endTime}
                        onChange={handleDoctorInfoChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                    About
                  </label>
                  <textarea
                    id="about"
                    name="about"
                    value={doctorInfo.about}
                    onChange={handleDoctorInfoChange}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            ) : (
              // Step 2: Patient information
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={patientInfo.dateOfBirth}
                      onChange={handlePatientInfoChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={patientInfo.gender}
                      onChange={handlePatientInfoChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700">
                      Blood Group
                    </label>
                    <select
                      id="bloodGroup"
                      name="bloodGroup"
                      value={patientInfo.bloodGroup}
                      onChange={handlePatientInfoChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">Select</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      id="height"
                      name="height"
                      value={patientInfo.height}
                      onChange={handlePatientInfoChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      id="weight"
                      name="weight"
                      value={patientInfo.weight}
                      onChange={handlePatientInfoChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      min="0"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Allergies
                  </label>
                  {patientInfo.allergies.map((allergy, index) => (
                    <div key={index} className="mb-2 flex">
                      <input
                        type="text"
                        value={allergy}
                        onChange={(e) => handleAllergyChange(index, e.target.value)}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="e.g., Peanuts, Penicillin"
                      />
                      {index === patientInfo.allergies.length - 1 && (
                        <button
                          type="button"
                          onClick={addAllergy}
                          className="ml-2 px-3 py-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                        >
                          +
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medical Conditions
                  </label>
                  {patientInfo.medicalConditions.map((condition, index) => (
                    <div key={index} className="mb-3 grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div className="md:col-span-3">
                        <input
                          type="text"
                          value={condition.name}
                          onChange={(e) => handleConditionChange(index, 'name', e.target.value)}
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="e.g., Diabetes, Hypertension"
                        />
                      </div>
                      <div>
                        <select
                          value={condition.severity}
                          onChange={(e) => handleConditionChange(index, 'severity', e.target.value)}
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          <option value="mild">Mild</option>
                          <option value="moderate">Moderate</option>
                          <option value="severe">Severe</option>
                        </select>
                      </div>
                      {index === patientInfo.medicalConditions.length - 1 && (
                        <div className="md:col-span-4 flex justify-end">
                          <button
                            type="button"
                            onClick={addCondition}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            + Add Another Condition
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Medications
                  </label>
                  {patientInfo.medications.map((medication, index) => (
                    <div key={index} className="mb-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <input
                          type="text"
                          value={medication.name}
                          onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Medication name"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={medication.dosage}
                          onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Dosage (e.g., 10mg)"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={medication.frequency}
                          onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Frequency (e.g., twice a day)"
                        />
                      </div>
                      {index === patientInfo.medications.length - 1 && (
                        <div className="md:col-span-3 flex justify-end">
                          <button
                            type="button"
                            onClick={addMedication}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            + Add Another Medication
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <input
                        type="text"
                        name="emergencyContact.name"
                        value={patientInfo.emergencyContact.name}
                        onChange={handlePatientInfoChange}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Contact name"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="emergencyContact.phone"
                        value={patientInfo.emergencyContact.phone}
                        onChange={handlePatientInfoChange}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Phone number"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="emergencyContact.relationship"
                        value={patientInfo.emergencyContact.relationship}
                        onChange={handlePatientInfoChange}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Relationship"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-8 flex justify-between">
              {step === 2 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back
                </button>
              )}
              <div></div> {/* Spacer for flex justify-between */}
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Processing...' : step === 1 ? 'Next' : 'Register'}
              </button>
            </div>
          </form>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 