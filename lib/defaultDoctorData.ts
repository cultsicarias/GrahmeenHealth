/**
 * This file contains predefined data for auto-populating doctor profiles during registration 
 */

// Top Indian medical colleges
export const medicalColleges = [
  {
    name: "All India Institute of Medical Sciences (AIIMS), New Delhi",
    shortName: "AIIMS Delhi"
  },
  {
    name: "Christian Medical College (CMC), Vellore",
    shortName: "CMC Vellore"
  },
  {
    name: "Armed Forces Medical College (AFMC), Pune",
    shortName: "AFMC Pune"
  },
  {
    name: "Maulana Azad Medical College, New Delhi",
    shortName: "MAMC Delhi"
  },
  {
    name: "King George's Medical University (KGMU), Lucknow",
    shortName: "KGMU Lucknow"
  },
  {
    name: "Jawaharlal Institute of Postgraduate Medical Education & Research (JIPMER), Puducherry",
    shortName: "JIPMER Puducherry"
  },
  {
    name: "Grant Medical College and Sir JJ Group of Hospitals, Mumbai",
    shortName: "GMC Mumbai"
  },
  {
    name: "Madras Medical College, Chennai",
    shortName: "MMC Chennai"
  },
  {
    name: "Seth GS Medical College and KEM Hospital, Mumbai",
    shortName: "KEM Mumbai"
  },
  {
    name: "Stanley Medical College, Chennai",
    shortName: "SMC Chennai"
  }
];

// Medical specializations with degree abbreviations
export const specializations = [
  {
    name: "General Medicine",
    qualifications: "MBBS, MD (Medicine)",
    about: "Specializing in comprehensive diagnosis and non-surgical treatment of various diseases and ailments in adults."
  },
  {
    name: "Pediatrics",
    qualifications: "MBBS, MD (Pediatrics)",
    about: "Dedicated to providing complete healthcare for infants, children, and adolescents, focusing on growth and development."
  },
  {
    name: "Cardiology",
    qualifications: "MBBS, MD, DM (Cardiology)",
    about: "Specialized in diagnosing and treating diseases and conditions of the cardiovascular system, including heart and blood vessels."
  },
  {
    name: "Neurology",
    qualifications: "MBBS, MD, DM (Neurology)",
    about: "Experienced in diagnosing and treating disorders of the nervous system, including the brain, spinal cord, and peripheral nerves."
  },
  {
    name: "Orthopedics",
    qualifications: "MBBS, MS (Ortho), DNB",
    about: "Focused on diagnosing and treating disorders, injuries, and diseases of the musculoskeletal system."
  },
  {
    name: "Dermatology",
    qualifications: "MBBS, MD (Dermatology)",
    about: "Specializing in treating various skin conditions, hair and nail diseases, and cosmetic concerns."
  },
  {
    name: "Psychiatry",
    qualifications: "MBBS, MD (Psychiatry)",
    about: "Devoted to the diagnosis, prevention, and treatment of mental disorders, providing both medication management and therapy."
  },
  {
    name: "Ophthalmology",
    qualifications: "MBBS, MS (Ophthalmology)",
    about: "Specialized in comprehensive eye care, including diagnosis and treatment of eye disorders and diseases."
  },
  {
    name: "ENT (Otolaryngology)",
    qualifications: "MBBS, MS (ENT)",
    about: "Specializing in disorders of the ear, nose, throat, and related structures of the head and neck."
  },
  {
    name: "Obstetrics & Gynecology",
    qualifications: "MBBS, MS/MD (OB-GYN), DNB",
    about: "Dedicated to women's health, including pregnancy, childbirth, and disorders of the female reproductive system."
  },
  {
    name: "Gastroenterology",
    qualifications: "MBBS, MD, DM (Gastroenterology)",
    about: "Focused on the digestive system and its disorders, providing comprehensive care for conditions affecting the gastrointestinal tract."
  },
  {
    name: "Endocrinology",
    qualifications: "MBBS, MD, DM (Endocrinology)",
    about: "Specializing in disorders of the endocrine system, hormones, and related metabolic functions."
  },
  {
    name: "Ayurvedic Medicine",
    qualifications: "BAMS, MD (Ayurveda)",
    about: "Practicing traditional Indian system of medicine focusing on holistic healing and natural remedies to maintain health and wellness."
  }
];

// Common awards and recognitions
export const awards = [
  "Dr. B.C. Roy Award for Excellence in Medicine",
  "ICMR Award for Biomedical Research",
  "Distinguished Physician Award",
  "Best Medical Practitioner Award",
  "Healthcare Excellence Award",
  "Young Investigator Award",
  "Best Research Paper Award",
  "Medical Council of India Recognition for Outstanding Contribution",
  "Fellowship of the Indian Academy of Medical Sciences",
  "State Medical Council Appreciation Award",
  "Excellence in Patient Care Award"
];

// Languages commonly spoken by Indian doctors
export const languages = [
  "English",
  "Hindi",
  "Tamil",
  "Telugu",
  "Kannada",
  "Malayalam",
  "Bengali",
  "Marathi",
  "Gujarati",
  "Punjabi",
  "Urdu",
  "Odia",
  "Assamese"
];

// Generate a random consultation fee in increments of 100 between min and max
export const generateConsultationFee = (min = 200, max = 1000) => {
  const steps = (max - min) / 100 + 1;
  return min + Math.floor(Math.random() * steps) * 100;
};

// Generate random years of experience
export const generateExperience = (min = 3, max = 20) => {
  return min + Math.floor(Math.random() * (max - min + 1));
};

// Get random items from array
export const getRandomItems = <T>(array: T[], count = 1): T[] => {
  const result = [];
  const arrayCopy = [...array];
  count = Math.min(count, array.length);
  
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * arrayCopy.length);
    result.push(arrayCopy[randomIndex]);
    arrayCopy.splice(randomIndex, 1);
  }
  
  return result;
};

// Generate random doctor data
export const generateRandomDoctorData = () => {
  const specialization = getRandomItems(specializations, 1)[0];
  const medicalCollege = getRandomItems(medicalColleges, 1)[0];
  const experience = generateExperience();
  const yearsAgo = new Date().getFullYear() - experience;
  
  return {
    specialization: specialization.name,
    qualifications: specialization.qualifications,
    about: specialization.about,
    experience: experience,
    consultationFee: generateConsultationFee(),
    languages: getRandomItems(languages, Math.floor(Math.random() * 3) + 1),
    awards: getRandomItems(awards, Math.floor(Math.random() * 2)),
    isAvailable: Math.random() > 0.2, // 80% chance of being available
    education: [
      {
        degree: specialization.qualifications.split(', ')[1] || "MBBS",
        institution: medicalCollege.name,
        year: yearsAgo + Math.floor(Math.random() * 3) // Graduated 0-3 years after starting practice
      },
      {
        degree: "MBBS",
        institution: getRandomItems(medicalColleges, 1)[0].name,
        year: yearsAgo - 5 // MBBS completed 5 years before specialization
      }
    ],
    availability: {
      days: getRandomItems(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], Math.floor(Math.random() * 3) + 3),
      startTime: ["08:00", "09:00", "10:00"][Math.floor(Math.random() * 3)],
      endTime: ["17:00", "18:00", "19:00"][Math.floor(Math.random() * 3)]
    }
  };
}; 
