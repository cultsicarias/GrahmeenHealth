'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { translations } from './utils/translations';
import HospitalMap from './components/HospitalMap';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const Home = () => {
  const [scrolled, setScrolled] = useState(false);
  const [language, setLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [showMap, setShowMap] = useState(false);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {showMap && <HospitalMap onClose={handleCloseMap} />}
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
            <div className="flex items-center space-x-4 mr-2">
              <button
                onClick={toggleLanguage}
                disabled={isTranslating}
                className="text-lg font-semibold text-cyan-200 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-cyan-500/20 flex items-center gap-2 disabled:opacity-50"
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
              <Link href="/register" className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-6 py-3 rounded-lg hover:from-cyan-500 hover:to-blue-600 transition-all shadow-lg hover:shadow-cyan-500/30">
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
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
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
        <section className="py-20 px-4 relative bg-white/10">
          <motion.div 
            className="container mx-auto"
            initial="initial"
            whileInView="animate"
            variants={fadeIn}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-center mb-12 text-white">{t.howItWorks.title}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {t.howItWorks.steps.map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-white/20 p-6 rounded-xl text-white hover:bg-white/30 transition-all"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p>{item.desc}</p>
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
              {t.benefits.items.map((item, index) => (
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
        <section className="py-20 px-4 relative bg-white/10">
          <motion.div 
            className="container mx-auto text-white"
            initial="initial"
            whileInView="animate"
            variants={fadeIn}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-center mb-12">{t.whoCanBenefit.title}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {t.whoCanBenefit.items.map((item, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-blue-100">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="bg-[#1a1a2e]/80 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">GrahmeenHealth</h3>
                <p className="text-blue-200">Developed by Team Access Denied</p>
                <p className="text-blue-200">Licensed under Healthcare Standards</p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Contact Us</h3>
                <p className="text-blue-200">Email: support@grahmeenhealth.com</p>
                <p className="text-blue-200">Phone: +1 (555) 123-4567</p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-blue-200 hover:text-white">About Us</a></li>
                  <li><a href="#" className="text-blue-200 hover:text-white">Privacy Policy</a></li>
                  <li><a href="#" className="text-blue-200 hover:text-white">Terms of Service</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-blue-200 hover:text-white">Twitter</a>
                  <a href="#" className="text-blue-200 hover:text-white">LinkedIn</a>
                  <a href="#" className="text-blue-200 hover:text-white">Facebook</a>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-blue-800/50 text-center">
              <p className="text-blue-200">© 2024 GrahmeenHealth. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
