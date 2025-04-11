import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import mongoose from 'mongoose';

// Create a Medication schema and model
const MedicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  instructions: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create the model if it doesn't exist
const Medication = mongoose.models.Medication || mongoose.model('Medication', MedicationSchema);

export async function GET() {
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
    
    const medications = await Medication.find({
      userId: user._id
    }).sort({ startDate: -1 });

    return NextResponse.json({ medications });
  } catch (error) {
    console.error('Error fetching medications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch medications' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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

    const body = await request.json();
    const {
      name,
      dosage,
      frequency,
      startDate,
      endDate,
      instructions,
    } = body;

    const medication = await Medication.create({
      userId: user._id,
      name,
      dosage,
      frequency,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      instructions,
    });

    return NextResponse.json({ medication });
  } catch (error) {
    console.error('Error creating medication:', error);
    return NextResponse.json(
      { error: 'Failed to create medication' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
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

    const body = await request.json();
    const {
      id,
      name,
      dosage,
      frequency,
      startDate,
      endDate,
      instructions,
    } = body;

    const medication = await Medication.findOneAndUpdate(
      { _id: id, userId: user._id },
      {
        name,
        dosage,
        frequency,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        instructions,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!medication) {
      return NextResponse.json({ error: 'Medication not found' }, { status: 404 });
    }

    return NextResponse.json({ medication });
  } catch (error) {
    console.error('Error updating medication:', error);
    return NextResponse.json(
      { error: 'Failed to update medication' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Medication ID is required' },
        { status: 400 }
      );
    }

    const result = await Medication.findOneAndDelete({
      _id: id,
      userId: user._id
    });

    if (!result) {
      return NextResponse.json({ error: 'Medication not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting medication:', error);
    return NextResponse.json(
      { error: 'Failed to delete medication' },
      { status: 500 }
    );
  }
} 