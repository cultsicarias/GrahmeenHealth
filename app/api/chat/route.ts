import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { message, language } = await request.json();

    // Get the appropriate model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Create a context-aware prompt based on the language
    const systemPrompt = language === 'en' 
      ? 'You are a medical assistant providing general health information. Always include a disclaimer about consulting healthcare professionals. Keep responses concise and informative.'
      : language === 'hi'
      ? 'आप एक चिकित्सा सहायक हैं जो सामान्य स्वास्थ्य जानकारी प्रदान करते हैं। हमेशा स्वास्थ्य पेशेवरों से परामर्श करने के बारे में एक अस्वीकरण शामिल करें। प्रतिक्रियाओं को संक्षिप्त और जानकारीपूर्ण रखें।'
      : 'ನೀವು ಸಾಮಾನ್ಯ ಆರೋಗ್ಯ ಮಾಹಿತಿಯನ್ನು ಒದಗಿಸುವ ವೈದ್ಯಕೀಯ ಸಹಾಯಕ. ಯಾವಾಗಲೂ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸುವ ಬಗ್ಗೆ ಒಂದು ನಿರಾಕರಣೆಯನ್ನು ಸೇರಿಸಿ. ಪ್ರತಿಕ್ರಿಯೆಗಳನ್ನು ಸಂಕ್ಷಿಪ್ತ ಮತ್ತು ಮಾಹಿತಿಪೂರ್ಣವಾಗಿ ಇರಿಸಿ.';

    // Generate response
    const result = await model.generateContent([
      systemPrompt,
      message
    ]);
    const response = result.response.text();

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 