'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function ADRPage() {
  const { data: session } = useSession();
  const [adrReports, setAdrReports] = useState([]);
  const [newReport, setNewReport] = useState({
    medication: '',
    reaction: '',
    severity: 'mild',
    date: '',
    description: ''
  });

  useEffect(() => {
    // Fetch ADR reports
    const fetchADRReports = async () => {
      try {
        const response = await fetch('/api/adr');
        if (response.ok) {
          const data = await response.json();
          setAdrReports(data.reports);
        }
      } catch (error) {
        console.error('Error fetching ADR reports:', error);
      }
    };

    fetchADRReports();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/adr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newReport),
      });

      if (response.ok) {
        const data = await response.json();
        setAdrReports([...adrReports, data.report]);
        setNewReport({
          medication: '',
          reaction: '',
          severity: 'mild',
          date: '',
          description: ''
        });
      }
    } catch (error) {
      console.error('Error submitting ADR report:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Adverse Drug Reaction Monitoring</h1>

      {/* New ADR Report Form */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Report New ADR</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Medication</label>
              <input
                type="text"
                value={newReport.medication}
                onChange={(e) => setNewReport({ ...newReport, medication: e.target.value })}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Reaction</label>
              <input
                type="text"
                value={newReport.reaction}
                onChange={(e) => setNewReport({ ...newReport, reaction: e.target.value })}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Severity</label>
              <select
                value={newReport.severity}
                onChange={(e) => setNewReport({ ...newReport, severity: e.target.value })}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
                <option value="life-threatening">Life-threatening</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={newReport.date}
                onChange={(e) => setNewReport({ ...newReport, date: e.target.value })}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={newReport.description}
              onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
              className="w-full p-2 border rounded-md"
              rows={3}
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>

      {/* ADR Reports List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Recent ADR Reports</h2>
        <div className="space-y-4">
          {adrReports.length > 0 ? (
            adrReports.map((report, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{report.medication}</h3>
                    <p className="text-sm text-gray-500">{report.reaction}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-sm ${
                    report.severity === 'mild' ? 'bg-green-100 text-green-800' :
                    report.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                    report.severity === 'severe' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {report.severity}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600">{report.description}</p>
                <p className="mt-2 text-xs text-gray-500">Reported on: {new Date(report.date).toLocaleDateString()}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No ADR reports found</p>
          )}
        </div>
      </div>
    </div>
  );
} 