# GrahmeenHealth

A modern healthcare platform designed to bridge the gap between healthcare providers and patients, with a special focus on rural communities.

## 🌟 Features

- **Multi-language Support**: Seamlessly switch between English, Hindi, and Kannada
- **AI-Powered Chatbot**: Intelligent medical assistant with emergency response capabilities
- **User Roles**: Separate interfaces for doctors and patients
- **Early Detection**: AI-powered health assessment tools
- **Appointment Management**: Easy scheduling and tracking of medical appointments
- **Secure Platform**: Enterprise-grade security for medical data
- **24/7 Access**: Round-the-clock access to medical records and services
- **Rural Healthcare Focus**: Specialized features for rural healthcare delivery

## 🚀 Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Authentication**: NextAuth.js
- **AI Integration**: Google Gemini AI
- **Database**: (To be implemented)
- **Deployment**: (To be implemented)

## 🛠️ Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/grahmeenhealth.git
   cd grahmeenhealth
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with the following variables:
   ```
   MONGODB_URI="mongodb://localhost:27017/"
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   GOOGLE_AI_API_KEY=your_api_key 
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   RECIPIENT_PHONE_NUMBER=required_phone_number
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Key Features in Detail

### Multi-language Support
- Seamless switching between English, Hindi, and Kannada
- Real-time translation using Google Gemini AI
- Culturally appropriate content for both languages
- Language-specific emergency keywords detection
- Automatic language detection and response

### AI-Powered Medical Chatbot
- Intelligent medical assistance
- Emergency situation detection and response
- Multi-language support for patient communication
- General chat responses for common queries
- Context-aware medical advice
- Emergency contact information and guidance
- Real-time translation of medical terms

### User Interface
- Modern, responsive design
- Intuitive navigation
- Accessibility features
- Dark mode support
- Language selection dropdown
- Real-time chat interface

### Healthcare Features
- Doctor registration and profile management
- Patient registration and medical history
- Appointment scheduling system
- Medical records management
- Emergency services integration
- Rural healthcare specific features
- Multi-language medical documentation

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines before submitting pull requests.

## 📄 License

This project is licensed under the Healthcare Standards License.

## 👥 Team

Developed by Team Access Denied

## 📞 Contact

- Email: support@grahmeenhealth.com
- Phone: +1 (555) 123-4567

## 🔜 Roadmap

- [ ] Implement real-time chat between doctors and patients
- [ ] Add video consultation feature
- [ ] Integrate with local pharmacies
- [ ] Add support for more Indian languages
- [ ] Implement offline mode for rural areas
- [ ] Add mobile app version
- [ ] Enhance emergency response system
- [ ] Add voice input support for chatbot
- [ ] Implement regional language support for medical terms

## ⚠️ Important Notes

- This is a healthcare platform, so all data handling must comply with healthcare data protection standards
- Regular security audits are performed
- All medical advice should be verified by healthcare professionals
- Emergency features are for initial response only - always contact emergency services in critical situations
- Language translations are AI-powered and should be verified by medical professionals
