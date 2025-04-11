'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiUser, FiAward, FiCalendar, FiBookOpen, FiDollarSign, FiGlobe, FiHeart, FiStar, FiEdit, FiSave, FiX } from 'react-icons/fi';

interface Education {
  degree: string;
  institution: string;
  year: number;
}

interface Review {
  patientId: string;
  rating: number;
  comment: string;
  date: string;
}

interface DoctorProfile {
  _id: string;
  userId: string;
  specialization: string;
  experience: number;
  qualifications: string;
  licenseNumber: string;
  availability: {
    days: string[];
    startTime: string;
    endTime: string;
  };
  about: string;
  imageUrl: string;
  rating: number;
  reviews: Review[];
  education: Education[];
  awards: string[];
  languages: string[];
  consultationFee: number;
  isAvailable: boolean;
}

export default function DoctorProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileComplete, setProfileComplete] = useState(true);
  
  // Form state for profile questionnaire
  const [formData, setFormData] = useState({
    specialization: '',
    experience: '',
    qualifications: '',
    licenseNumber: '',
    about: '',
    consultationFee: '',
    languages: '',
    availability: {
      days: [] as string[],
      startTime: '',
      endTime: ''
    },
    education: [{ degree: '', institution: '', year: '' }],
    awards: ['']
  });

  useEffect(() => {
    // Redirect patients away from this page
    if (status === 'authenticated' && session?.user?.role === 'patient') {
      router.push('/dashboard');
      return;
    }

    if (status === 'authenticated' && session?.user?.role === 'doctor') {
      fetchDoctorProfile();
    }
  }, [session, status, router]);

  useEffect(() => {
    if (doctor) {
      // Check if profile is complete
      const incompleteFields = [];
      if (!doctor.specialization) incompleteFields.push('Specialization');
      if (!doctor.about) incompleteFields.push('About Me');
      if (!doctor.consultationFee) incompleteFields.push('Consultation Fee');
      if (!doctor.availability || !doctor.availability.days.length) incompleteFields.push('Availability');
      
      setProfileComplete(incompleteFields.length === 0);
      
      // Set form data
      setFormData({
        specialization: doctor.specialization || '',
        experience: doctor.experience?.toString() || '',
        qualifications: doctor.qualifications || '',
        licenseNumber: doctor.licenseNumber || '',
        about: doctor.about || '',
        consultationFee: doctor.consultationFee?.toString() || '',
        languages: doctor.languages?.join(', ') || '',
        availability: {
          days: doctor.availability?.days || [],
          startTime: doctor.availability?.startTime || '',
          endTime: doctor.availability?.endTime || ''
        },
        education: doctor.education?.length ? 
          doctor.education.map(edu => ({ 
            degree: edu.degree || '', 
            institution: edu.institution || '', 
            year: edu.year?.toString() || '' 
          })) : 
          [{ degree: '', institution: '', year: '' }],
        awards: doctor.awards?.length ? doctor.awards : ['']
      });
    }
  }, [doctor]);

  const fetchDoctorProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/doctors/profile');
      
      if (!response.ok) {
        throw new Error('Failed to fetch doctor profile');
      }
      
      const data = await response.json();
      setDoctor(data.doctor);
    } catch (err) {
      console.error('Error fetching doctor profile:', err);
      setError('Failed to load profile information. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvailabilityChange = (day: string) => {
    setFormData(prev => {
      const days = prev.availability.days.includes(day)
        ? prev.availability.days.filter(d => d !== day)
        : [...prev.availability.days, day];
      
      return {
        ...prev,
        availability: {
          ...prev.availability,
          days
        }
      };
    });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [name]: value
      }
    }));
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const education = [...prev.education];
      education[index] = { ...education[index], [field]: value };
      return { ...prev, education };
    });
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { degree: '', institution: '', year: '' }]
    }));
  };

  const removeEducation = (index: number) => {
    setFormData(prev => {
      const education = [...prev.education];
      education.splice(index, 1);
      return { ...prev, education: education.length ? education : [{ degree: '', institution: '', year: '' }] };
    });
  };

  const handleAwardChange = (index: number, value: string) => {
    setFormData(prev => {
      const awards = [...prev.awards];
      awards[index] = value;
      return { ...prev, awards };
    });
  };

  const addAward = () => {
    setFormData(prev => ({
      ...prev,
      awards: [...prev.awards, '']
    }));
  };

  const removeAward = (index: number) => {
    setFormData(prev => {
      const awards = [...prev.awards];
      awards.splice(index, 1);
      return { ...prev, awards: awards.length ? awards : [''] };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, you would send this data to your API
    console.log("Submitting profile data:", formData);
    
    // Mock successful update
    setIsEditing(false);
    // In a real implementation, you would refetch the profile or update the state
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded shadow">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">No profile information found. Please complete your profile.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Doctor Profile</h1>
          <button 
            onClick={() => setIsEditing(false)} 
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <FiX className="mr-2" /> Cancel
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Professional Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialization *</label>
                <input 
                  type="text" 
                  name="specialization" 
                  value={formData.specialization} 
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience *</label>
                <input 
                  type="number" 
                  name="experience" 
                  value={formData.experience} 
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications</label>
                <input 
                  type="text" 
                  name="qualifications" 
                  value={formData.qualifications} 
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., MBBS, MD, MS, DNB"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">License Number *</label>
                <input 
                  type="text" 
                  name="licenseNumber" 
                  value={formData.licenseNumber} 
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">About Me *</label>
                <textarea 
                  name="about" 
                  value={formData.about} 
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="Describe your medical practice, approach, and expertise..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee (₹) *</label>
                <input 
                  type="number" 
                  name="consultationFee" 
                  value={formData.consultationFee} 
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="0"
                  step="100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Languages Spoken</label>
                <input 
                  type="text" 
                  name="languages" 
                  value={formData.languages} 
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., English, Hindi, Tamil (comma separated)"
                />
              </div>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mt-8">Availability</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Days *</label>
                <div className="flex flex-wrap gap-3">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleAvailabilityChange(day)}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        formData.availability.days.includes(day) 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
                  <input 
                    type="time" 
                    name="startTime" 
                    value={formData.availability.startTime} 
                    onChange={handleTimeChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
                  <input 
                    type="time" 
                    name="endTime" 
                    value={formData.availability.endTime} 
                    onChange={handleTimeChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mt-8">Education</h2>
            
            <div className="space-y-4">
              {formData.education.map((edu, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-md bg-gray-50 relative">
                  {formData.education.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEducation(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      aria-label="Remove education"
                    >
                      <FiX size={20} />
                    </button>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                      <input 
                        type="text" 
                        value={edu.degree} 
                        onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., MBBS, MD, MS"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                      <input 
                        type="text" 
                        value={edu.institution} 
                        onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., AIIMS, CMC Vellore"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                      <input 
                        type="number" 
                        value={edu.year} 
                        onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 2010"
                        min="1950"
                        max={new Date().getFullYear()}
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addEducation}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                + Add Education
              </button>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mt-8">Awards & Recognitions</h2>
            
            <div className="space-y-4">
              {formData.awards.map((award, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={award}
                    onChange={(e) => handleAwardChange(index, e.target.value)}
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Best Doctor Award 2022"
                  />
                  {formData.awards.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAward(index)}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Remove award"
                    >
                      <FiX size={20} />
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={addAward}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                + Add Award
              </button>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiSave className="mr-2" /> Save Profile
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Doctor Profile</h1>
        <button 
          onClick={() => setIsEditing(true)} 
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <FiEdit className="mr-2" /> Edit Profile
        </button>
      </div>
      
      {!profileComplete && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded shadow mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Your profile is incomplete. Please click "Edit Profile" to provide the missing information.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-teal-400 px-6 py-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="relative w-32 h-32 md:w-40 md:h-40 mb-4 md:mb-0 md:mr-6">
              {doctor.imageUrl ? (
                <Image
                  src={doctor.imageUrl}
                  alt={session?.user?.name || 'Doctor'}
                  className="rounded-full border-4 border-white shadow-lg object-cover"
                  width={160}
                  height={160}
                />
              ) : (
                <div className="w-full h-full rounded-full border-4 border-white bg-blue-100 flex items-center justify-center text-6xl text-blue-500 font-bold">
                  {session?.user?.name?.charAt(0) || 'D'}
                </div>
              )}
              {doctor.isAvailable && (
                <div className="absolute bottom-2 right-2 bg-green-500 h-5 w-5 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-white">{session?.user?.name}</h2>
              <p className="text-blue-100">{doctor.specialization}</p>
              
              <div className="mt-3 flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-200 text-blue-800">
                  <FiAward className="mr-1" /> {doctor.experience} Years Exp.
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-200 text-teal-800">
                  <FiStar className="mr-1" /> {doctor.rating.toFixed(1)} Rating
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-200 text-purple-800">
                  <FiUser className="mr-1" /> {doctor.reviews?.length || 0} Reviews
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <FiUser className="mr-2 text-blue-500" /> About Me
                </h3>
                <p className="text-gray-600">{doctor.about || 'No information provided.'}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <FiBookOpen className="mr-2 text-blue-500" /> Education
                </h3>
                {doctor.education && doctor.education.length > 0 ? (
                  <div className="space-y-3">
                    {doctor.education.map((edu, index) => (
                      <div key={index} className="border-l-2 border-blue-300 pl-3">
                        <h4 className="text-md font-medium text-gray-700">{edu.degree}</h4>
                        <p className="text-sm text-gray-500">{edu.institution}</p>
                        <p className="text-xs text-gray-400">{edu.year}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No education information provided.</p>
                )}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <FiAward className="mr-2 text-blue-500" /> Awards & Accomplishments
                </h3>
                {doctor.awards && doctor.awards.length > 0 ? (
                  <ul className="list-disc ml-5 text-gray-600 space-y-1">
                    {doctor.awards.map((award, index) => (
                      <li key={index}>{award}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No awards information provided.</p>
                )}
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <FiCalendar className="mr-2 text-blue-500" /> Availability
                </h3>
                {doctor.availability ? (
                  <div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                        <span 
                          key={index}
                          className={`inline-block w-9 text-center py-1 text-xs rounded-md ${
                            doctor.availability.days.includes(day) 
                              ? 'bg-blue-100 text-blue-800 font-medium' 
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Hours:</span> {doctor.availability.startTime} - {doctor.availability.endTime}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500">No availability information provided.</p>
                )}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <FiDollarSign className="mr-2 text-blue-500" /> Consultation Fee
                </h3>
                <p className="text-xl font-bold text-gray-800">
                  ₹{doctor.consultationFee ? doctor.consultationFee.toLocaleString('en-IN') : 'N/A'}
                </p>
                <p className="text-sm text-gray-500 mt-1">per session</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <FiGlobe className="mr-2 text-blue-500" /> Languages Spoken
                </h3>
                {doctor.languages && doctor.languages.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {doctor.languages.map((language, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                      >
                        {language}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No language information provided.</p>
                )}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <FiHeart className="mr-2 text-blue-500" /> Specialties
                </h3>
                <p className="text-gray-600">{doctor.qualifications || 'No specialties information provided.'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 