import { NextResponse } from 'next/server';
import { sendSMS } from '../../../sms.js';

export async function POST(request) {
  try {
    const { message } = await request.json();
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }
    const result = await sendSMS(message);
    return NextResponse.json({ success: true, sid: result.sid });
  } catch (error) {
    // Log everything for debugging
    console.error('SMS API Error:', error);

    // Try to extract as much as possible
    let errorMsg = 'Failed to send SMS';
    let details = {};

    if (error) {
      // Try to get all properties, including non-enumerable
      try {
        details = Object.getOwnPropertyNames(error).reduce((acc, key) => {
          acc[key] = error[key];
          return acc;
        }, {});
      } catch (e) {
        details = { errorString: String(error) };
      }
      if (error.message) errorMsg = error.message;
      else if (typeof error === 'string') errorMsg = error;
      else if (details) errorMsg = JSON.stringify(details);
      else errorMsg = String(error);
    }

    // Log details for server-side debugging
    console.error('SMS API Error details:', details);

    return NextResponse.json({ error: errorMsg, details }, { status: 500 });
  }
} 