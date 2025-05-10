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
    noInfo: "I understand you're asking about a medical concern. While I can provide general information about common conditions, it's important to consult with a healthcare professional for personalized medical advice. Could you please rephrase your question or specify which common condition you'd like to know more about?",
    greeting: "Hello! I'm your medical assistant. How can I help you today?"
  },
  hi: {
    title: 'चिकित्सा सहायक',
    placeholder: 'चिकित्सा प्रश्न पूछें...',
    disclaimer: 'नोट: यह जानकारी केवल सामान्य मार्गदर्शन के लिए है। व्यक्तिगत चिकित्सा सलाह के लिए कृपया स्वास्थ्य पेशेवर से परामर्श करें।',
    emergency: 'यह एक आपातकालीन स्थिति लगती है। कृपया तुरंत आपातकालीन सेवाओं (911) को कॉल करें या निकटतम आपातकालीन कक्ष में जाएं। यह चैटबॉट आपातकालीन चिकित्सा सहायता प्रदान नहीं कर सकता।',
    error: 'मुझे आपके अनुरोध को संसाधित करने में कठिनाई हो रही है। कृपया बाद में पुनः प्रयास करें या स्वास्थ्य पेशेवर से परामर्श करें।',
    noInfo: 'मैं समझता हूं कि आप एक चिकित्सा चिंता के बारे में पूछ रहे हैं। जबकि मैं सामान्य स्थितियों के बारे में जानकारी प्रदान कर सकता हूं, व्यक्तिगत चिकित्सा सलाह के लिए स्वास्थ्य पेशेवर से परामर्श करना महत्वपूर्ण है। क्या आप कृपया अपना प्रश्न पुनः प्रस्तुत कर सकते हैं या बताएं कि आप किस सामान्य स्थिति के बारे में अधिक जानना चाहते हैं?',
    greeting: 'नमस्ते! मैं आपका चिकित्सा सहायक हूं। मैं आपकी कैसे मदद कर सकता हूं?'
  },
  kn: {
    title: 'ವೈದ್ಯಕೀಯ ಸಹಾಯಕ',
    placeholder: 'ವೈದ್ಯಕೀಯ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ...',
    disclaimer: 'ಗಮನಿಸಿ: ಈ ಮಾಹಿತಿಯು ಸಾಮಾನ್ಯ ಮಾರ್ಗದರ್ಶನಕ್ಕಾಗಿ ಮಾತ್ರ. ವೈಯಕ್ತಿಕ ವೈದ್ಯಕೀಯ ಸಲಹೆಗಾಗಿ ದಯವಿಟ್ಟು ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.',
    emergency: 'ಇದು ತುರ್ತು ಪರಿಸ್ಥಿತಿಯಂತೆ ಕಾಣುತ್ತದೆ. ದಯವಿಟ್ಟು ತಕ್ಷಣ ತುರ್ತು ಸೇವೆಗಳನ್ನು (911) ಕರೆ ಮಾಡಿ ಅಥವಾ ಹತ್ತಿರದ ತುರ್ತು ವಿಭಾಗಕ್ಕೆ ಹೋಗಿ. ಈ ಚಾಟ್‌ಬಾಟ್ ತುರ್ತು ವೈದ್ಯಕೀಯ ಸಹಾಯವನ್ನು ನೀಡಲು ಸಾಧ್ಯವಿಲ್ಲ.',
    error: 'ನಿಮ್ಮ ವಿನಂತಿಯನ್ನು ಸಂಸ್ಕರಿಸಲು ನನಗೆ ತೊಂದರೆಯಾಗುತ್ತಿದೆ. ದಯವಿಟ್ಟು ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ ಅಥವಾ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.',
    noInfo: 'ನೀವು ವೈದ್ಯಕೀಯ ಕಾಳಜಿಯ ಬಗ್ಗೆ ಕೇಳುತ್ತಿರುವುದನ್ನು ನಾನು ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದೇನೆ. ಸಾಮಾನ್ಯ ಪರಿಸ್ಥಿತಿಗಳ ಬಗ್ಗೆ ಮಾಹಿತಿ ನೀಡಬಹುದಾದರೂ, ವೈಯಕ್ತಿಕ ವೈದ್ಯಕೀಯ ಸಲಹೆಗಾಗಿ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸುವುದು ಮುಖ್ಯ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಪುನಃ ಹೇಳಿ ಅಥವಾ ಯಾವ ಸಾಮಾನ್ಯ ಪರಿಸ್ಥಿತಿಯ ಬಗ್ಗೆ ಹೆಚ್ಚು ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ ಎಂದು ಸೂಚಿಸಿ.',
    greeting: 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ಸಹಾಯಕ. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?'
  }
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

        recognitionRef.current.onstart = () => {
          console.log('Speech recognition started');
          setIsListening(true);
        };

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          console.log('Speech recognition result:', transcript);
          setInput(transcript);
          handleSendMessage(transcript);
        };

        recognitionRef.current.onend = () => {
          console.log('Speech recognition ended');
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          
          // Show user-friendly error messages in selected language
          const errorMessages: Record<Language, Record<string, string>> = {
            en: {
              'not-allowed': 'Please allow microphone access to use voice input.',
              'permission-denied': 'Please allow microphone access to use voice input.',
              'no-speech': 'No speech was detected. Please try again.',
              'audio-capture': 'No microphone was found. Please ensure your microphone is properly connected.',
              'default': 'Error with speech recognition. Please try again.'
            },
            hi: {
              'not-allowed': 'कृपया वॉइस इनपुट के लिए माइक्रोफोन एक्सेस की अनुमति दें।',
              'permission-denied': 'कृपया वॉइस इनपुट के लिए माइक्रोफोन एक्सेस की अनुमति दें।',
              'no-speech': 'कोई भाषण नहीं मिला। कृपया पुनः प्रयास करें।',
              'audio-capture': 'कोई माइक्रोफोन नहीं मिला। कृपया सुनिश्चित करें कि आपका माइक्रोफोन सही से जुड़ा हुआ है।',
              'default': 'स्पीच रिकग्निशन में त्रुटि। कृपया पुनः प्रयास करें।'
            },
            kn: {
              'not-allowed': 'ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಬಳಸಲು ಮೈಕ್ರೊಫೋನ್ ಪ್ರವೇಶವನ್ನು ಅನುಮತಿಸಿ.',
              'permission-denied': 'ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಬಳಸಲು ಮೈಕ್ರೊಫೋನ್ ಪ್ರವೇಶವನ್ನು ಅನುಮತಿಸಿ.',
              'no-speech': 'ಯಾವುದೇ ಮಾತು ಕಂಡುಬಂದಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
              'audio-capture': 'ಯಾವುದೇ ಮೈಕ್ರೊಫೋನ್ ಕಂಡುಬಂದಿಲ್ಲ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಮೈಕ್ರೊಫೋನ್ ಸರಿಯಾಗಿ ಸಂಪರ್ಕಗೊಂಡಿದೆ ಎಂದು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.',
              'default': 'ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆಯಲ್ಲಿ ದೋಷ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.'
            }
          };

          const message = errorMessages[language][event.error as keyof typeof errorMessages[Language]] || errorMessages[language].default;
          alert(message);
        };
      } else {
        console.error('Speech recognition not supported');
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
      setMessages([{ role: 'assistant' as const, content: translations[language].greeting }]);
    }
  }, [isOpen, language]);

  const getChatGPTResponse = async (message: string, lang: Language) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, language: lang }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      return data.response;
    } catch (error) {
      console.error('Error getting ChatGPT response:', error);
      return translations[lang].error;
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

      // Get response from ChatGPT
      const response = await getChatGPTResponse(message, language);
      
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

  const toggleListening = async () => {
    try {
      if (!recognitionRef.current) {
        alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
        return;
      }

      // Check if we already have permission
      const permissions = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      
      if (permissions.state === 'denied') {
        alert('Microphone access is blocked. Please enable it in your browser settings to use voice input.');
        return;
      }

      if (permissions.state === 'prompt') {
        // Request permission explicitly
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach(track => track.stop());
        } catch (err) {
          console.error('Error requesting microphone permission:', err);
          alert('Please allow microphone access in your browser to use voice input.');
          return;
        }
      }

      if (isListening) {
        recognitionRef.current.stop();
      } else {
        recognitionRef.current.start();
      }
    } catch (error) {
      console.error('Error accessing microphone:', error);
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          alert('Microphone access was denied. Please allow microphone access in your browser settings to use voice input.');
        } else if (error.name === 'NotFoundError') {
          alert('No microphone found. Please ensure your microphone is properly connected.');
        } else {
          alert('Error accessing microphone. Please try again.');
        }
      }
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
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(input)}
                  placeholder={translations[language].placeholder}
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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