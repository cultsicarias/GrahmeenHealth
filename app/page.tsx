'use client';
//Changed UI
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { translations } from './utils/translations';
import HospitalMap from './components/HospitalMap';
import { FaUserMd, FaUserInjured, FaHeartbeat, FaAmbulance, FaHospital, FaStethoscope, FaCalendarAlt, FaFileMedical, FaBell, FaQuestionCircle } from 'react-icons/fa';
import { MdHealthAndSafety, MdLocalHospital, MdEmergency } from 'react-icons/md';
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-playfair',
  display: 'swap',
});

type Language = 'en' | 'hi' | 'kn';

interface Step {
  title: string;
  desc: string;
  icon: string;
}

interface Benefit {
  title: string;
  desc: string;
}

interface Group {
  title: string;
  desc: string;
  icon: string;
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Home = () => {
  const [scrolled, setScrolled] = useState(false);
  const [language, setLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [callType, setCallType] = useState<'emergency' | 'ambulance' | null>(null);
  const [callStatus, setCallStatus] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    setIsTranslating(true);
    const newLang = language === 'en' ? 'hi' : language === 'hi' ? 'kn' : 'en';
    setLanguage(newLang);
    setIsTranslating(false);
  };

  const t = translations[language as keyof typeof translations];

  const handleCloseMap = () => {
    setShowMap(false);
  };

  const handleEmergencyCall = (type: 'emergency' | 'ambulance') => {
    if (window.confirm(`Are you sure you want to call ${type === 'emergency' ? 'Emergency Services (108)' : 'Ambulance Services (102)'}?`)) {
      setIsCalling(true);
      setCallType(type);
      setCallStatus('Connecting...');
      
      // Simulate call connection
      setTimeout(() => {
        setCallStatus('Connected');
        // Here you would typically integrate with a real calling service
        // For now, we'll just simulate the call
        const number = type === 'emergency' ? '108' : '102';
        window.location.href = `tel:${number}`;
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {showMap && <HospitalMap onClose={handleCloseMap} />}
      
      {/* Background GIF */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0">
          <Image
            src="https://i.imgflip.com/9tg7b1.gif"
            alt="Medical Technology Background"
            fill
            className="object-cover"
            priority
            quality={100}
            unoptimized
          />
        </div>
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
      </div>

      {/* SOS Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-8 right-8 z-50"
      >
        <button
          onClick={() => setShowEmergencyModal(true)}
          className="group relative flex items-center justify-center w-16 h-16 bg-red-600 rounded-full shadow-lg hover:shadow-red-500/50 transition-all duration-300 hover:scale-110"
        >
          <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></div>
          <span className="text-white text-xl font-bold">SOS</span>
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
        </button>
      </motion.div>

      {/* Emergency Modal */}
      <AnimatePresence>
        {showEmergencyModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          >
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Emergency Contact</h3>
                <p className="text-gray-600 mb-4">Please contact emergency services immediately</p>
                {isCalling && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                      <span className="text-blue-600 font-medium">{callStatus}</span>
                    </div>
                    {callType && (
                      <p className="text-sm text-blue-600 mt-2">
                        Calling {callType === 'emergency' ? 'Emergency Services (108)' : 'Ambulance Services (102)'}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <button
                  onClick={() => handleEmergencyCall('emergency')}
                  disabled={isCalling}
                  className="flex items-center justify-center w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Emergency (108)
                </button>
                <button
                  onClick={() => handleEmergencyCall('ambulance')}
                  disabled={isCalling}
                  className="flex items-center justify-center w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Ambulance (102)
                </button>
                <button
                  onClick={() => {
                    setShowEmergencyModal(false);
                    setIsCalling(false);
                    setCallType(null);
                    setCallStatus('');
                  }}
                  className="flex items-center justify-center w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10">
        {/* Header */}
        <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-[#6085FF]/90 shadow-md py-3' : 'bg-[#6085FF]/75 py-6'
        }`}>
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center">
              <span className={`text-3xl md:text-4xl font-black bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)] hover:from-cyan-200 hover:via-blue-200 hover:to-white transition-all duration-300 ${playfair.className}`}>
                GrahmeenHealth
              </span>
            </div>
            <div className="flex items-center space-x-4 mr-2">
              <button
                onClick={toggleLanguage}
                disabled={isTranslating}
                className="text-lg font-semibold text-white hover:text-cyan-200 transition-colors px-4 py-2 rounded-lg hover:bg-white/10 flex items-center gap-2 disabled:opacity-50"
              >
                {isTranslating ? (
                  <span className="animate-spin">⟳</span>
                ) : (
                  <>
                    {language === 'en' ? 'हिंदी' : language === 'hi' ? 'ಕನ್ನಡ' : 'English'}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </>
                )}
              </button>
              <button
                onClick={() => setShowMap(true)}
                className="text-lg font-semibold bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-3 rounded-lg hover:from-green-500 hover:to-emerald-600 transition-all shadow-lg hover:shadow-green-500/30 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Find Hospitals
              </button>
              <Link href="/login" className="text-lg font-semibold text-cyan-200 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-cyan-500/20">
                Login
              </Link>
              <Link
                href="/register"
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-rose-500/30 text-sm font-medium"
              >
                Register
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 relative">
          <motion.div 
            className="container mx-auto text-center max-w-4xl"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            {/* Floating Medical Icons */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                className="absolute top-20 left-10"
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <FaStethoscope className="w-8 h-8 text-cyan-300/30" />
              </motion.div>
              <motion.div
                className="absolute top-40 right-20"
                animate={{ 
                  y: [0, 20, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <FaHospital className="w-8 h-8 text-blue-300/30" />
              </motion.div>
              <motion.div
                className="absolute bottom-20 left-20"
                animate={{ 
                  y: [0, -15, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ 
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <FaAmbulance className="w-8 h-8 text-purple-300/30" />
              </motion.div>
            </div>

            <motion.div 
              className="flex justify-center mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <div className="relative w-[120px] h-[120px]">
                <Image
                  src="https://cdn-icons-png.flaticon.com/512/8841/8841503.png"
                  alt="AI Healthcare"
                  fill
                  className="animate-float"
                  style={{ objectFit: 'contain' }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full bg-cyan-500/20 blur-xl"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-200 to-blue-200 text-transparent bg-clip-text drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)] leading-tight"
              variants={fadeIn}
            >
              {t.hero.title}
            </motion.h1>

            {/* Animated Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-8 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl font-bold text-cyan-300 mb-2">24/7</div>
                <div className="text-white/80">Support</div>
              </motion.div>
              <motion.div
                className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl font-bold text-blue-300 mb-2">100+</div>
                <div className="text-white/80">Doctors</div>
              </motion.div>
              <motion.div
                className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl font-bold text-purple-300 mb-2">50K+</div>
                <div className="text-white/80">Patients</div>
              </motion.div>
            </motion.div>

            <motion.div
              className="relative mb-12"
              variants={fadeIn}
            >
              <motion.p 
                className="text-xl md:text-2xl lg:text-3xl mb-4 text-white font-semibold max-w-3xl mx-auto leading-relaxed drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]"
              >
                Experience the future of healthcare management
              </motion.p>
              <motion.div 
                className="flex justify-center items-center gap-4 mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></div>
                  <span className="text-sm text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">Real-time Monitoring</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse"></div>
                  <span className="text-sm text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">AI-Powered Insights</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></div>
                  <span className="text-sm text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">24/7 Support</span>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Doctor/Patient Options with Enhanced Animation */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Link
                  href="/register?role=doctor"
                  className="group flex items-center justify-center bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-rose-500/30 transition-all text-lg font-semibold relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-rose-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={false}
                    whileHover={{ scale: 1.1 }}
                  />
                  <FaUserMd className="h-6 w-6 mr-3 animate-pulse relative z-10" />
                  <span className="relative z-10">{t.hero.doctorButton}</span>
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Link
                  href="/register?role=patient"
                  className="group flex items-center justify-center bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-pink-500/30 transition-all text-lg font-semibold relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-pink-600 to-fuchsia-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={false}
                    whileHover={{ scale: 1.1 }}
                  />
                  <FaUserInjured className="h-6 w-6 mr-3 animate-pulse relative z-10" />
                  <span className="relative z-10">{t.hero.patientButton}</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* How it Works Section */}
        <section className="py-20 px-4 relative bg-white/10">
          <motion.div 
            className="container mx-auto max-w-6xl"
            initial="initial"
            whileInView="animate"
            variants={staggerContainer}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-center mb-12 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]"
              variants={fadeIn}
            >
              {t.howItWorks.title}
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              {t.howItWorks.steps.map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-white shadow-lg border border-white/20 hover:border-cyan-200/50 transition-all"
                  whileHover={{ scale: 1.02, y: -5 }}
                  variants={fadeIn}
                >
                  <div className="flex items-center mb-4">
                    <div className="text-3xl font-bold text-cyan-300 mr-3">{index + 1}</div>
                    <FaHeartbeat className="h-8 w-8 text-cyan-300 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">{item.title}</h3>
                  <p className="text-cyan-100 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-4 relative">
          <motion.div 
            className="container mx-auto max-w-6xl"
            initial="initial"
            whileInView="animate"
            variants={staggerContainer}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-center mb-12 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]"
              variants={fadeIn}
            >
              {t.benefits.title}
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-8">
              {t.benefits.items.map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-white shadow-lg border border-white/20 hover:border-cyan-200/50 transition-all"
                  whileHover={{ scale: 1.02, y: -5 }}
                  variants={fadeIn}
                >
                  <div className="flex items-center mb-4">
                    <MdHealthAndSafety className="h-8 w-8 text-cyan-300 mr-3 animate-pulse" />
                    <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  </div>
                  <p className="text-cyan-100 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* For Whom Section */}
        <section className="py-20 px-4 relative bg-white/10">
          <motion.div 
            className="container mx-auto max-w-6xl"
            initial="initial"
            whileInView="animate"
            variants={staggerContainer}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-center mb-12 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]"
              variants={fadeIn}
            >
              {t.whoCanBenefit.title}
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-8">
              {t.whoCanBenefit.items.map((item: Group, index: number) => (
                <motion.div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-white shadow-lg border border-white/20 hover:border-cyan-200/50 transition-all"
                  whileHover={{ scale: 1.02, y: -5 }}
                  variants={fadeIn}
                >
                  <div className="flex items-center mb-4">
                    <MdLocalHospital className="h-8 w-8 text-cyan-300 mr-3 animate-pulse" />
                    <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  </div>
                  <p className="text-cyan-100 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Statistics Section */}
        <section className="py-20 px-4 relative">
          <motion.div 
            className="container mx-auto max-w-6xl"
            initial="initial"
            whileInView="animate"
            variants={staggerContainer}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-center mb-12 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]"
              variants={fadeIn}
            >
              Our Impact in Numbers
            </motion.h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <motion.div
                className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-center shadow-lg border border-white/20 hover:border-cyan-200/50 transition-all"
                whileHover={{ scale: 1.05 }}
                variants={fadeIn}
              >
                <div className="text-4xl font-bold text-cyan-300 mb-2">50K+</div>
                <div className="text-white">Patients Served</div>
              </motion.div>
              <motion.div
                className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-center shadow-lg border border-white/20 hover:border-cyan-200/50 transition-all"
                whileHover={{ scale: 1.05 }}
                variants={fadeIn}
              >
                <div className="text-4xl font-bold text-cyan-300 mb-2">1000+</div>
                <div className="text-white">Healthcare Providers</div>
              </motion.div>
              <motion.div
                className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-center shadow-lg border border-white/20 hover:border-cyan-200/50 transition-all"
                whileHover={{ scale: 1.05 }}
                variants={fadeIn}
              >
                <div className="text-4xl font-bold text-cyan-300 mb-2">24/7</div>
                <div className="text-white">Support Available</div>
              </motion.div>
              <motion.div
                className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-center shadow-lg border border-white/20 hover:border-cyan-200/50 transition-all"
                whileHover={{ scale: 1.05 }}
                variants={fadeIn}
              >
                <div className="text-4xl font-bold text-cyan-300 mb-2">98%</div>
                <div className="text-white">Satisfaction Rate</div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-4 relative">
          <motion.div 
            className="container mx-auto max-w-6xl"
            initial="initial"
            whileInView="animate"
            variants={staggerContainer}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-center mb-12 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]"
              variants={fadeIn}
            >
              What Our Users Say
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20 hover:border-cyan-200/50 transition-all"
                whileHover={{ scale: 1.02, y: -5 }}
                variants={fadeIn}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-cyan-300/20 rounded-full flex items-center justify-center text-cyan-300 font-bold text-xl">JD</div>
                  <div className="ml-4">
                    <div className="font-semibold text-white">Dr. John Doe</div>
                    <div className="text-sm text-cyan-200">Cardiologist</div>
                  </div>
                </div>
                <p className="text-cyan-100 italic">"GrahmeenHealth has revolutionized how I connect with my patients. The platform is intuitive and efficient."</p>
              </motion.div>
              <motion.div
                className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20 hover:border-cyan-200/50 transition-all"
                whileHover={{ scale: 1.02, y: -5 }}
                variants={fadeIn}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-cyan-300/20 rounded-full flex items-center justify-center text-cyan-300 font-bold text-xl">SP</div>
                  <div className="ml-4">
                    <div className="font-semibold text-white">Sarah Patel</div>
                    <div className="text-sm text-cyan-200">Patient</div>
                  </div>
                </div>
                <p className="text-cyan-100 italic">"Getting medical advice has never been easier. The 24/7 support is a game-changer for rural healthcare."</p>
              </motion.div>
              <motion.div
                className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20 hover:border-cyan-200/50 transition-all"
                whileHover={{ scale: 1.02, y: -5 }}
                variants={fadeIn}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-cyan-300/20 rounded-full flex items-center justify-center text-cyan-300 font-bold text-xl">RK</div>
                  <div className="ml-4">
                    <div className="font-semibold text-white">Rajesh Kumar</div>
                    <div className="text-sm text-cyan-200">Healthcare Provider</div>
                  </div>
                </div>
                <p className="text-cyan-100 italic">"The AI-powered insights help us provide better care. It's like having a medical assistant at your fingertips."</p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Latest Updates Section */}
        <section className="py-20 px-4 relative">
          <motion.div 
            className="container mx-auto max-w-6xl"
            initial="initial"
            whileInView="animate"
            variants={staggerContainer}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-center mb-12 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]"
              variants={fadeIn}
            >
              Latest Updates
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20 hover:border-cyan-200/50 transition-all"
                whileHover={{ scale: 1.02, y: -5 }}
                variants={fadeIn}
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-cyan-300/20 rounded-full flex items-center justify-center text-cyan-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-white">New AI Features</div>
                    <div className="text-sm text-cyan-200">2 days ago</div>
                  </div>
                </div>
                <p className="text-cyan-100">Enhanced AI diagnostics and predictive analytics now available for all healthcare providers.</p>
              </motion.div>
              <motion.div
                className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20 hover:border-cyan-200/50 transition-all"
                whileHover={{ scale: 1.02, y: -5 }}
                variants={fadeIn}
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-cyan-300/20 rounded-full flex items-center justify-center text-cyan-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-white">Extended Support Hours</div>
                    <div className="text-sm text-cyan-200">1 week ago</div>
                  </div>
                </div>
                <p className="text-cyan-100">Our support team is now available 24/7 to assist with any medical emergencies or queries.</p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <motion.footer 
          className="py-8 px-4 relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto text-center text-cyan-200">
            <p>© 2024 GrahmeenHealth. All rights reserved.</p>
          </div>
        </motion.footer>
      </div>
    </div>
  );
};

export default Home;


