'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { useSession } from 'next-auth/react';

export default function PatientQRCode() {
  const { data: session } = useSession();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    const generateQRCode = async () => {
      if (session?.user?.profileId) {
        try {
          // Fetch patient data
          const response = await fetch('/api/patients/profile');
          if (!response.ok) {
            throw new Error('Failed to fetch patient data');
          }
          const data = await response.json();
          const patient = data.patient;

          // Format date function
          const formatDate = (dateString: string) => {
            return new Date(dateString).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
          };

          // Create a simple text format of patient data
          const patientInfo = `
Patient Information:
------------------
Name: ${session.user.name}
Phone: ${patient.phone || 'Not specified'}
Blood Group: ${patient.bloodGroup || 'Not specified'}
Gender: ${patient.gender || 'Not specified'}
Height: ${patient.height ? `${patient.height} cm` : 'Not specified'}
Weight: ${patient.weight ? `${patient.weight} kg` : 'Not specified'}

Medical Conditions:
-----------------
${patient.medicalConditions?.map((condition: any) => 
  `- ${condition.name} (${condition.severity || 'Not specified'})
   Diagnosed: ${condition.diagnosedDate ? formatDate(condition.diagnosedDate) : 'Not specified'}
   Notes: ${condition.notes || 'No notes'}`
).join('\n\n') || 'No medical conditions'}

Medications:
-----------
${patient.medications?.map((medication: any) => 
  `- ${medication.name}
   Dosage: ${medication.dosage}
   Frequency: ${medication.frequency}
   Start Date: ${medication.startDate ? formatDate(medication.startDate) : 'Not specified'}
   End Date: ${medication.endDate ? formatDate(medication.endDate) : 'Ongoing'}`
).join('\n\n') || 'No medications'}

Medical Records (Visits):
-----------------------
${patient.visits?.map((visit: any) => 
  `Visit Date: ${formatDate(visit.date)}
   Doctor: ${visit.doctorName}
   Status: ${visit.status}
   Symptoms: ${visit.symptoms.join(', ')}
   Diagnosis: ${visit.diagnosis}
   Treatment: ${visit.treatment}
   ${visit.followUpDate ? `Follow-up Date: ${formatDate(visit.followUpDate)}` : ''}
   ${visit.notes ? `Notes: ${visit.notes}` : ''}`
).join('\n\n') || 'No medical records'}

Emergency Contact:
----------------
${patient.emergencyContact ? 
  `Name: ${patient.emergencyContact.name}
Phone: ${patient.emergencyContact.phone}
Relationship: ${patient.emergencyContact.relationship}` 
  : 'No emergency contact specified'}

Last Updated: ${new Date().toLocaleString()}
          `.trim();

          // Generate QR code with the text data
          const qrCodeDataUrl = await QRCode.toDataURL(patientInfo, {
            width: 300,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#ffffff'
            }
          });
          
          setQrCodeUrl(qrCodeDataUrl);
        } catch (error) {
          console.error('Error generating QR code:', error);
        }
      }
    };

    generateQRCode();
  }, [session]);

  if (!qrCodeUrl) {
    return <div>Loading QR code...</div>;
  }

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Patient QR Code</h3>
      <img src={qrCodeUrl} alt="Patient QR Code" className="w-64 h-64" />
      <p className="mt-2 text-sm text-gray-600">
        Scan this QR code to view patient information
      </p>
      <div className="mt-4 text-xs text-gray-500">
        <p>This QR code contains:</p>
        <ul className="list-disc list-inside mt-1">
          <li>Personal Information</li>
          <li>Medical Conditions</li>
          <li>Medications</li>
          <li>Medical Records (Visits)</li>
          <li>Emergency Contact</li>
        </ul>
      </div>
    </div>
  );
} 