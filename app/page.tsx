'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { translations } from './utils/translations';
import HospitalMap from './components/HospitalMap';

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
  transition: { duration: 0.5 }
};

const Home = () => {
  const [scrolled, setScrolled] = useState(false);
<<<<<<< HEAD
  const [language, setLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [showMap, setShowMap] = useState(false);
=======
  const [language, setLanguage] = useState<Language>('en');
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const t = translations[language];
>>>>>>> 519bb0680142eadb3eda93ee3c1f1715fb4f039f

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLanguage(prev => {
      switch(prev) {
        case 'en': return 'hi';
        case 'hi': return 'kn';
        default: return 'en';
      }
    });
  };

  const handleEmergencyClick = () => {
    setShowEmergencyModal(true);
    // Auto-hide modal after 5 seconds
    setTimeout(() => setShowEmergencyModal(false), 5000);
  };

  const handleCloseMap = () => {
    setShowMap(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
<<<<<<< HEAD
      {showMap && <HospitalMap onClose={handleCloseMap} />}
=======
      {/* SOS Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-8 right-8 z-50"
      >
        <button
          onClick={handleEmergencyClick}
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
              </div>
              <div className="space-y-4">
                <a
                  href="tel:108"
                  className="flex items-center justify-center w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Emergency (108)
                </a>
                <a
                  href="tel:102"
                  className="flex items-center justify-center w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Ambulance (102)
                </a>
                <button
                  onClick={() => setShowEmergencyModal(false)}
                  className="flex items-center justify-center w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

>>>>>>> 519bb0680142eadb3eda93ee3c1f1715fb4f039f
      <div className="relative z-10">
        {/* Background Image */}
        <div className="fixed inset-0 z-0">
          <Image
            src="https://scitechdaily.com/images/Electrocardiogram-ECG.gif"
            alt="ECG Background"
            fill
            className="object-cover scale-150"
            priority
            quality={100}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 to-blue-800/80"></div>
        </div>

        {/* Header */}
        <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-[#6085FF]/90 shadow-md py-3' : 'bg-[#6085FF]/75 py-6'
        }`}>
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-200 via-cyan-100 to-white bg-clip-text text-transparent drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)] hover:from-cyan-100 hover:via-white hover:to-cyan-50 transition-all duration-300 [text-shadow:_0_0_10px_rgba(165,243,252,0.6),_0_0_20px_rgba(165,243,252,0.4),_0_0_30px_rgba(165,243,252,0.3)] hover:[text-shadow:_0_0_15px_rgba(165,243,252,0.7),_0_0_25px_rgba(165,243,252,0.5),_0_0_35px_rgba(165,243,252,0.4)]">
                GrahmeenHealth
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleLanguage}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                {language === 'en' ? 'हिंदी' : language === 'hi' ? 'ಕನ್ನಡ' : 'English'}
              </button>
<<<<<<< HEAD
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
=======
              <Link
                href="/login"
                className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
>>>>>>> 519bb0680142eadb3eda93ee3c1f1715fb4f039f
                Login
              </Link>
              <Link
                href="/register"
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:from-cyan-500 hover:to-blue-600 transition-all shadow-lg hover:shadow-cyan-500/30"
              >
                Register
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 relative">
          <motion.div 
            className="container mx-auto text-center"
            initial="initial"
            animate="animate"
            variants={fadeIn}
          >
            <div className="flex justify-center mb-8">
              <div className="relative w-[120px] h-[120px]">
                <Image
                  src="https://cdn-icons-png.flaticon.com/512/8841/8841503.png"
                  alt="AI Healthcare"
                  fill
                  className="animate-float"
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 text-transparent bg-clip-text">
              {t.hero.title}
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-blue-100">
              {t.hero.subtitle}
            </p>
            
            {/* Doctor/Patient Options */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-full sm:w-auto"
              >
                <Link
                  href="/register?role=doctor"
                  className="group flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition-all text-xl font-semibold"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t.hero.doctorButton}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-full sm:w-auto"
              >
                <Link
                  href="/register?role=patient"
                  className="group flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all text-xl font-semibold"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  {t.hero.patientButton}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* How it Works Section */}
        <section className="py-20 px-4 relative">
          <motion.div 
            className="container mx-auto"
            initial="initial"
            whileInView="animate"
            variants={fadeIn}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-center mb-12 text-white">{t.howItWorks.title}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {t.howItWorks.steps.map((step: Step, index: number) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-6 rounded-xl text-white"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-4xl font-bold mb-4 text-blue-200">{index + 1}</div>
                  <h3 className="text-xl font-bold mb-2 text-blue-200">{step.title}</h3>
                  <p className="text-blue-100">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-4 relative">
          <motion.div 
            className="container mx-auto"
            initial="initial"
            whileInView="animate"
            variants={fadeIn}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-center mb-12 text-white">{t.benefits.title}</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {t.benefits.items.map((item: Benefit, index: number) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-6 rounded-xl text-white"
                  whileHover={{ scale: 1.02 }}
                >
                  <h3 className="text-xl font-bold mb-2 text-blue-200">{item.title}</h3>
                  <p className="text-blue-100">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* For Whom Section */}
        <section className="py-20 px-4 relative">
          <motion.div 
            className="container mx-auto"
            initial="initial"
            whileInView="animate"
            variants={fadeIn}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-center mb-12 text-white">{t.whoCanBenefit.title}</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {t.whoCanBenefit.items.map((item: Group, index: number) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-6 rounded-xl text-white"
                  whileHover={{ scale: 1.02 }}
                >
                  <h3 className="text-xl font-bold mb-2 text-blue-200">{item.title}</h3>
                  <p className="text-blue-100">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 relative">
          <div className="container mx-auto text-center text-blue-100">
            <p>© 2024 GrahmeenHealth. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
