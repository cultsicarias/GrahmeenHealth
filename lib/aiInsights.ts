interface Symptom {
  name: string;
  severity: string;
  duration: string;
}

interface AIInsights {
  predictedDiseases: Array<{ name: string; probability: number }>;
  possibleADRs: Array<{ drug: string; reaction: string; severity: string }>;
  estimatedConsultationTime: number; // in minutes
  severityScore: number; // 1-10
  impactFactors: {
    urgency: number; // 1-10
    complexity: number; // 1-10
    chronicityRisk: number; // 1-10
  };
}

// Simple mapping of symptoms to possible diseases
const diseaseMapping: { [key: string]: string[] } = {
  fever: ['Viral Infection', 'Flu', 'COVID-19', 'Malaria'],
  cough: ['Common Cold', 'Bronchitis', 'COVID-19', 'Asthma'],
  headache: ['Migraine', 'Tension Headache', 'Sinusitis'],
  'chest pain': ['Angina', 'Muscle Strain', 'Anxiety', 'Heart Disease'],
  fatigue: ['Anemia', 'Depression', 'Chronic Fatigue Syndrome', 'Thyroid Issues'],
  'shortness of breath': ['Asthma', 'Anxiety', 'COVID-19', 'Heart Failure'],
  'joint pain': ['Arthritis', 'Rheumatism', 'Gout', 'Injury'],
  'stomach pain': ['Gastritis', 'Food Poisoning', 'Appendicitis', 'IBS'],
};

// Common drug-symptom interactions
const adrMapping: { [key: string]: { drug: string; reaction: string }[] } = {
  headache: [
    { drug: 'Aspirin', reaction: 'Stomach irritation' },
    { drug: 'Ibuprofen', reaction: 'Gastrointestinal issues' },
  ],
  dizziness: [
    { drug: 'Antidepressants', reaction: 'Blood pressure changes' },
    { drug: 'Beta blockers', reaction: 'Fatigue' },
  ],
};

export function generateAIInsights(symptoms: Symptom[]): AIInsights {
  // Calculate severity score (1-10)
  const severityScore = Math.min(
    10,
    symptoms.reduce((score, symptom) => {
      const severityMultiplier = 
        symptom.severity === 'severe' ? 3 :
        symptom.severity === 'moderate' ? 2 : 1;
      
      const durationMultiplier = 
        symptom.duration.includes('month') ? 2 :
        symptom.duration.includes('week') ? 1.5 : 1;
      
      return score + (severityMultiplier * durationMultiplier);
    }, 0)
  );

  // Predict diseases based on symptoms
  const predictedDiseases = symptoms
    .flatMap(s => diseaseMapping[s.name.toLowerCase()] || [])
    .reduce((acc: { name: string; probability: number }[], disease) => {
      const existingDisease = acc.find(d => d.name === disease);
      if (existingDisease) {
        existingDisease.probability += 0.2; // Increase probability for multiple matching symptoms
      } else {
        acc.push({ name: disease, probability: 0.5 + Math.random() * 0.3 }); // Base probability + random factor
      }
      return acc;
    }, [])
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 3); // Top 3 predictions

  // Check for possible ADRs
  const possibleADRs = symptoms
    .flatMap(s => adrMapping[s.name.toLowerCase()] || [])
    .map(adr => ({
      ...adr,
      severity: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'moderate' : 'low'
    }));

  // Calculate estimated consultation time
  const baseTime = 15; // Base consultation time in minutes
  const complexityFactor = Math.min(2, 1 + (symptoms.length * 0.2)); // More symptoms = more time
  const severityFactor = 1 + (severityScore * 0.1); // Higher severity = more time
  const estimatedConsultationTime = Math.round(baseTime * complexityFactor * severityFactor);

  // Calculate impact factors
  const urgency = Math.min(10, severityScore * 1.2);
  const complexity = Math.min(10, (symptoms.length * 2) + (severityScore * 0.5));
  const chronicityRisk = Math.min(10, 
    symptoms.reduce((risk, s) => 
      risk + (s.duration.includes('month') ? 3 : s.duration.includes('week') ? 2 : 1), 0)
  );

  return {
    predictedDiseases,
    possibleADRs,
    estimatedConsultationTime,
    severityScore,
    impactFactors: {
      urgency,
      complexity,
      chronicityRisk
    }
  };
}
