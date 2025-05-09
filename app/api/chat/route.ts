import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

// Type definitions for medical conditions
type MedicalCondition = {
  description: string;
  symptoms: string[];
  advice: string;
};

type LanguageConditions = {
  [key: string]: MedicalCondition;
};

type CommonConditions = {
  [key in 'en' | 'hi' | 'kn']: LanguageConditions;
};

// Add a fallback response system for when AI is not available
const fallbackResponses = {
  en: {
    greeting: "Hello! I'm Dr. HealthBot, your friendly medical assistant. How can I help you today?",
    error: "I'm here to help! Could you please rephrase your question? I can provide information about common health conditions like fever, cough, headache, and more.",
    goodbye: "Take care! Feel free to ask if you have any other questions.",
    unknown: "I understand you're asking about health. Could you please be more specific about what you'd like to know?"
  },
  hi: {
    greeting: "नमस्ते! मैं डॉ. हेल्थबॉट हूं, आपकी मैत्रीपूर्ण चिकित्सा सहायक। मैं आपकी कैसे मदद कर सकता हूं?",
    error: "मैं मदद करने के लिए यहां हूं! क्या आप अपना प्रश्न दोबारा पूछ सकते हैं? मैं बुखार, खांसी, सिरदर्द जैसी सामान्य स्वास्थ्य स्थितियों के बारे में जानकारी दे सकता हूं।",
    goodbye: "अलविदा! अगर आपके कोई और प्रश्न हैं तो पूछने में संकोच न करें।",
    unknown: "मैं समझता हूं कि आप स्वास्थ्य के बारे में पूछ रहे हैं। क्या आप बता सकते हैं कि आप क्या जानना चाहते हैं?"
  },
  kn: {
    greeting: "ನಮಸ್ಕಾರ! ನಾನು ಡಾ. ಹೆಲ್ತ್‌ಬಾಟ್, ನಿಮ್ಮ ಸ್ನೇಹಪರ ವೈದ್ಯಕೀಯ ಸಹಾಯಕ. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
    error: "ನಾನು ಸಹಾಯ ಮಾಡಲು ಇಲ್ಲಿದ್ದೇನೆ! ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಮತ್ತೆ ಕೇಳಬಹುದೇ? ನಾನು ಜ್ವರ, ಕೆಮ್ಮು, ತಲೆನೋವು ಮುಂತಾದ ಸಾಮಾನ್ಯ ಆರೋಗ್ಯ ಪರಿಸ್ಥಿತಿಗಳ ಬಗ್ಗೆ ಮಾಹಿತಿ ನೀಡಬಹುದು.",
    goodbye: "ಬೀಗಿ! ನಿಮಗೆ ಬೇರೆ ಪ್ರಶ್ನೆಗಳಿದ್ದರೆ ಕೇಳಲು ಹಿಂಜರಿಯಬೇಡಿ.",
    unknown: "ನೀವು ಆರೋಗ್ಯದ ಬಗ್ಗೆ ಕೇಳುತ್ತಿದ್ದೀರಿ ಎಂದು ನಾನು ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದೇನೆ. ನೀವು ಏನು ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ ಎಂದು ನಿರ್ದಿಷ್ಟವಾಗಿ ಹೇಳಬಹುದೇ?"
  }
};

// Update the common conditions to be more concise
const commonConditions: CommonConditions = {
  en: {
    'fever': {
      description: 'A temporary increase in body temperature, often due to an infection.',
      symptoms: ['Elevated body temperature', 'Chills', 'Sweating', 'Headache', 'Muscle aches'],
      advice: 'Rest, stay hydrated, and monitor temperature. Seek medical attention if fever is high or persists.'
    },
    'headache': {
      description: 'Pain in the head or upper neck, can be primary or secondary.',
      symptoms: ['Pain in head', 'Pressure', 'Sensitivity to light', 'Nausea'],
      advice: 'Rest in a quiet, dark room. Stay hydrated. Consider over-the-counter pain relievers if appropriate.'
    },
    'cough': {
      description: 'A reflex to clear your airways.',
      symptoms: ['Dry or wet cough', 'Sore throat', 'Chest discomfort'],
      advice: 'Rest well, drink plenty of water, and use a humidifier. See a doctor if it gets worse.'
    },
    'cold': {
      description: 'A viral infection of the upper respiratory tract.',
      symptoms: ['Runny nose', 'Sore throat', 'Cough', 'Congestion', 'Mild fever'],
      advice: 'Rest, stay hydrated, and use over-the-counter remedies for symptoms.'
    },
    'flu': {
      description: 'A contagious respiratory illness caused by influenza viruses.',
      symptoms: ['High fever', 'Body aches', 'Fatigue', 'Cough', 'Sore throat'],
      advice: 'Rest, stay hydrated, and consider antiviral medications if caught early.'
    },
    'allergies': {
      description: 'An immune system reaction to substances that are usually harmless.',
      symptoms: ['Sneezing', 'Runny nose', 'Itchy eyes', 'Rash', 'Congestion'],
      advice: 'Avoid triggers, use antihistamines, and consider allergy testing.'
    },
    'anxiety': {
      description: 'A mental health condition characterized by excessive worry and fear.',
      symptoms: ['Restlessness', 'Racing thoughts', 'Difficulty concentrating', 'Sleep problems'],
      advice: 'Practice relaxation techniques, maintain a regular sleep schedule, and consider professional help.'
    },
    'depression': {
      description: 'A mood disorder causing persistent sadness and loss of interest.',
      symptoms: ['Persistent sadness', 'Loss of interest', 'Changes in sleep', 'Fatigue'],
      advice: 'Seek professional help, maintain social connections, and consider therapy.'
    },
    'hypertension': {
      description: 'High blood pressure, a common condition affecting the body\'s arteries.',
      symptoms: ['Usually asymptomatic', 'Headaches', 'Shortness of breath', 'Nosebleeds'],
      advice: 'Regular monitoring, lifestyle changes, and medication if prescribed.'
    },
    'diabetes': {
      description: 'A condition affecting how the body processes blood sugar.',
      symptoms: ['Increased thirst', 'Frequent urination', 'Fatigue', 'Blurred vision'],
      advice: 'Monitor blood sugar, maintain a healthy diet, and follow medical advice.'
    },
    'asthma': {
      description: 'A condition affecting airways in the lungs.',
      symptoms: ['Wheezing', 'Shortness of breath', 'Chest tightness', 'Coughing'],
      advice: 'Use prescribed inhalers, avoid triggers, and have an action plan.'
    },
    'arthritis': {
      description: 'Inflammation of joints causing pain and stiffness.',
      symptoms: ['Joint pain', 'Stiffness', 'Swelling', 'Reduced range of motion'],
      advice: 'Exercise regularly, maintain healthy weight, and use prescribed medications.'
    },
    'migraine': {
      description: 'A neurological condition causing severe headaches.',
      symptoms: ['Severe headache', 'Nausea', 'Sensitivity to light', 'Aura'],
      advice: 'Rest in a dark room, stay hydrated, and use prescribed medications.'
    },
    'gastritis': {
      description: 'Inflammation of the stomach lining.',
      symptoms: ['Stomach pain', 'Nausea', 'Vomiting', 'Loss of appetite'],
      advice: 'Avoid irritants, eat smaller meals, and follow prescribed treatment.'
    },
    'anemia': {
      description: 'A condition where blood lacks enough healthy red blood cells.',
      symptoms: ['Fatigue', 'Weakness', 'Pale skin', 'Shortness of breath'],
      advice: 'Iron-rich diet, supplements if prescribed, and regular check-ups.'
    },
    'thyroid': {
      description: 'A condition affecting the thyroid gland\'s hormone production.',
      symptoms: ['Weight changes', 'Fatigue', 'Mood changes', 'Temperature sensitivity'],
      advice: 'Regular thyroid function tests and follow prescribed medication.'
    },
    'sinusitis': {
      description: 'Inflammation of the sinuses, often due to infection.',
      symptoms: ['Facial pain', 'Nasal congestion', 'Headache', 'Post-nasal drip'],
      advice: 'Use saline nasal sprays, stay hydrated, and consider decongestants.'
    },
    'bronchitis': {
      description: 'Inflammation of the bronchial tubes in the lungs.',
      symptoms: ['Persistent cough', 'Mucus production', 'Chest discomfort', 'Fatigue'],
      advice: 'Rest, stay hydrated, use a humidifier, and avoid smoking.'
    },
    'urinary tract infection': {
      description: 'An infection in any part of the urinary system.',
      symptoms: ['Frequent urination', 'Burning sensation', 'Cloudy urine', 'Lower abdominal pain'],
      advice: 'Drink plenty of water, take prescribed antibiotics, and maintain good hygiene.'
    },
    'conjunctivitis': {
      description: 'Inflammation of the eye\'s outer membrane.',
      symptoms: ['Red eyes', 'Itching', 'Discharge', 'Tearing'],
      advice: 'Keep eyes clean, avoid touching, and use prescribed eye drops.'
    },
    'insomnia': {
      description: 'Difficulty falling or staying asleep.',
      symptoms: ['Difficulty falling asleep', 'Waking up frequently', 'Daytime fatigue', 'Irritability'],
      advice: 'Maintain a regular sleep schedule, limit screen time, and create a comfortable sleep environment.'
    },
    'acid reflux': {
      description: 'Stomach acid flowing back into the esophagus.',
      symptoms: ['Heartburn', 'Regurgitation', 'Chest pain', 'Difficulty swallowing'],
      advice: 'Avoid trigger foods, eat smaller meals, and maintain an upright position after eating.'
    },
    'eczema': {
      description: 'A skin condition causing inflammation and irritation.',
      symptoms: ['Itchy skin', 'Redness', 'Dry patches', 'Rash'],
      advice: 'Moisturize regularly, avoid triggers, and use prescribed creams.'
    },
    'pneumonia': {
      description: 'Infection causing inflammation of air sacs in the lungs.',
      symptoms: ['Cough with mucus', 'Fever', 'Difficulty breathing', 'Chest pain'],
      advice: 'Rest, take prescribed antibiotics, and seek immediate care if breathing becomes difficult.'
    },
    'vertigo': {
      description: 'A sensation of spinning or dizziness.',
      symptoms: ['Spinning sensation', 'Balance problems', 'Nausea', 'Sweating'],
      advice: 'Move slowly, avoid sudden movements, and consider vestibular therapy.'
    },
    'sick': {
      description: 'A general feeling of being unwell or having multiple symptoms of illness.',
      symptoms: ['General fatigue', 'Body aches', 'Loss of appetite', 'Mild fever', 'Nausea', 'Weakness'],
      advice: 'Rest well, stay hydrated, eat light meals, and monitor your symptoms. Seek medical attention if symptoms worsen or persist.'
    }
  },
  hi: {
    'बुखार': {
      description: 'शरीर के तापमान में अस्थायी वृद्धि, अक्सर संक्रमण के कारण होती है।',
      symptoms: ['बढ़ा हुआ शरीर का तापमान', 'ठंड लगना', 'पसीना आना', 'सिरदर्द', 'मांसपेशियों में दर्द'],
      advice: 'आराम करें, हाइड्रेटेड रहें, और तापमान की निगरानी करें। यदि बुखार अधिक है या बना रहता है तो चिकित्सक से संपर्क करें।'
    },
    'खांसी': {
      description: 'वायुमार्ग को साफ करने के लिए एक प्रतिवर्त क्रिया।',
      symptoms: ['सूखी या गीली खांसी', 'गले में खराश', 'छाती में असुविधा'],
      advice: 'अच्छी तरह से आराम करें, खूब पानी पिएं, और ह्यूमिडिफायर का उपयोग करें। यदि बिगड़ जाए तो डॉक्टर से मिलें।'
    },
    'बीमार': {
      description: 'बीमारी के कई लक्षणों के साथ अस्वस्थ महसूस करना।',
      symptoms: ['सामान्य थकान', 'शरीर में दर्द', 'भूख न लगना', 'हल्का बुखार', 'मतली', 'कमजोरी'],
      advice: 'अच्छी तरह से आराम करें, हाइड्रेटेड रहें, हल्का भोजन करें, और अपने लक्षणों पर नजर रखें। यदि लक्षण बिगड़ते हैं या बने रहते हैं तो चिकित्सक से संपर्क करें।'
    }
  },
  kn: {
    'ಜ್ವರ': {
      description: 'ದೇಹದ ಉಷ್ಣತೆಯಲ್ಲಿ ತಾತ್ಕಾಲಿಕ ಹೆಚ್ಚಳ, ಸಾಮಾನ್ಯವಾಗಿ ಸೋಂಕಿನಿಂದ ಉಂಟಾಗುತ್ತದೆ.',
      symptoms: ['ಹೆಚ್ಚಿದ ದೇಹದ ಉಷ್ಣತೆ', 'ಜುಮ್ಮು', 'ಘಾಮ', 'ತಲೆನೋವು', 'ಸ್ನಾಯು ನೋವು'],
      advice: 'ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ, ನೀರನ್ನು ಸಾಕಷ್ಟು ಕುಡಿಯಿರಿ, ಮತ್ತು ಉಷ್ಣತೆಯನ್ನು ಗಮನಿಸಿ. ಜ್ವರ ಹೆಚ್ಚಿದರೆ ಅಥವಾ ಮುಂದುವರಿದರೆ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.'
    },
    'ಕೆಮ್ಮು': {
      description: 'ನಿಮ್ಮ ವಾಯುಮಾರ್ಗಗಳನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಲು ಒಂದು ಪ್ರತಿವರ್ತಿ.',
      symptoms: ['ಒಣ ಅಥವಾ ತೇವ ಕೆಮ್ಮು', 'ಗಂಟಲು ನೋವು', 'ಎದೆ ಅಸ್ವಸ್ಥತೆ'],
      advice: 'ಚೆನ್ನಾಗಿ ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ, ಸಾಕಷ್ಟು ನೀರು ಕುಡಿಯಿರಿ, ಮತ್ತು ಆರ್ದ್ರಕವನ್ನು ಬಳಸಿ. ಕೆಟ್ಟದಾಗಿದ್ದರೆ ವೈದ್ಯರನ್ನು ನೋಡಿ.'
    },
    'ಅನಾರೋಗ್ಯ': {
      description: 'ಅನಾರೋಗ್ಯದ ಅನೇಕ ಲಕ್ಷಣಗಳೊಂದಿಗೆ ಸಾಮಾನ್ಯವಾಗಿ ಅನಾರೋಗ್ಯವಾಗಿರುವ ಭಾವನೆ.',
      symptoms: ['ಸಾಮಾನ್ಯ ದಣಿವು', 'ದೇಹ ನೋವು', 'ಹಸಿವು ಕಡಿಮೆ', 'ಸೌಮ್ಯ ಜ್ವರ', 'ಓಕರಿಕೆ', 'ದೌರ್ಬಲ್ಯ'],
      advice: 'ಚೆನ್ನಾಗಿ ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ, ನೀರನ್ನು ಸಾಕಷ್ಟು ಕುಡಿಯಿರಿ, ಹಗುರ ಆಹಾರ ತಿನ್ನಿರಿ, ಮತ್ತು ನಿಮ್ಮ ಲಕ್ಷಣಗಳನ್ನು ಗಮನಿಸಿ. ಲಕ್ಷಣಗಳು ಕೆಟ್ಟದಾಗಿದ್ದರೆ ಅಥವಾ ಮುಂದುವರಿದರೆ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.'
    }
  }
};

// Add a simple system prompt for the AI model
const getSystemPrompt = (language: 'en' | 'hi' | 'kn') => {
  return language === 'en' 
    ? "You are Dr. HealthBot, a friendly medical assistant. Keep responses brief and conversational. Focus on providing clear, simple advice about common health conditions."
    : language === 'hi'
    ? "आप डॉ. हेल्थबॉट हैं, एक मैत्रीपूर्ण चिकित्सा सहायक। प्रतिक्रियाएं संक्षिप्त और बातचीत के स्वर में रखें। सामान्य स्वास्थ्य स्थितियों के बारे में स्पष्ट, सरल सलाह देने पर ध्यान दें।"
    : "ನೀವು ಡಾ. ಹೆಲ್ತ್‌ಬಾಟ್, ಸ್ನೇಹಪರ ವೈದ್ಯಕೀಯ ಸಹಾಯಕ. ಪ್ರತಿಕ್ರಿಯೆಗಳನ್ನು ಸಂಕ್ಷಿಪ್ತ ಮತ್ತು ಸಂಭಾಷಣಾತ್ಮಕವಾಗಿ ಇರಿಸಿ. ಸಾಮಾನ್ಯ ಆರೋಗ್ಯ ಪರಿಸ್ಥಿತಿಗಳ ಬಗ್ಗೆ ಸ್ಪಷ್ಟ, ಸರಳ ಸಲಹೆಗಳನ್ನು ನೀಡುವುದರ ಮೇಲೆ ಗಮನ ಹರಿಸಿ.";
};

export async function POST(request: Request) {
  try {
    const { message, language } = await request.json() as { message: string; language: 'en' | 'hi' | 'kn' };

    // Handle basic greetings and goodbyes
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return NextResponse.json({ response: fallbackResponses[language].greeting });
    }
    if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
      return NextResponse.json({ response: fallbackResponses[language].goodbye });
    }

    // Check if the message matches any predefined conditions
    const matchedCondition = Object.keys(commonConditions[language]).find(condition => 
      message.toLowerCase().includes(condition.toLowerCase())
    );

    let response: string;
    if (matchedCondition) {
      const condition = commonConditions[language][matchedCondition];
      response = `${language === 'en' ? 'About' : language === 'hi' ? 'के बारे में' : 'ಬಗ್ಗೆ'} ${matchedCondition}:\n\n` +
        `${condition.description}\n\n` +
        `${language === 'en' ? 'Common signs' : language === 'hi' ? 'सामान्य लक्षण' : 'ಸಾಮಾನ್ಯ ಲಕ್ಷಣಗಳು'}:\n${condition.symptoms.map((s: string) => `• ${s}`).join('\n')}\n\n` +
        `${language === 'en' ? 'What to do' : language === 'hi' ? 'क्या करें' : 'ಏನು ಮಾಡಬೇಕು'}: ${condition.advice}`;
    } else {
      try {
        // Try to use the AI model
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent([
          getSystemPrompt(language),
          message
        ]);
        response = result.response.text();
      } catch (error) {
        // If AI fails, use fallback response
        response = fallbackResponses[language].error;
      }
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in chat API:', error);
    const lang = (error as any)?.language || 'en';
    return NextResponse.json(
      { response: fallbackResponses[lang as 'en' | 'hi' | 'kn'].error },
      { status: 200 }
    );
  }
} 