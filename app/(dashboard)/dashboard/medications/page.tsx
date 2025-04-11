'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FiPlus, FiTrash2, FiEdit, FiCalendar, FiClock, FiAlertCircle } from 'react-icons/fi';

interface Medication {
  _id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  instructions?: string;
  createdAt: string;
}

export default function MedicationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    _id: '',
    name: '',
    dosage: '',
    frequency: '',
    startDate: '',
    endDate: '',
    instructions: ''
  });

  useEffect(() => {
    // Redirect doctors away from this page
    if (status === 'authenticated' && session?.user?.role === 'doctor') {
      router.push('/dashboard');
      return;
    }

    // Only fetch if it's a patient
    if (status === 'authenticated' && session?.user?.role === 'patient') {
      fetchMedications();
    }
  }, [session, status, router]);

  const fetchMedications = async () => {
    try {
      setLoading(true);
      setMessage({ text: '', type: '' });
      
      const response = await fetch('/api/medications');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch medications');
      }
      
      const data = await response.json();
      setMedications(data.medications || []);
    } catch (error: any) {
      console.error('Error fetching medications:', error);
      setMessage({ 
        text: error.message || 'Failed to load medications', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setMessage({ text: '', type: '' });
      
      const url = isEditing 
        ? `/api/medications/${formData._id}`
        : '/api/medications';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${isEditing ? 'update' : 'add'} medication`);
      }
      
      // Reset form and state
      setMessage({ 
        text: `Medication ${isEditing ? 'updated' : 'added'} successfully!`, 
        type: 'success' 
      });
      setIsFormOpen(false);
      setIsEditing(false);
      setFormData({
        _id: '',
        name: '',
        dosage: '',
        frequency: '',
        startDate: '',
        endDate: '',
        instructions: ''
      });
      
      // Refresh medications list
      fetchMedications();
    } catch (error: any) {
      console.error('Error saving medication:', error);
      setMessage({ 
        text: error.message || `Failed to ${isEditing ? 'update' : 'add'} medication`, 
        type: 'error' 
      });
    }
  };

  const handleEdit = (medication: Medication) => {
    setIsEditing(true);
    setIsFormOpen(true);
    setFormData({
      _id: medication._id,
      name: medication.name,
      dosage: medication.dosage,
      frequency: medication.frequency,
      startDate: new Date(medication.startDate).toISOString().split('T')[0],
      endDate: medication.endDate ? new Date(medication.endDate).toISOString().split('T')[0] : '',
      instructions: medication.instructions || ''
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this medication?')) {
      return;
    }
    
    try {
      setMessage({ text: '', type: '' });
      
      const response = await fetch(`/api/medications/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete medication');
      }
      
      setMessage({ text: 'Medication deleted successfully!', type: 'success' });
      
      // Refresh medications list
      fetchMedications();
    } catch (error: any) {
      console.error('Error deleting medication:', error);
      setMessage({ 
        text: error.message || 'Failed to delete medication', 
        type: 'error' 
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  // Only patients can access this page
  if (session?.user?.role !== 'patient') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
          <FiAlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            This page is only available to patients. Doctors cannot access the medications page.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Medications</h1>
        <button
          onClick={() => {
            setIsFormOpen(!isFormOpen);
            setIsEditing(false);
            setFormData({
              _id: '',
              name: '',
              dosage: '',
              frequency: '',
              startDate: '',
              endDate: '',
              instructions: ''
            });
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isFormOpen ? 'Cancel' : <><FiPlus className="mr-2" /> Add Medication</>}
        </button>
      </div>

      {message.text && (
        <div className={`p-4 mb-6 rounded-md ${message.type === 'error' ? 'bg-red-50 text-red-800 border-l-4 border-red-500' : 'bg-green-50 text-green-800 border-l-4 border-green-500'}`}>
          {message.text}
        </div>
      )}

      {isFormOpen && (
        <div className="bg-white shadow-md rounded-lg mb-8 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              {isEditing ? 'Edit Medication' : 'Add New Medication'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Medication Name*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Aspirin, Lisinopril"
                />
              </div>
              
              <div>
                <label htmlFor="dosage" className="block text-sm font-medium text-gray-700 mb-1">
                  Dosage*
                </label>
                <input
                  type="text"
                  id="dosage"
                  name="dosage"
                  value={formData.dosage}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 81mg, 500mg"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
                Frequency*
              </label>
              <input
                type="text"
                id="frequency"
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Once daily, Twice daily with meals"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date*
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date (if applicable)
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-1">
                Special Instructions
              </label>
              <textarea
                id="instructions"
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Take with food, Avoid alcohol"
              />
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isEditing ? 'Update Medication' : 'Add Medication'}
              </button>
            </div>
          </form>
        </div>
      )}

      {medications.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-10 text-center">
          <svg 
            className="mx-auto h-16 w-16 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No medications found</h3>
          <p className="mt-1 text-gray-500">Get started by adding your first medication.</p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiPlus className="mr-2" /> Add Medication
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {medications.map((medication) => (
            <div key={medication._id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 mr-2">
                        {medication.name}
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {medication.dosage}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">
                      {medication.frequency}
                    </p>
                    <div className="flex flex-wrap gap-y-2 text-sm text-gray-500">
                      <div className="flex items-center mr-4">
                        <FiCalendar className="mr-1.5 h-4 w-4 text-gray-400" />
                        <span>Started: {formatDate(medication.startDate)}</span>
                      </div>
                      {medication.endDate && (
                        <div className="flex items-center mr-4">
                          <FiClock className="mr-1.5 h-4 w-4 text-gray-400" />
                          <span>Ends: {formatDate(medication.endDate)}</span>
                        </div>
                      )}
                    </div>
                    
                    {medication.instructions && (
                      <div className="mt-2 text-sm text-gray-500">
                        <span className="font-medium">Instructions:</span> {medication.instructions}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 md:mt-0 flex">
                    <button
                      onClick={() => handleEdit(medication)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-2"
                    >
                      <FiEdit className="mr-1.5 h-4 w-4" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(medication._id)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <FiTrash2 className="mr-1.5 h-4 w-4" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 