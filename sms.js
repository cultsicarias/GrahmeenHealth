import 'dotenv/config';
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export function sendSMS(message) {
  return client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: process.env.MY_PHONE_NUMBER
  });
}

// Remove or comment out the example usage to avoid sending test SMS on every import
// sendSMS("Hello from your website!").then(msg => console.log("Sent:", msg.sid));

module.exports = { sendSMS };
