import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    // Check authentication
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Find user excluding password
    const user = await User.findOne(
      { email: session.user.email },
      { password: 0 }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Something went wrong while fetching profile' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    // Check authentication
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    // Prevent updating critical fields
    const { email, password, role, _id, ...updateData } = body;

    await connectDB();

    // Update user
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: updateData },
      { new: true, select: '-password' }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Something went wrong while updating profile' },
      { status: 500 }
    );
  }
} 