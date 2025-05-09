import { Symptom } from '../models/Appointment';
import { MedicalCondition } from '../models/User';


// Sample database of symptom to condition mappings
// In a real application, this would come from a medical API or database
const symptomConditionMap: Record<string, { condition: string, severity: number, urgency: number }[]> = {
  'chest pain': [
    { condition: 'Heart Attack', severity: 9, urgency: 10 },
    { condition: 'Angina', severity: 7, urgency: 8 },
    { condition: 'GERD', severity: 4, urgency: 3 }
  ],
  'shortness of breath': [
    { condition: 'Asthma', severity: 6, urgency: 7 },
    { condition: 'COVID-19', severity: 7, urgency: 8 },
    { condition: 'Heart Failure', severity: 8, urgency: 9 },
    { condition: 'Pneumonia', severity: 7, urgency: 8 }
  ],
  'headache': [
    { condition: 'Migraine', severity: 5, urgency: 4 },
    { condition: 'Tension Headache', severity: 3, urgency: 2 },
    { condition: 'Meningitis', severity: 9, urgency: 10 },
    { condition: 'Brain Tumor', severity: 9, urgency: 8 }
  ],
  'fever': [
    { condition: 'Influenza', severity: 5, urgency: 4 },
    { condition: 'COVID-19', severity: 7, urgency: 7 },
    { condition: 'Pneumonia', severity: 7, urgency: 7 },
    { condition: 'Meningitis', severity: 9, urgency: 10 }
  ],
  'abdominal pain': [
    { condition: 'Appendicitis', severity: 8, urgency: 9 },
    { condition: 'Gallstones', severity: 6, urgency: 7 },
    { condition: 'IBS', severity: 4, urgency: 3 },
    { condition: 'Pancreatitis', severity: 8, urgency: 8 }
  ],
  'nausea': [
    { condition: 'Gastroenteritis', severity: 4, urgency: 3 },
    { condition: 'Food Poisoning', severity: 5, urgency: 5 },
    { condition: 'Pregnancy', severity: 3, urgency: 2 },
    { condition: 'Migraine', severity: 5, urgency: 4 }
  ],
  'fatigue': [
    { condition: 'Anemia', severity: 5, urgency: 4 },
    { condition: 'Depression', severity: 6, urgency: 5 },
    { condition: 'Hypothyroidism', severity: 5, urgency: 4 },
    { condition: 'Chronic Fatigue Syndrome', severity: 6, urgency: 4 }
  ],
  'joint pain': [
    { condition: 'Rheumatoid Arthritis', severity: 6, urgency: 5 },
    { condition: 'Osteoarthritis', severity: 5, urgency: 4 },
    { condition: 'Gout', severity: 6, urgency: 6 },
    { condition: 'Lupus', severity: 7, urgency: 6 }
  ],
  'cough': [
    { condition: 'Common Cold', severity: 2, urgency: 1 },
    { condition: 'Bronchitis', severity: 5, urgency: 4 },
    { condition: 'Pneumonia', severity: 7, urgency: 7 },
    { condition: 'COVID-19', severity: 7, urgency: 7 },
    { condition: 'Lung Cancer', severity: 9, urgency: 8 }
  ],
  'dizziness': [
    { condition: 'Vertigo', severity: 5, urgency: 4 },
    { condition: 'Anemia', severity: 5, urgency: 4 },
    { condition: 'Hypoglycemia', severity: 6, urgency: 6 },
    { condition: 'Stroke', severity: 9, urgency: 10 }
  ]
};

// Severity multipliers for different durations
const durationMultipliers: Record<string, number> = {
  'minutes': 1.2,
  'hours': 1.1,
  'days': 1.0,
  'weeks': 0.9,
  'months': 0.8,
  'years': 0.7
};

interface Symptom {
  name: string;
  severity: number;
  duration: number;
}

interface Condition {
  name: string;
  probability: number;
  severity: string;
  symptoms: string[];
}

export function calculateEmergencyRating(
  symptoms: string[],
  severity: string,
  age: number,
  gender: string
): number {
  // Base emergency rating based on severity
  let rating = 0;
  switch (severity.toLowerCase()) {
    case 'critical':
      rating = 9;
      break;
    case 'severe':
      rating = 7;
      break;
    case 'moderate':
      rating = 5;
      break;
    case 'mild':
      rating = 3;
      break;
    default:
      rating = 1;
  }

  // Adjust rating based on age
  if (age < 12 || age > 65) {
    rating += 1;
  }

  // Adjust rating based on number of symptoms
  if (symptoms.length > 5) {
    rating += 1;
  }

  // Ensure rating is between 1 and 10
  return Math.min(Math.max(rating, 1), 10);
}

export function predictPossibleConditions(
  symptoms: string[],
  severity: string,
  medicalHistory: string[] = [],
  familyHistory: string[] = []
): string[] {
  // This is a simplified version - in a real application, this would use
  // machine learning models or medical knowledge bases
  const conditions: Condition[] = [
    {
      name: 'Common Cold',
      probability: 0.7,
      severity: 'mild',
      symptoms: ['cough', 'sore throat', 'runny nose', 'fever'],
    },
    {
      name: 'Influenza',
      probability: 0.6,
      severity: 'moderate',
      symptoms: ['fever', 'body aches', 'fatigue', 'cough'],
    },
    {
      name: 'Pneumonia',
      probability: 0.5,
      severity: 'severe',
      symptoms: ['cough', 'fever', 'shortness of breath', 'chest pain'],
    },
    {
      name: 'Bronchitis',
      probability: 0.4,
      severity: 'moderate',
      symptoms: ['cough', 'wheezing', 'shortness of breath', 'chest discomfort'],
    },
    {
      name: 'Sinusitis',
      probability: 0.3,
      severity: 'mild',
      symptoms: ['facial pain', 'nasal congestion', 'headache', 'fever'],
    },
  ];

  // Filter conditions based on symptoms and severity
  const matchingConditions = conditions
    .filter(condition => {
      const hasMatchingSymptoms = condition.symptoms.some(symptom =>
        symptoms.some(s => s.toLowerCase().includes(symptom.toLowerCase()))
      );
      const severityMatches = condition.severity === severity;
      return hasMatchingSymptoms && severityMatches;
    })
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 3)
    .map(condition => condition.name);

  return matchingConditions;
}

export function estimateAppointmentDuration(
  symptoms: string[],
  severity: string,
  possibleConditions: string[]
): number {
  // Base duration in minutes
  let duration = 15;

  // Adjust based on severity
  switch (severity.toLowerCase()) {
    case 'critical':
      duration += 30;
      break;
    case 'severe':
      duration += 20;
      break;
    case 'moderate':
      duration += 15;
      break;
    case 'mild':
      duration += 10;
      break;
  }

  // Adjust based on number of symptoms
  duration += symptoms.length * 5;

  // Adjust based on number of possible conditions
  duration += possibleConditions.length * 10;

  // Ensure minimum duration of 15 minutes
  return Math.max(duration, 15);
}

// Generate recommendations based on symptoms and severity
export function generateRecommendations(symptoms: string[], severity: string): string[] {
  const recommendations: string[] = [];
  
  // General recommendations based on severity
  if (severity === 'critical') {
    recommendations.push('Seek immediate medical attention');
    recommendations.push('Call emergency services if symptoms worsen');
  } else if (severity === 'severe') {
    recommendations.push('Schedule an appointment as soon as possible');
    recommendations.push('Monitor symptoms closely');
  } else if (severity === 'moderate') {
    recommendations.push('Schedule an appointment within 24-48 hours');
  } else {
    recommendations.push('Schedule an appointment at your convenience');
  }
  
  // Specific recommendations based on symptoms
  symptoms.forEach(symptom => {
    switch (symptom.toLowerCase()) {
      case 'fever':
        recommendations.push('Monitor temperature regularly');
        recommendations.push('Stay hydrated');
        recommendations.push('Rest and avoid strenuous activity');
        break;
      case 'cough':
        recommendations.push('Use a humidifier');
        recommendations.push('Avoid irritants like smoke');
        recommendations.push('Stay hydrated');
        break;
      case 'headache':
        recommendations.push('Rest in a quiet, dark room');
        recommendations.push('Stay hydrated');
        recommendations.push('Avoid bright lights and loud noises');
        break;
      case 'nausea':
      case 'vomiting':
        recommendations.push('Stay hydrated with small sips of water');
        recommendations.push('Avoid solid foods until symptoms improve');
        recommendations.push('Rest in a comfortable position');
        break;
      case 'diarrhea':
        recommendations.push('Stay hydrated with electrolyte solutions');
        recommendations.push('Avoid dairy and fatty foods');
        recommendations.push('Eat bland foods like rice, bananas, and toast');
        break;
      case 'dizziness':
        recommendations.push('Sit or lie down when feeling dizzy');
        recommendations.push('Avoid sudden movements');
        recommendations.push('Stay hydrated');
        break;
      case 'fatigue':
        recommendations.push('Get plenty of rest');
        recommendations.push('Maintain a regular sleep schedule');
        recommendations.push('Stay hydrated and eat nutritious meals');
        break;
      case 'muscle pain':
        recommendations.push('Apply ice or heat as needed');
        recommendations.push('Rest the affected area');
        recommendations.push('Stay hydrated');
        break;
    }
  });
  
  return [...new Set(recommendations)]; // Remove duplicates
} 
