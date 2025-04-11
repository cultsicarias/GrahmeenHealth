import mongoose from 'mongoose';

export interface HardcodedDoctor {
  _id: string;
  name: string;
  email: string;
  specialization: string;
  experience: number;
  qualifications: string;
  licenseNumber: string;
  availability: {
    days: string[];
    startTime: string;
    endTime: string;
  };
  about: string;
  imageUrl: string;
  consultationFee: number;
  rating: number;
  reviews: any[];
  education: {
    degree: string;
    institution: string;
    year: number;
  }[];
  awards: string[];
  languages: string[];
  isAvailable: boolean;
}

// Convert string to MongoDB ObjectId
const createObjectId = (id: string) => new mongoose.Types.ObjectId(id);

export const hardcodedDoctors: HardcodedDoctor[] = [
  {
    _id: "6501234567891011121314a1",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@example.com",
    specialization: "Cardiology",
    experience: 12,
    qualifications: "MD, FACC",
    licenseNumber: "CAR12345",
    availability: {
      days: ["Mon", "Tue", "Wed", "Fri"],
      startTime: "09:00",
      endTime: "17:00"
    },
    about: "Specialized in cardiovascular diseases with over 12 years of clinical experience.",
    imageUrl: "https://randomuser.me/api/portraits/women/25.jpg",
    consultationFee: 1500,
    rating: 4.8,
    reviews: [],
    education: [
      {
        degree: "MD in Cardiology",
        institution: "Stanford Medical School",
        year: 2011
      },
      {
        degree: "Bachelor of Medicine",
        institution: "Johns Hopkins University",
        year: 2005
      }
    ],
    awards: [
      "Excellence in Cardiovascular Research, 2018",
      "Young Physician Award, 2015"
    ],
    languages: ["English", "Spanish"],
    isAvailable: true
  },
  {
    _id: "6501234567891011121314a2",
    name: "Dr. Michael Chen",
    email: "michael.chen@example.com",
    specialization: "Neurology",
    experience: 10,
    qualifications: "MD, PhD",
    licenseNumber: "NEU54321",
    availability: {
      days: ["Mon", "Wed", "Thu", "Fri"],
      startTime: "08:30",
      endTime: "16:30"
    },
    about: "Board-certified neurologist specializing in headache disorders and stroke treatment.",
    imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    consultationFee: 1800,
    rating: 4.7,
    reviews: [],
    education: [
      {
        degree: "PhD in Neuroscience",
        institution: "Harvard Medical School",
        year: 2013
      },
      {
        degree: "MD in Neurology",
        institution: "Columbia University",
        year: 2009
      }
    ],
    awards: [
      "Neurological Research Award, 2019",
      "Innovative Treatment Approach, 2017"
    ],
    languages: ["English", "Mandarin", "Cantonese"],
    isAvailable: true
  },
  {
    _id: "6501234567891011121314a3",
    name: "Dr. Emily Rodriguez",
    email: "emily.rodriguez@example.com",
    specialization: "Pediatrics",
    experience: 8,
    qualifications: "MD, FAAP",
    licenseNumber: "PED98765",
    availability: {
      days: ["Tue", "Wed", "Thu", "Fri"],
      startTime: "09:00",
      endTime: "18:00"
    },
    about: "Passionate about child health, specializing in early childhood development and preventive care.",
    imageUrl: "https://randomuser.me/api/portraits/women/43.jpg",
    consultationFee: 1200,
    rating: 4.9,
    reviews: [],
    education: [
      {
        degree: "MD in Pediatrics",
        institution: "Yale School of Medicine",
        year: 2012
      },
      {
        degree: "Bachelor of Science",
        institution: "UCLA",
        year: 2006
      }
    ],
    awards: [
      "Children's Health Foundation Award, 2020",
      "Pediatric Care Excellence, 2018"
    ],
    languages: ["English", "Spanish", "Portuguese"],
    isAvailable: true
  },
  {
    _id: "6501234567891011121314a4",
    name: "Dr. James Wilson",
    email: "james.wilson@example.com",
    specialization: "Orthopedics",
    experience: 15,
    qualifications: "MD, FAAOS",
    licenseNumber: "ORT67890",
    availability: {
      days: ["Mon", "Tue", "Thu"],
      startTime: "10:00",
      endTime: "18:00"
    },
    about: "Specializes in sports medicine and joint reconstruction with minimal invasive techniques.",
    imageUrl: "https://randomuser.me/api/portraits/men/55.jpg",
    consultationFee: 2000,
    rating: 4.6,
    reviews: [],
    education: [
      {
        degree: "Fellowship in Sports Medicine",
        institution: "Mayo Clinic",
        year: 2009
      },
      {
        degree: "MD in Orthopedic Surgery",
        institution: "University of Pennsylvania",
        year: 2005
      }
    ],
    awards: [
      "Sports Medicine Innovation Award, 2017",
      "Excellence in Joint Replacement, 2014"
    ],
    languages: ["English"],
    isAvailable: false
  },
  {
    _id: "6501234567891011121314a5",
    name: "Dr. Amara Patel",
    email: "amara.patel@example.com",
    specialization: "General Medicine",
    experience: 7,
    qualifications: "MD",
    licenseNumber: "GEN24680",
    availability: {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      startTime: "09:00",
      endTime: "17:00"
    },
    about: "Holistic approach to health focusing on preventive care and comprehensive management of chronic diseases.",
    imageUrl: "https://randomuser.me/api/portraits/women/63.jpg",
    consultationFee: 1000,
    rating: 4.5,
    reviews: [],
    education: [
      {
        degree: "MD in Internal Medicine",
        institution: "Northwestern University",
        year: 2014
      },
      {
        degree: "Bachelor of Medicine",
        institution: "University of Chicago",
        year: 2008
      }
    ],
    awards: [
      "Preventive Care Excellence, 2019"
    ],
    languages: ["English", "Hindi", "Gujarati"],
    isAvailable: true
  },
  {
    _id: "6501234567891011121314a6",
    name: "Dr. Rajesh Sharma",
    email: "rajesh.sharma@example.com",
    specialization: "Ayurvedic Medicine",
    experience: 18,
    qualifications: "BAMS, MD (Ayurveda)",
    licenseNumber: "AYU28795",
    availability: {
      days: ["Mon", "Tue", "Wed", "Thu", "Sat"],
      startTime: "10:00",
      endTime: "19:00"
    },
    about: "Internationally recognized Ayurvedic physician with expertise in chronic disease management through traditional approaches combined with modern healthcare practices.",
    imageUrl: "",
    consultationFee: 1200,
    rating: 4.9,
    reviews: [],
    education: [
      {
        degree: "MD in Ayurvedic Medicine",
        institution: "All India Institute of Ayurveda, New Delhi",
        year: 2005
      },
      {
        degree: "Bachelor of Ayurvedic Medicine & Surgery (BAMS)",
        institution: "Banaras Hindu University",
        year: 2000
      }
    ],
    awards: [
      "National Ayurveda Excellence Award, 2019",
      "Best Ayurvedic Practitioner, Ministry of AYUSH, 2016",
      "Research Excellence in Traditional Medicine, 2012"
    ],
    languages: ["English", "Hindi", "Sanskrit", "Bengali"],
    isAvailable: true
  },
  {
    _id: "6501234567891011121314a7",
    name: "Dr. Priya Agarwal",
    email: "priya.agarwal@example.com",
    specialization: "Obstetrics & Gynecology",
    experience: 14,
    qualifications: "MBBS, MS (Obs & Gyn), DNB",
    licenseNumber: "OBGY76543",
    availability: {
      days: ["Mon", "Wed", "Thu", "Fri", "Sat"],
      startTime: "09:30",
      endTime: "18:00"
    },
    about: "Specialized in high-risk pregnancies and women's reproductive health with a compassionate approach to patient care.",
    imageUrl: "",
    consultationFee: 1500,
    rating: 4.8,
    reviews: [],
    education: [
      {
        degree: "Diplomate of National Board (DNB)",
        institution: "National Board of Examinations, New Delhi",
        year: 2012
      },
      {
        degree: "MS in Obstetrics & Gynecology",
        institution: "All India Institute of Medical Sciences (AIIMS)",
        year: 2009
      },
      {
        degree: "MBBS",
        institution: "Christian Medical College, Vellore",
        year: 2005
      }
    ],
    awards: [
      "Dr. B.C. Roy Award for Excellence in Medicine, 2021",
      "Distinguished Gynecologist Award, FOGSI, 2018",
      "Young Scientist Award in Women's Health Research, 2015"
    ],
    languages: ["English", "Hindi", "Tamil", "Telugu"],
    isAvailable: true
  }
];

// Helper function to get a doctor by ID
export function getDoctorById(id: string): HardcodedDoctor | undefined {
  return hardcodedDoctors.find(doctor => doctor._id === id);
}

// Helper function to get all doctors
export function getAllDoctors(): HardcodedDoctor[] {
  return hardcodedDoctors;
} 