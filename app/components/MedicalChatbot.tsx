'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Language = 'en' | 'hi' | 'kn';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Translations for UI elements
const translations = {
  en: {
    title: 'Medical Assistant',
    placeholder: 'Ask a medical question...',
    disclaimer: 'Note: This information is for general guidance only. Please consult a healthcare professional for personalized medical advice.',
    emergency: 'This sounds like an emergency. Please call emergency services (911) immediately or go to the nearest emergency room. This chatbot cannot provide emergency medical assistance.',
    error: "I'm having trouble processing your request right now. Please try again later or consult a healthcare professional.",
    noInfo: "I understand you're asking about a medical concern. While I can provide general information about common conditions, it's important to consult with a healthcare professional for personalized medical advice. Could you please rephrase your question or specify which common condition you'd like to know more about?"
  },
  hi: {
    title: 'चिकित्सा सहायक',
    placeholder: 'चिकित्सा प्रश्न पूछें...',
    disclaimer: 'नोट: यह जानकारी केवल सामान्य मार्गदर्शन के लिए है। व्यक्तिगत चिकित्सा सलाह के लिए कृपया स्वास्थ्य पेशेवर से परामर्श करें।',
    emergency: 'यह एक आपातकालीन स्थिति लगती है। कृपया तुरंत आपातकालीन सेवाओं (911) को कॉल करें या निकटतम आपातकालीन कक्ष में जाएं। यह चैटबॉट आपातकालीन चिकित्सा सहायता प्रदान नहीं कर सकता।',
    error: 'मुझे आपके अनुरोध को संसाधित करने में कठिनाई हो रही है। कृपया बाद में पुनः प्रयास करें या स्वास्थ्य पेशेवर से परामर्श करें।',
    noInfo: 'मैं समझता हूं कि आप एक चिकित्सा चिंता के बारे में पूछ रहे हैं। जबकि मैं सामान्य स्थितियों के बारे में जानकारी प्रदान कर सकता हूं, व्यक्तिगत चिकित्सा सलाह के लिए स्वास्थ्य पेशेवर से परामर्श करना महत्वपूर्ण है। क्या आप कृपया अपना प्रश्न पुनः प्रस्तुत कर सकते हैं या बताएं कि आप किस सामान्य स्थिति के बारे में अधिक जानना चाहते हैं?'
  },
  kn: {
    title: 'ವೈದ್ಯಕೀಯ ಸಹಾಯಕ',
    placeholder: 'ವೈದ್ಯಕೀಯ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ...',
    disclaimer: 'ಗಮನಿಸಿ: ಈ ಮಾಹಿತಿಯು ಸಾಮಾನ್ಯ ಮಾರ್ಗದರ್ಶನಕ್ಕಾಗಿ ಮಾತ್ರ. ವೈಯಕ್ತಿಕ ವೈದ್ಯಕೀಯ ಸಲಹೆಗಾಗಿ ದಯವಿಟ್ಟು ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.',
    emergency: 'ಇದು ತುರ್ತು ಪರಿಸ್ಥಿತಿಯಂತೆ ಕಾಣುತ್ತದೆ. ದಯವಿಟ್ಟು ತಕ್ಷಣ ತುರ್ತು ಸೇವೆಗಳನ್ನು (911) ಕರೆ ಮಾಡಿ ಅಥವಾ ಹತ್ತಿರದ ತುರ್ತು ವಿಭಾಗಕ್ಕೆ ಹೋಗಿ. ಈ ಚಾಟ್‌ಬಾಟ್ ತುರ್ತು ವೈದ್ಯಕೀಯ ಸಹಾಯವನ್ನು ನೀಡಲು ಸಾಧ್ಯವಿಲ್ಲ.',
    error: 'ನಿಮ್ಮ ವಿನಂತಿಯನ್ನು ಸಂಸ್ಕರಿಸಲು ನನಗೆ ತೊಂದರೆಯಾಗುತ್ತಿದೆ. ದಯವಿಟ್ಟು ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ ಅಥವಾ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.',
    noInfo: 'ನೀವು ವೈದ್ಯಕೀಯ ಕಾಳಜಿಯ ಬಗ್ಗೆ ಕೇಳುತ್ತಿರುವುದನ್ನು ನಾನು ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದೇನೆ. ಸಾಮಾನ್ಯ ಪರಿಸ್ಥಿತಿಗಳ ಬಗ್ಗೆ ಮಾಹಿತಿ ನೀಡಬಹುದಾದರೂ, ವೈಯಕ್ತಿಕ ವೈದ್ಯಕೀಯ ಸಲಹೆಗಾಗಿ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸುವುದು ಮುಖ್ಯ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಪುನಃ ಹೇಳಿ ಅಥವಾ ಯಾವ ಸಾಮಾನ್ಯ ಪರಿಸ್ಥಿತಿಯ ಬಗ್ಗೆ ಹೆಚ್ಚು ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ ಎಂದು ಸೂಚಿಸಿ.'
  }
};

// Medical information in multiple languages
const medicalInfo = {
  en: {
    'fever': 'A fever is a temporary increase in body temperature, often due to an illness. Common symptoms include: temperature above 100.4°F (38°C), chills, sweating, headache, muscle aches, and fatigue. Treatment includes rest, staying hydrated, and over-the-counter medications like acetaminophen or ibuprofen. Seek medical attention if temperature exceeds 103°F (39.4°C) or if fever persists for more than 3 days.',
    'cold': 'The common cold is a viral infection of your nose and throat. Symptoms include: runny nose, sore throat, cough, congestion, mild body aches, and low-grade fever. Treatment includes rest, staying hydrated, over-the-counter cold medications, and using a humidifier. Most colds resolve within 7-10 days.',
    'headache': 'Headaches can be caused by various factors including stress, dehydration, lack of sleep, or underlying conditions. Common types include tension headaches and migraines. Treatment includes rest, staying hydrated, over-the-counter pain relievers, and stress management. Seek medical attention for severe or persistent headaches.',
    'cough': 'A cough is a reflex action to clear your airways. It can be caused by colds, flu, allergies, or other conditions. Treatment includes staying hydrated, using a humidifier, over-the-counter cough medicines, and honey for natural relief. Seek medical attention if cough persists for more than 2 weeks or is accompanied by blood.',
    'diabetes': 'Diabetes is a chronic condition that affects how your body processes blood sugar. Symptoms include increased thirst, frequent urination, hunger, fatigue, and blurred vision. Management includes monitoring blood sugar, maintaining a healthy diet, regular exercise, and medication as prescribed by your doctor.',
  },
  hi: {
    'fever': 'बुखार शरीर के तापमान में अस्थायी वृद्धि है, जो अक्सर बीमारी के कारण होती है। सामान्य लक्षणों में शामिल हैं: 100.4°F (38°C) से ऊपर तापमान, ठंड लगना, पसीना आना, सिरदर्द, मांसपेशियों में दर्द, और थकान। उपचार में आराम, हाइड्रेटेड रहना, और ओवर-द-काउंटर दवाएं जैसे एसिटामिनोफेन या इबुप्रोफेन शामिल हैं। यदि तापमान 103°F (39.4°C) से अधिक हो या बुखार 3 दिनों से अधिक समय तक बना रहे तो चिकित्सकीय सहायता लें।',
    'cold': 'सामान्य सर्दी आपकी नाक और गले का वायरल संक्रमण है। लक्षणों में शामिल हैं: बहती नाक, गले में खराश, खांसी, कंजेशन, हल्का शरीर दर्द, और कम-ग्रेड बुखार। उपचार में आराम, हाइड्रेटेड रहना, ओवर-द-काउंटर सर्दी की दवाएं, और ह्यूमिडिफायर का उपयोग शामिल है। अधिकांश सर्दी 7-10 दिनों के भीतर ठीक हो जाती है।',
    'headache': 'सिरदर्द विभिन्न कारकों के कारण हो सकता है जिसमें तनाव, निर्जलीकरण, नींद की कमी, या अंतर्निहित स्थितियां शामिल हैं। सामान्य प्रकारों में तनाव सिरदर्द और माइग्रेन शामिल हैं। उपचार में आराम, हाइड्रेटेड रहना, ओवर-द-काउंटर दर्द निवारक, और तनाव प्रबंधन शामिल हैं। गंभीर या लगातार सिरदर्द के लिए चिकित्सकीय सहायता लें।',
    'cough': 'खांसी आपके वायुमार्ग को साफ करने के लिए एक रिफ्लेक्स एक्शन है। यह सर्दी, फ्लू, एलर्जी, या अन्य स्थितियों के कारण हो सकती है। उपचार में हाइड्रेटेड रहना, ह्यूमिडिफायर का उपयोग, ओवर-द-काउंटर खांसी की दवाएं, और प्राकृतिक राहत के लिए शहद शामिल है। यदि खांसी 2 सप्ताह से अधिक समय तक बनी रहे या रक्त के साथ हो तो चिकित्सकीय सहायता लें।',
    'diabetes': 'मधुमेह एक पुरानी स्थिति है जो आपके शरीर के रक्त शर्करा प्रसंस्करण को प्रभावित करती है। लक्षणों में बढ़ी हुई प्यास, बार-बार पेशाब आना, भूख, थकान, और धुंधली दृष्टि शामिल हैं। प्रबंधन में रक्त शर्करा की निगरानी, स्वस्थ आहार बनाए रखना, नियमित व्यायाम, और आपके डॉक्टर द्वारा निर्धारित दवा शामिल है।',
  },
  kn: {
    'fever': 'ಜ್ವರವು ದೇಹದ ತಾಪಮಾನದಲ್ಲಿ ತಾತ್ಕಾಲಿಕ ಹೆಚ್ಚಳವಾಗಿದೆ, ಸಾಮಾನ್ಯವಾಗಿ ಅನಾರೋಗ್ಯದಿಂದ ಉಂಟಾಗುತ್ತದೆ. ಸಾಮಾನ್ಯ ಲಕ್ಷಣಗಳು: 100.4°F (38°C) ಕ್ಕಿಂತ ಹೆಚ್ಚಿನ ತಾಪಮಾನ, ನಡುಕ, ಬೆವರುವಿಕೆ, ತಲೆನೋವು, ಸ್ನಾಯು ನೋವು, ಮತ್ತು ಆಯಾಸ. ಚಿಕಿತ್ಸೆಯಲ್ಲಿ ವಿಶ್ರಾಂತಿ, ನೀರನ್ನು ಸಾಕಷ್ಟು ಕುಡಿಯುವುದು, ಮತ್ತು ಅಸೆಟಮಿನೋಫೆನ್ ಅಥವಾ ಇಬುಪ್ರೊಫೆನ್ ನಂತಹ ಔಷಧಿಗಳು ಸೇರಿವೆ. ತಾಪಮಾನ 103°F (39.4°C) ಕ್ಕಿಂತ ಹೆಚ್ಚಾದರೆ ಅಥವಾ ಜ್ವರ 3 ದಿನಗಳಿಗಿಂತ ಹೆಚ್ಚು ಕಾಲ ಇದ್ದರೆ ವೈದ್ಯಕೀಯ ಸಹಾಯ ಪಡೆಯಿರಿ.',
    'cold': 'ಸಾಮಾನ್ಯ ಜ್ವರವು ನಿಮ್ಮ ಮೂಗು ಮತ್ತು ಗಂಟಲಿನ ವೈರಲ್ ಸೋಂಕು. ಲಕ್ಷಣಗಳು: ಮೂಗು ಒಸರುತ್ತಿರುವುದು, ಗಂಟಲು ನೋವು, ಕೆಮ್ಮು, ಮೂಗು ತುಂಬಿರುವುದು, ಸೌಮ್ಯ ದೇಹ ನೋವು, ಮತ್ತು ಕಡಿಮೆ-ಮಟ್ಟದ ಜ್ವರ. ಚಿಕಿತ್ಸೆಯಲ್ಲಿ ವಿಶ್ರಾಂತಿ, ನೀರನ್ನು ಸಾಕಷ್ಟು ಕುಡಿಯುವುದು, ಔಷಧಿಗಳು, ಮತ್ತು ಆರ್ದ್ರಕಾರಿ ಬಳಸುವುದು ಸೇರಿವೆ. ಹೆಚ್ಚಿನ ಜ್ವರಗಳು 7-10 ದಿನಗಳಲ್ಲಿ ಗುಣವಾಗುತ್ತವೆ.',
    'headache': 'ತಲೆನೋವು ಒತ್ತಡ, ನಿರ್ಜಲೀಕರಣ, ನಿದ್ರೆಯ ಕೊರತೆ, ಅಥವಾ ಮೂಲ ಸ್ಥಿತಿಗಳಿಂದ ಉಂಟಾಗಬಹುದು. ಸಾಮಾನ್ಯ ವಿಧಗಳು: ಒತ್ತಡ ತಲೆನೋವು ಮತ್ತು ಮೈಗ್ರೇನ್. ಚಿಕಿತ್ಸೆಯಲ್ಲಿ ವಿಶ್ರಾಂತಿ, ನೀರನ್ನು ಸಾಕಷ್ಟು ಕುಡಿಯುವುದು, ನೋವು ನಿವಾರಕಗಳು, ಮತ್ತು ಒತ್ತಡ ನಿರ್ವಹಣೆ ಸೇರಿವೆ. ತೀವ್ರ ಅಥವಾ ನಿರಂತರ ತಲೆನೋವಿಗೆ ವೈದ್ಯಕೀಯ ಸಹಾಯ ಪಡೆಯಿರಿ.',
    'cough': 'ಕೆಮ್ಮು ನಿಮ್ಮ ಉಸಿರಾಟದ ಮಾರ್ಗಗಳನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಲು ಪ್ರತಿಕ್ರಿಯೆಯಾಗಿದೆ. ಜ್ವರ, ಫ್ಲೂ, ಅಲರ್ಜಿ, ಅಥವಾ ಇತರ ಸ್ಥಿತಿಗಳಿಂದ ಉಂಟಾಗಬಹುದು. ಚಿಕಿತ್ಸೆಯಲ್ಲಿ ನೀರನ್ನು ಸಾಕಷ್ಟು ಕುಡಿಯುವುದು, ಆರ್ದ್ರಕಾರಿ ಬಳಸುವುದು, ಕೆಮ್ಮು ಔಷಧಿಗಳು, ಮತ್ತು ನೈಸರ್ಗಿಕ ಪರಿಹಾರಕ್ಕಾಗಿ ಜೇನುತುಪ್ಪ ಸೇರಿವೆ. ಕೆಮ್ಮು 2 ವಾರಗಳಿಗಿಂತ ಹೆಚ್ಚು ಕಾಲ ಇದ್ದರೆ ಅಥವಾ ರಕ್ತದೊಂದಿಗೆ ಬಂದರೆ ವೈದ್ಯಕೀಯ ಸಹಾಯ ಪಡೆಯಿರಿ.',
    'diabetes': 'ಮಧುಮೇಹವು ನಿಮ್ಮ ದೇಹದ ರಕ್ತ ಸಕ್ಕರೆ ಸಂಸ್ಕರಣೆಯನ್ನು ಪರಿಣಾಮ ಬೀರುವ ದೀರ್ಘಕಾಲಿಕ ಸ್ಥಿತಿ. ಲಕ್ಷಣಗಳು: ಹೆಚ್ಚಿದ ಬಾಯಾರಿಕೆ, ಆಗಾಗ್ಗೆ ಮೂತ್ರ ವಿಸರ್ಜನೆ, ಹಸಿವು, ಆಯಾಸ, ಮತ್ತು ಮಸುಕಾದ ದೃಷ್ಟಿ. ನಿರ್ವಹಣೆಯಲ್ಲಿ ರಕ್ತ ಸಕ್ಕರೆ ಮೇಲ್ವಿಚಾರಣೆ, ಆರೋಗ್ಯಕರ ಆಹಾರ, ನಿಯಮಿತ ವ್ಯಾಯಾಮ, ಮತ್ತು ವೈದ್ಯರಿಂದ ನಿರ್ದೇಶಿಸಿದ ಔಷಧಿಗಳು ಸೇರಿವೆ.',
  }
};

// Add general conversation responses
const generalResponses = {
  en: {
    greeting: "Hello! I'm your medical assistant. How can I help you today?",
    thanks: "You're welcome! Is there anything else you'd like to know?",
    goodbye: "Take care! Feel free to chat again if you have any medical questions.",
    notUnderstood: "I'm not sure I understand. Could you please rephrase your question or ask about a specific medical condition?",
    general: [
      "I'm here to help with your medical questions. What would you like to know?",
      "Feel free to ask me about common medical conditions and their symptoms.",
      "I can provide information about various health topics. What interests you?",
      "I'm designed to help with medical information. How can I assist you today?"
    ]
  },
  hi: {
    greeting: "नमस्ते! मैं आपका चिकित्सा सहायक हूं। मैं आपकी कैसे मदद कर सकता हूं?",
    thanks: "आपका स्वागत है! क्या आप कुछ और जानना चाहेंगे?",
    goodbye: "अपना ख्याल रखें! अगर आपके कोई चिकित्सा प्रश्न हों तो फिर से चैट करें।",
    notUnderstood: "मुझे यकीन नहीं है कि मैं समझ पाया। क्या आप कृपया अपना प्रश्न दोबारा पूछ सकते हैं या किसी विशेष चिकित्सा स्थिति के बारे में पूछ सकते हैं?",
    general: [
      "मैं आपके चिकित्सा प्रश्नों में मदद करने के लिए यहां हूं। आप क्या जानना चाहेंगे?",
      "आप मुझसे सामान्य चिकित्सा स्थितियों और उनके लक्षणों के बारे में पूछ सकते हैं।",
      "मैं विभिन्न स्वास्थ्य विषयों के बारे में जानकारी प्रदान कर सकता हूं। आपकी क्या रुचि है?",
      "मैं चिकित्सा जानकारी में मदद करने के लिए डिज़ाइन किया गया हूं। मैं आपकी आज कैसे सहायता कर सकता हूं?"
    ]
  },
  kn: {
    greeting: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ಸಹಾಯಕ. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
    thanks: "ಸ್ವಾಗತ! ನೀವು ಬೇರೆ ಏನಾದರೂ ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಾ?",
    goodbye: "ಜಾಗರೂಕರಾಗಿರಿ! ನಿಮಗೆ ಯಾವುದೇ ವೈದ್ಯಕೀಯ ಪ್ರಶ್ನೆಗಳಿದ್ದರೆ ಮತ್ತೆ ಚಾಟ್ ಮಾಡಿ.",
    notUnderstood: "ನಾನು ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದೇನೆ ಎಂದು ಖಚಿತವಿಲ್ಲ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಪುನಃ ಹೇಳಿ ಅಥವಾ ನಿರ್ದಿಷ್ಟ ವೈದ್ಯಕೀಯ ಸ್ಥಿತಿಯ ಬಗ್ಗೆ ಕೇಳಿ.",
    general: [
      "ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ಪ್ರಶ್ನೆಗಳಿಗೆ ಸಹಾಯ ಮಾಡಲು ನಾನು ಇಲ್ಲಿದ್ದೇನೆ. ನೀವು ಏನು ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ?",
      "ಸಾಮಾನ್ಯ ವೈದ್ಯಕೀಯ ಪರಿಸ್ಥಿತಿಗಳು ಮತ್ತು ಅವುಗಳ ಲಕ್ಷಣಗಳ ಬಗ್ಗೆ ನನ್ನನ್ನು ಕೇಳಲು ಹಿಂಜರಿಯಬೇಡಿ.",
      "ನಾನು ವಿವಿಧ ಆರೋಗ್ಯ ವಿಷಯಗಳ ಬಗ್ಗೆ ಮಾಹಿತಿ ನೀಡಬಹುದು. ನಿಮಗೆ ಆಸಕ್ತಿ ಇರುವುದು ಏನು?",
      "ವೈದ್ಯಕೀಯ ಮಾಹಿತಿಯಲ್ಲಿ ಸಹಾಯ ಮಾಡಲು ನಾನು ವಿನ್ಯಾಸಗೊಳಿಸಲಾಗಿದೆ. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?"
    ]
  }
};

// Add greeting patterns
const greetingPatterns = {
  en: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'],
  hi: ['नमस्ते', 'हैलो', 'हाय', 'नमस्कार', 'शुभ प्रभात', 'शुभ दोपहर', 'शुभ संध्या'],
  kn: ['ನಮಸ್ಕಾರ', 'ಹಲೋ', 'ಹಾಯ್', 'ಶುಭ ಮುಂಜಾನೆ', 'ಶುಭ ಮಧ್ಯಾಹ್ನ', 'ಶುಭ ಸಂಜೆ']
};

// Add farewell patterns
const farewellPatterns = {
  en: ['bye', 'goodbye', 'see you', 'thank you', 'thanks'],
  hi: ['अलविदा', 'नमस्ते', 'धन्यवाद', 'शुक्रिया'],
  kn: ['ಬೈ', 'ವಿದಾಯ', 'ಧನ್ಯವಾದಗಳು', 'ನಮಸ್ಕಾರ']
};

// Add type declarations for the Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
  interpretation: any;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: Event) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

const MedicalChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = language === 'en' ? 'en-US' : language === 'hi' ? 'hi-IN' : 'kn-IN';

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          handleSendMessage(transcript);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add initial greeting when chat is opened
    if (isOpen && messages.length === 0) {
      setMessages([{ role: 'assistant' as const, content: generalResponses[language].greeting }]);
    }
  }, [isOpen, language]);

  const isGreeting = (message: string) => {
    return greetingPatterns[language].some(pattern => 
      message.toLowerCase().includes(pattern.toLowerCase())
    );
  };

  const isFarewell = (message: string) => {
    return farewellPatterns[language].some(pattern => 
      message.toLowerCase().includes(pattern.toLowerCase())
    );
  };

  const getRandomResponse = (responses: string[]) => {
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const getMedicalInfo = async (query: string) => {
    try {
      const lowerQuery = query.toLowerCase();
      
      // Check for exact matches first
      for (const [condition, info] of Object.entries(medicalInfo[language])) {
        if (lowerQuery.includes(condition)) {
          return info;
        }
      }

      // If no exact match, try to find partial matches
      for (const [condition, info] of Object.entries(medicalInfo[language])) {
        if (condition.includes(lowerQuery) || lowerQuery.includes(condition)) {
          return info;
        }
      }

      // If no matches found, try web search as fallback
      try {
        const response = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query + ' medical information')}&format=json`);
        const data = await response.json();
        
        if (data.Abstract) {
          return data.Abstract;
        } else if (data.RelatedTopics && data.RelatedTopics.length > 0) {
          return data.RelatedTopics[0].Text;
        }
      } catch (webError) {
        console.error('Web search error:', webError);
      }

      return translations[language].noInfo;
    } catch (error) {
      console.error('Error fetching medical information:', error);
      return translations[language].error;
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const newMessages = [...messages, { role: 'user' as const, content: message }];
    setMessages(newMessages);
    setInput('');
    setIsProcessing(true);

    try {
      // Check for emergency keywords
      const emergencyKeywords = {
        en: ['emergency', 'urgent', 'severe', 'critical', '911', 'ambulance'],
        hi: ['आपातकाल', 'तत्काल', 'गंभीर', 'आपात', '911', 'एम्बुलेंस'],
        kn: ['ತುರ್ತು', 'ತುರ್ತು ಪರಿಸ್ಥಿತಿ', 'ಗಂಭೀರ', 'ಆಪತ್ತು', '911', 'ಆಂಬುಲೆನ್ಸ್']
      };

      const isEmergency = emergencyKeywords[language].some(keyword => 
        message.toLowerCase().includes(keyword)
      );

      if (isEmergency) {
        setMessages([
          ...newMessages,
          { role: 'assistant' as const, content: translations[language].emergency }
        ]);
        return;
      }

      // Handle greetings
      if (isGreeting(message)) {
        setMessages([
          ...newMessages,
          { role: 'assistant' as const, content: generalResponses[language].greeting }
        ]);
        return;
      }

      // Handle farewells
      if (isFarewell(message)) {
        setMessages([
          ...newMessages,
          { role: 'assistant' as const, content: generalResponses[language].goodbye }
        ]);
        return;
      }

      // Get medical information
      const response = await getMedicalInfo(message);
      
      // If no specific medical information was found, provide a general response
      if (response === translations[language].noInfo) {
        setMessages([
          ...newMessages,
          { 
            role: 'assistant' as const, 
            content: getRandomResponse(generalResponses[language].general) 
          }
        ]);
        return;
      }

      setMessages([
        ...newMessages,
        { role: 'assistant' as const, content: response + '\n\n' + translations[language].disclaimer }
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages([
        ...newMessages,
        { role: 'assistant' as const, content: translations[language].error }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-white rounded-lg shadow-xl w-96 h-[600px] flex flex-col mb-4"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-t-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-white font-semibold">{translations[language].title}</h3>
                <div className="flex items-center space-x-2">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as Language)}
                    className="bg-white text-gray-800 rounded px-2 py-1 text-sm"
                  >
                    <option value="en">English</option>
                    <option value="hi">हिंदी</option>
                    <option value="kn">ಕನ್ನಡ</option>
                  </select>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:text-gray-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))}
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 rounded-lg p-3 text-gray-800">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(input)}
                  placeholder={translations[language].placeholder}
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={toggleListening}
                  className={`p-2 rounded-lg ${
                    isListening
                      ? 'bg-red-500 text-white'
                      : 'bg-blue-500 text-white'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleSendMessage(input)}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </motion.button>
    </div>
  );
};

export default MedicalChatbot; 