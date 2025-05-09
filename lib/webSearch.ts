import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY || '');

export async function searchMedicalInfo(query: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `You are a medical assistant. Provide accurate, helpful, and safe information about: ${query}. 
    Include:
    1. Common symptoms
    2. When to seek medical attention
    3. Basic first aid or home care tips
    4. Prevention methods
    Format the response in a clear, easy-to-read way.
    Always include a disclaimer that this is general information and not a substitute for professional medical advice.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error searching medical information:', error);
    return 'I apologize, but I am unable to provide medical information at this time. Please consult a healthcare professional for accurate medical advice.';
  }
} 