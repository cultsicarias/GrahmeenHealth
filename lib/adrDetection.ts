import { Medication } from '../models/User';
import { Symptom } from '../models/Appointment';

// Sample drug interaction databasee
// In a real application, this would come from a medical API or database
const drugInteractions: Record<string, string[]> = {
  'aspirin': ['warfarin', 'heparin', 'clopidogrel', 'ibuprofen', 'naproxen'],
  'ibuprofen': ['aspirin', 'warfarin', 'lisinopril', 'hydrochlorothiazide'],
  'warfarin': ['aspirin', 'ibuprofen', 'amiodarone', 'fluconazole', 'ciprofloxacin'],
  'fluoxetine': ['monoamine oxidase inhibitors', 'tramadol', 'triptans'],
  'lisinopril': ['potassium supplements', 'spironolactone', 'losartan'],
  'atorvastatin': ['cyclosporine', 'erythromycin', 'clarithromycin', 'gemfibrozil'],
  'levothyroxine': ['calcium supplements', 'iron supplements', 'antacids'],
  'amoxicillin': ['probenecid', 'allopurinol', 'oral contraceptives'],
  'metformin': ['furosemide', 'nifedipine', 'cimetidine'],
  'insulin': ['beta-blockers', 'alcohol', 'sulfonylureas']
};

// Sample medication-symptom relationship database
// Maps medications to potential adverse symptoms they might cause
const medicationAdverseEffects: Record<string, { symptom: string, severity: 'mild' | 'moderate' | 'severe' }[]> = {
  'aspirin': [
    { symptom: 'stomach pain', severity: 'moderate' },
    { symptom: 'heartburn', severity: 'mild' },
    { symptom: 'nausea', severity: 'mild' },
    { symptom: 'ringing in ears', severity: 'moderate' }
  ],
  'ibuprofen': [
    { symptom: 'stomach pain', severity: 'moderate' },
    { symptom: 'headache', severity: 'mild' },
    { symptom: 'dizziness', severity: 'mild' }
  ],
  'lisinopril': [
    { symptom: 'dry cough', severity: 'moderate' },
    { symptom: 'dizziness', severity: 'moderate' },
    { symptom: 'headache', severity: 'mild' }
  ],
  'metformin': [
    { symptom: 'nausea', severity: 'moderate' },
    { symptom: 'diarrhea', severity: 'moderate' },
    { symptom: 'stomach pain', severity: 'mild' }
  ],
  'atorvastatin': [
    { symptom: 'muscle pain', severity: 'moderate' },
    { symptom: 'joint pain', severity: 'moderate' },
    { symptom: 'weakness', severity: 'mild' }
  ],
  'levothyroxine': [
    { symptom: 'rapid heartbeat', severity: 'moderate' },
    { symptom: 'anxiety', severity: 'moderate' },
    { symptom: 'insomnia', severity: 'mild' }
  ],
  'warfarin': [
    { symptom: 'unusual bleeding', severity: 'severe' },
    { symptom: 'bruising', severity: 'moderate' }
  ],
  'fluoxetine': [
    { symptom: 'insomnia', severity: 'moderate' },
    { symptom: 'nausea', severity: 'mild' },
    { symptom: 'headache', severity: 'mild' },
    { symptom: 'anxiety', severity: 'moderate' }
  ]
};

// Define common ADR patterns
const adrPatterns: { [key: string]: { symptoms: string[], severity: string } } = {
  'allergic reaction': {
    symptoms: ['rash', 'itching', 'swelling', 'difficulty breathing'],
    severity: 'severe'
  },
  'gastrointestinal': {
    symptoms: ['nausea', 'vomiting', 'diarrhea', 'stomach pain'],
    severity: 'moderate'
  },
  'neurological': {
    symptoms: ['dizziness', 'headache', 'confusion', 'seizures'],
    severity: 'severe'
  },
  'cardiovascular': {
    symptoms: ['chest pain', 'irregular heartbeat', 'high blood pressure'],
    severity: 'critical'
  },
  'respiratory': {
    symptoms: ['cough', 'shortness of breath', 'wheezing'],
    severity: 'moderate'
  },
  'skin reactions': {
    symptoms: ['rash', 'hives', 'itching', 'redness'],
    severity: 'moderate'
  }
};

// Define medication-ADR associations
const medicationAdrAssociations: { [key: string]: string[] } = {
  'antibiotics': ['allergic reaction', 'gastrointestinal', 'skin reactions'],
  'painkillers': ['gastrointestinal', 'neurological', 'allergic reaction'],
  'antidepressants': ['neurological', 'cardiovascular'],
  'blood pressure': ['cardiovascular', 'respiratory'],
  'antihistamines': ['neurological', 'skin reactions'],
  'steroids': ['gastrointestinal', 'skin reactions', 'cardiovascular']
};

// Check for drug-drug interactions
export function checkDrugInteractions(medications: Medication[]): string[] {
  const warnings: string[] = [];
  const medicationNames = medications.map(med => med.name.toLowerCase());

  for (let i = 0; i < medicationNames.length; i++) {
    const currentMed = medicationNames[i];
    const interactingMeds = drugInteractions[currentMed] || [];

    for (let j = 0; j < medicationNames.length; j++) {
      if (i === j) continue;
      
      if (interactingMeds.includes(medicationNames[j])) {
        warnings.push(`Potential interaction between ${currentMed} and ${medicationNames[j]}`);
      }
    }
  }

  return warnings;
}

// Check for symptoms that might be adverse drug reactions
export function checkForAdverseReactions(medications: Medication[], symptoms: Symptom[]): string[] {
  const warnings: string[] = [];
  const symptomMap = new Map(symptoms.map(s => [s.name.toLowerCase(), s]));

  medications.forEach(medication => {
    const medName = medication.name.toLowerCase();
    const possibleEffects = medicationAdverseEffects[medName] || [];

    possibleEffects.forEach(effect => {
      const patientSymptom = symptomMap.get(effect.symptom);
      
      if (patientSymptom) {
        const severityLevel = 
          patientSymptom.severity === 'severe' ? 3 : 
          patientSymptom.severity === 'moderate' ? 2 : 1;
        
        const effectSeverityLevel = 
          effect.severity === 'severe' ? 3 : 
          effect.severity === 'moderate' ? 2 : 1;
        
        // If the patient's symptom is at least as severe as the known effect
        if (severityLevel >= effectSeverityLevel) {
          warnings.push(`${patientSymptom.name} may be an adverse reaction to ${medication.name}`);
        }
      }
    });
  });

  return warnings;
}

// Main function to detect all potential ADRs
export function detectAdverseReactions(medication: string, symptoms: string[]): { type: string, severity: string, confidence: number }[] {
  const medicationLower = medication.toLowerCase();
  const symptomsLower = symptoms.map(s => s.toLowerCase());
  
  // Find associated ADR patterns for the medication
  const associatedPatterns = Object.entries(medicationAdrAssociations)
    .filter(([medType]) => medicationLower.includes(medType.toLowerCase()))
    .flatMap(([_, patterns]) => patterns);

  const detectedReactions: { type: string, severity: string, confidence: number }[] = [];

  // Check each associated pattern
  associatedPatterns.forEach(pattern => {
    const patternData = adrPatterns[pattern];
    if (!patternData) return;

    // Count matching symptoms
    const matchingSymptoms = patternData.symptoms.filter(symptom => 
      symptomsLower.some(s => s.includes(symptom))
    );

    // Calculate confidence based on symptom matches
    const confidence = matchingSymptoms.length / patternData.symptoms.length;

    if (confidence > 0.3) { // Threshold for considering it a potential ADR
      detectedReactions.push({
        type: pattern,
        severity: patternData.severity,
        confidence: Math.round(confidence * 100) / 100
      });
    }
  });

  // Sort by confidence
  return detectedReactions.sort((a, b) => b.confidence - a.confidence);
}

export function calculateAdrSeverity(reactions: { type: string, severity: string, confidence: number }[]): string {
  if (reactions.length === 0) return 'none';

  const severityWeights: { [key: string]: number } = {
    'critical': 4,
    'severe': 3,
    'moderate': 2,
    'mild': 1
  };

  // Calculate weighted severity
  const totalWeight = reactions.reduce((sum, reaction) => {
    return sum + (severityWeights[reaction.severity] * reaction.confidence);
  }, 0);

  const averageWeight = totalWeight / reactions.length;

  // Determine overall severity
  if (averageWeight >= 3.5) return 'critical';
  if (averageWeight >= 2.5) return 'severe';
  if (averageWeight >= 1.5) return 'moderate';
  return 'mild';
} 
