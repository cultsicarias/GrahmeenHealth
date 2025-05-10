import { NextResponse } from 'next/server';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const recipientPhoneNumber = process.env.RECIPIENT_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

export async function POST() {
  try {
    const message = await client.messages.create({
      body: "Doctor's Name= Lavish , Doctor's phone: 88614234753",
      from: twilioPhoneNumber,
      to: recipientPhoneNumber
    });

    return NextResponse.json({ 
      success: true, 
      messageSid: message.sid 
    });
  } catch (error) {
    console.error('Error sending SMS:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send SMS' },
      { status: 500 }
    );
  }
} 