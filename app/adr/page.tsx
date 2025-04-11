'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { detectAdverseReactions, calculateAdrSeverity } from '@/lib/adrDetection';

export default function ADRPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    medication: '',
    reaction: '',
    severity: 'moderate',
    date: '',
    description: ''
  });
  const [reports, setReports] = useState([]);
  const [adrWarnings, setAdrWarnings] = useState<{ type: string, severity: string, confidence: number }[]>([]);
  const [overallSeverity, setOverallSeverity] = useState('none');

  useEffect(() => {
    // Fetch existing ADR reports
    fetch('/api/adr')
      .then(res => res.json())
      .then(data => setReports(data.reports))
      .catch(err => console.error('Error fetching ADR reports:', err));
  }, []);

  useEffect(() => {
    // Check for ADRs when medication and reaction are entered
    if (formData.medication && formData.reaction) {
      const symptoms = formData.reaction.split(',').map(s => s.trim());
      const warnings = detectAdverseReactions(formData.medication, symptoms);
      setAdrWarnings(warnings);
      setOverallSeverity(calculateAdrSeverity(warnings));
    }
  }, [formData.medication, formData.reaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/adr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Refresh reports
        const updatedReports = await fetch('/api/adr').then(res => res.json());
        setReports(updatedReports.reports);
        
        // Reset form
        setFormData({
          medication: '',
          reaction: '',
          severity: 'moderate',
          date: '',
          description: ''
        });
      } else {
        console.error('Error creating ADR report');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">ADR Monitoring</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Medication</label>
              <input
                type="text"
                value={formData.medication}
                onChange={(e) => setFormData({ ...formData, medication: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Reaction (comma-separated symptoms)</label>
              <textarea
                value={formData.reaction}
                onChange={(e) => setFormData({ ...formData, reaction: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Severity</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Submit Report
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">ADR Analysis</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Overall Severity</h3>
                <div className="mt-2">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    overallSeverity === 'critical' ? 'bg-red-100 text-red-800' :
                    overallSeverity === 'severe' ? 'bg-orange-100 text-orange-800' :
                    overallSeverity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                    overallSeverity === 'mild' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {overallSeverity.charAt(0).toUpperCase() + overallSeverity.slice(1)}
                  </span>
                </div>
              </div>

              {adrWarnings.length > 0 && (
                <div>
                  <h3 className="font-medium">Detected ADR Patterns</h3>
                  <ul className="mt-2 space-y-2">
                    {adrWarnings.map((warning, index) => (
                      <li key={index} className="flex items-center justify-between">
                        <span>{warning.type}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          warning.severity === 'critical' ? 'bg-red-100 text-red-800' :
                          warning.severity === 'severe' ? 'bg-orange-100 text-orange-800' :
                          warning.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {warning.severity}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Previous Reports</h2>
            <div className="space-y-4">
              {reports.map((report: any) => (
                <div key={report.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{report.medication}</h3>
                      <p className="text-sm text-gray-600">{new Date(report.date).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      report.severity === 'critical' ? 'bg-red-100 text-red-800' :
                      report.severity === 'severe' ? 'bg-orange-100 text-orange-800' :
                      report.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {report.severity}
                    </span>
                  </div>
                  <p className="mt-2 text-sm">{report.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 