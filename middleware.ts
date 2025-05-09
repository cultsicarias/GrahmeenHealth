import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


// This middleware runs before any route handler
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is trying to access an appointment with an invalid MongoDB ID
  if (pathname.startsWith('/api/appointments/') && !pathname.startsWith('/api/appointments/route')) {
    const appointmentId = pathname.replace('/api/appointments/', '');
    
    // Check if the ID is a valid MongoDB ObjectId (24 character hex string)
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(appointmentId);
    
    // If not valid ObjectId and not a known valid route, return a 400 bad request
    if (!isValidObjectId) {
      console.warn(`Invalid appointment ID format: ${appointmentId}`);
      return NextResponse.json(
        { 
          error: 'Invalid appointment ID format',
          details: `'${appointmentId}' is not a valid MongoDB ObjectId` 
        }, 
        { status: 400 }
      );
    }
  }
  
  // Continue with the request otherwise
  return NextResponse.next();
}

// Only run the middleware on API routes
export const config = {
  matcher: '/api/:path*',
}; 
