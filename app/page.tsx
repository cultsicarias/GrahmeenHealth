'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { translations } from './utils/translations';
import { FaUserMd, FaUserInjured, FaHeartbeat, FaAmbulance, FaHospital, FaStethoscope } from 'react-icons/fa';
import { MdHealthAndSafety, MdLocalHospital, MdEmergency } from 'react-icons/md';

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

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Home = () => {
  const [scrolled, setScrolled] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const t = translations[language];

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-400 via-yellow-400 via-green-400 via-blue-400 via-purple-400 to-pink-400 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-red-400 via-yellow-400 via-green-400 via-blue-400 via-purple-400 to-pink-400"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.2),rgba(255,255,255,0))]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(255,255,255,0.2),rgba(255,255,255,0))]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.2),rgba(255,255,255,0))]"></div>
      </div>

      {/* Animated Floating Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-red-400/30 via-yellow-400/30 to-green-400/30 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            top: '10%',
            left: '10%',
          }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-green-400/30 via-blue-400/30 to-purple-400/30 blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            top: '60%',
            right: '10%',
          }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-purple-400/30 via-pink-400/30 to-red-400/30 blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            bottom: '10%',
            left: '30%',
          }}
        />
      </div>

      {/* Animated Heartline Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full opacity-30"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <path
            className="animate-heartline"
            d="M0,50 Q10,40 20,50 T40,50 T60,50 T80,50 T100,50"
            fill="none"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1"
          />
          <path
            className="animate-heartline-delayed"
            d="M0,50 Q10,40 20,50 T40,50 T60,50 T80,50 T100,50"
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1"
          />
        </svg>
        <div className="absolute inset-0 bg-gradient-to-br from-red-400/90 via-yellow-400/90 via-green-400/90 via-blue-400/90 via-purple-400/90 to-pink-400/90 backdrop-blur-sm"></div>
      </div>

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

      <div className="relative z-10">
        {/* Background Image */}
        <div className="fixed inset-0 z-0">
          <Image
            src="https://scitechdaily.com/images/Electrocardiogram-ECG.gif"
            alt="ECG Background"
            fill
            className="object-cover scale-150 opacity-20"
            priority
            quality={100}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 via-teal-900/90 to-cyan-900/90 backdrop-blur-sm"></div>
        </div>

        {/* Header */}
        <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/90 shadow-lg py-3 backdrop-blur-md' : 'bg-white/75 py-6 backdrop-blur-sm'
        }`}>
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-3xl md:text-4xl font-black bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-600 bg-clip-text text-transparent drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)] hover:from-rose-500 hover:via-pink-500 hover:to-fuchsia-500 transition-all duration-300">
                GrahmeenHealth
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleLanguage}
                className="px-4 py-2 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 transition-colors text-sm font-medium"
              >
                {language === 'en' ? 'हिंदी' : language === 'hi' ? 'ಕನ್ನಡ' : 'English'}
              </button>
              <Link
                href="/login"
                className="px-6 py-2 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 transition-colors text-sm font-medium"
              >
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
              </div>
            </motion.div>
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-600 text-transparent bg-clip-text drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)] leading-tight"
              variants={fadeIn}
            >
              {t.hero.title}
            </motion.h1>
            <motion.div
              className="relative mb-12"
              variants={fadeIn}
            >
              <motion.p 
                className="text-xl md:text-2xl lg:text-3xl mb-4 text-gray-800 font-semibold max-w-3xl mx-auto leading-relaxed"
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
                  <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></div>
                  <span className="text-sm text-gray-700">Real-time Monitoring</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-pink-500 animate-pulse"></div>
                  <span className="text-sm text-gray-700">AI-Powered Insights</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-fuchsia-500 animate-pulse"></div>
                  <span className="text-sm text-gray-700">24/7 Support</span>
                </div>
              </motion.div>
              <motion.div
                className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 text-rose-500 opacity-50"
                animate={{ 
                  x: [0, 10, 0],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <FaHeartbeat className="w-full h-full" />
              </motion.div>
              <motion.div
                className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 text-pink-500 opacity-50"
                animate={{ 
                  x: [0, -10, 0],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <FaHeartbeat className="w-full h-full" />
              </motion.div>
            </motion.div>
            
            {/* Doctor/Patient Options */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              variants={staggerContainer}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Link
                  href="/register?role=doctor"
                  className="group flex items-center justify-center bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-rose-500/30 transition-all text-lg font-semibold"
                >
                  <FaUserMd className="h-6 w-6 mr-3 animate-pulse" />
                  {t.hero.doctorButton}
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Link
                  href="/register?role=patient"
                  className="group flex items-center justify-center bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-pink-500/30 transition-all text-lg font-semibold"
                >
                  <FaUserInjured className="h-6 w-6 mr-3 animate-pulse" />
                  {t.hero.patientButton}
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* How it Works Section */}
        <section className="py-20 px-4 relative">
          <motion.div 
            className="container mx-auto max-w-6xl"
            initial="initial"
            whileInView="animate"
            variants={staggerContainer}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
              variants={fadeIn}
            >
              {t.howItWorks.title}
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              {t.howItWorks.steps.map((step: Step, index: number) => (
                <motion.div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm p-6 rounded-xl text-gray-800 shadow-lg border border-gray-100 hover:border-rose-100 transition-all"
                  whileHover={{ scale: 1.02, y: -5 }}
                  variants={fadeIn}
                >
                  <div className="flex items-center mb-4">
                    <div className="text-3xl font-bold text-rose-600 mr-3">{index + 1}</div>
                    <FaHeartbeat className="h-8 w-8 text-rose-600 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.desc}</p>
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
              className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
              variants={fadeIn}
            >
              {t.benefits.title}
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-8">
              {t.benefits.items.map((item: Benefit, index: number) => (
                <motion.div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm p-6 rounded-xl text-gray-800 shadow-lg border border-gray-100 hover:border-rose-100 transition-all"
                  whileHover={{ scale: 1.02, y: -5 }}
                  variants={fadeIn}
                >
                  <div className="flex items-center mb-4">
                    <MdHealthAndSafety className="h-8 w-8 text-rose-600 mr-3 animate-pulse" />
                    <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* For Whom Section */}
        <section className="py-20 px-4 relative">
          <motion.div 
            className="container mx-auto max-w-6xl"
            initial="initial"
            whileInView="animate"
            variants={staggerContainer}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
              variants={fadeIn}
            >
              {t.whoCanBenefit.title}
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-8">
              {t.whoCanBenefit.items.map((item: Group, index: number) => (
                <motion.div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm p-6 rounded-xl text-gray-800 shadow-lg border border-gray-100 hover:border-rose-100 transition-all"
                  whileHover={{ scale: 1.02, y: -5 }}
                  variants={fadeIn}
                >
                  <div className="flex items-center mb-4">
                    <MdLocalHospital className="h-8 w-8 text-rose-600 mr-3 animate-pulse" />
                    <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
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
              className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
              variants={fadeIn}
            >
              Our Impact in Numbers
            </motion.h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <motion.div
                className="bg-white/80 backdrop-blur-sm p-6 rounded-xl text-center shadow-lg border border-gray-100 hover:border-rose-100 transition-all"
                whileHover={{ scale: 1.05 }}
                variants={fadeIn}
              >
                <div className="text-4xl font-bold text-rose-600 mb-2">50K+</div>
                <div className="text-gray-600">Patients Served</div>
              </motion.div>
              <motion.div
                className="bg-white/80 backdrop-blur-sm p-6 rounded-xl text-center shadow-lg border border-gray-100 hover:border-rose-100 transition-all"
                whileHover={{ scale: 1.05 }}
                variants={fadeIn}
              >
                <div className="text-4xl font-bold text-rose-600 mb-2">1000+</div>
                <div className="text-gray-600">Healthcare Providers</div>
              </motion.div>
              <motion.div
                className="bg-white/80 backdrop-blur-sm p-6 rounded-xl text-center shadow-lg border border-gray-100 hover:border-rose-100 transition-all"
                whileHover={{ scale: 1.05 }}
                variants={fadeIn}
              >
                <div className="text-4xl font-bold text-rose-600 mb-2">24/7</div>
                <div className="text-gray-600">Support Available</div>
              </motion.div>
              <motion.div
                className="bg-white/80 backdrop-blur-sm p-6 rounded-xl text-center shadow-lg border border-gray-100 hover:border-rose-100 transition-all"
                whileHover={{ scale: 1.05 }}
                variants={fadeIn}
              >
                <div className="text-4xl font-bold text-rose-600 mb-2">98%</div>
                <div className="text-gray-600">Satisfaction Rate</div>
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
              className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
              variants={fadeIn}
            >
              What Our Users Say
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100 hover:border-rose-100 transition-all"
                whileHover={{ scale: 1.02, y: -5 }}
                variants={fadeIn}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-bold text-xl">JD</div>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-800">Dr. John Doe</div>
                    <div className="text-sm text-gray-600">Cardiologist</div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"GrahmeenHealth has revolutionized how I connect with my patients. The platform is intuitive and efficient."</p>
              </motion.div>
              <motion.div
                className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100 hover:border-rose-100 transition-all"
                whileHover={{ scale: 1.02, y: -5 }}
                variants={fadeIn}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-bold text-xl">SP</div>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-800">Sarah Patel</div>
                    <div className="text-sm text-gray-600">Patient</div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"Getting medical advice has never been easier. The 24/7 support is a game-changer for rural healthcare."</p>
              </motion.div>
              <motion.div
                className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100 hover:border-rose-100 transition-all"
                whileHover={{ scale: 1.02, y: -5 }}
                variants={fadeIn}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-bold text-xl">RK</div>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-800">Rajesh Kumar</div>
                    <div className="text-sm text-gray-600">Healthcare Provider</div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"The AI-powered insights help us provide better care. It's like having a medical assistant at your fingertips."</p>
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
              className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
              variants={fadeIn}
            >
              Latest Updates
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100 hover:border-rose-100 transition-all"
                whileHover={{ scale: 1.02, y: -5 }}
                variants={fadeIn}
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-rose-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-800">New AI Features</div>
                    <div className="text-sm text-gray-600">2 days ago</div>
                  </div>
                </div>
                <p className="text-gray-600">Enhanced AI diagnostics and predictive analytics now available for all healthcare providers.</p>
              </motion.div>
              <motion.div
                className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100 hover:border-rose-100 transition-all"
                whileHover={{ scale: 1.02, y: -5 }}
                variants={fadeIn}
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-rose-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-800">Extended Support Hours</div>
                    <div className="text-sm text-gray-600">1 week ago</div>
                  </div>
                </div>
                <p className="text-gray-600">Our support team is now available 24/7 to assist with any medical emergencies or queries.</p>
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
          <div className="container mx-auto text-center text-gray-600">
            <p>© 2024 GrahmeenHealth. All rights reserved.</p>
          </div>
        </motion.footer>
      </div>
    </div>
  );
};

export default Home;

