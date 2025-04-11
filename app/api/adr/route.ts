import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import mongoose from 'mongoose';

// Create ADR schema and model
const ADRReportSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  medication: { type: String, required: true },
  reaction: { type: String, required: true },
  severity: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create the model if it doesn't exist
const ADRReport = mongoose.models.ADRReport || mongoose.model('ADRReport', ADRReportSchema);

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // Get user to retrieve ObjectId
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await req.json();
    const { medication, reaction, severity, date, description } = body;

    const adrReport = await ADRReport.create({
      patientId: user._id,
      medication,
      reaction,
      severity,
      date: new Date(date),
      description,
      status: 'pending'
    });

    return NextResponse.json({ report: adrReport });
  } catch (error) {
    console.error('Error creating ADR report:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // Get user to retrieve ObjectId
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const patientIdParam = searchParams.get('patientId');
    
    let patientId = user._id;
    if (patientIdParam) {
      // If admin or doctor is checking a specific patient's reports
      patientId = new mongoose.Types.ObjectId(patientIdParam);
    }

    const reports = await ADRReport.find({
      patientId: patientId
    }).sort({ date: -1 });

    return NextResponse.json({ reports });
  } catch (error) {
    console.error('Error fetching ADR reports:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 