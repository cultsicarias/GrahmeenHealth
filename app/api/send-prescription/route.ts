import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { PrescriptionPDF } from '@/app/components/PrescriptionPDF';
import { renderToBuffer, Document } from '@react-pdf/renderer';
import React from 'react';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
if (!RESEND_API_KEY) {
  throw new Error('Missing RESEND_API_KEY environment variable');
}

const resend = new Resend(RESEND_API_KEY);

import type { Medication } from '@/types';

interface PrescriptionData {
  patientName: string;
  date: string;
  diagnosis: string;
  medications: Medication[];
  treatment: string;
  nextVisit: string;
  doctorName: string;
}

export async function POST(request: Request) {
  console.log('Starting prescription email send...');
  try {
    const data = await request.json() as PrescriptionData;
    console.log('Received data:', { ...data, medications: data.medications.length });
    
    // Create HTML email content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0;">VaidyaCare Medical Prescription</h1>
          <p style="color: #666; margin-top: 5px;">Date: ${data.date}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h2 style="color: #1f2937; font-size: 18px;">Patient Information</h2>
          <p style="margin: 5px 0;"><strong>Name:</strong> ${data.patientName}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h2 style="color: #1f2937; font-size: 18px;">Diagnosis</h2>
          <p style="margin: 5px 0;">${data.diagnosis}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h2 style="color: #1f2937; font-size: 18px;">Prescribed Medications</h2>
          <ul style="list-style-type: none; padding: 0;">
            ${data.medications.map(med => `
              <li style="margin: 10px 0; padding: 10px; background-color: #f3f4f6; border-radius: 4px;">
                <strong>${med.name}</strong> - ${med.dosage}
              </li>
            `).join('')}
          </ul>
        </div>

        <div style="margin-bottom: 20px;">
          <h2 style="color: #1f2937; font-size: 18px;">Treatment Plan</h2>
          <p style="margin: 5px 0;">${data.treatment}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h2 style="color: #1f2937; font-size: 18px;">Next Visit</h2>
          <p style="margin: 5px 0;">${data.nextVisit}</p>
        </div>

        <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
          <p style="margin: 5px 0; text-align: right;">
            <strong>Dr. ${data.doctorName}</strong><br>
            <span style="color: #666;">VaidyaCare Medical Center</span>
          </p>
        </div>
      </div>
    `;

    console.log('Sending email...');
    const { data: emailData, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'gauravmishraokok@gmail.com',
      subject: `Medical Prescription for ${data.patientName}`,
      html: htmlContent,
    });

    if (error) {
      console.error('Resend API error:', error);
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ message: 'Prescription sent successfully' });
  } catch (error) {
    console.error('Error in send-prescription:', error);
    return NextResponse.json({ 
      error: 'Failed to send prescription',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
