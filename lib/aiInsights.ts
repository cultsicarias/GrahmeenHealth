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

// Comprehensive mapping of symptoms to possible diseases with probabilities
const diseaseMapping: { [key: string]: Array<{ name: string; baseProbability: number }> } = {
  fever: [
    { name: 'Viral Infection', baseProbability: 0.7 },
    { name: 'Flu', baseProbability: 0.6 },
    { name: 'COVID-19', baseProbability: 0.5 },
    { name: 'Malaria', baseProbability: 0.3 }
  ],
  cough: [
    { name: 'Common Cold', baseProbability: 0.8 },
    { name: 'Bronchitis', baseProbability: 0.6 },
    { name: 'COVID-19', baseProbability: 0.5 },
    { name: 'Asthma', baseProbability: 0.4 }
  ],
  headache: [
    { name: 'Tension Headache', baseProbability: 0.7 },
    { name: 'Migraine', baseProbability: 0.5 },
    { name: 'Sinusitis', baseProbability: 0.4 }
  ],
  'chest pain': [
    { name: 'Muscle Strain', baseProbability: 0.6 },
    { name: 'Anxiety', baseProbability: 0.5 },
    { name: 'Angina', baseProbability: 0.4 },
    { name: 'Heart Disease', baseProbability: 0.3 }
  ],
  fatigue: [
    { name: 'Anemia', baseProbability: 0.6 },
    { name: 'Depression', baseProbability: 0.5 },
    { name: 'Thyroid Issues', baseProbability: 0.4 },
    { name: 'Chronic Fatigue Syndrome', baseProbability: 0.3 }
  ],
  'shortness of breath': [
    { name: 'Anxiety', baseProbability: 0.6 },
    { name: 'Asthma', baseProbability: 0.5 },
    { name: 'COVID-19', baseProbability: 0.4 },
    { name: 'Heart Failure', baseProbability: 0.3 }
  ]
};

// Expanded drug-symptom interactions with severity levels
const adrMapping: { [key: string]: Array<{ drug: string; reaction: string; baseSeverity: string }> } = {
  headache: [
    { drug: 'Aspirin', reaction: 'Stomach irritation', baseSeverity: 'moderate' },
    { drug: 'Ibuprofen', reaction: 'Gastrointestinal issues', baseSeverity: 'moderate' },
    { drug: 'Paracetamol', reaction: 'Liver stress', baseSeverity: 'low' }
  ],
  dizziness: [
    { drug: 'Antidepressants', reaction: 'Blood pressure changes', baseSeverity: 'moderate' },
    { drug: 'Beta blockers', reaction: 'Fatigue', baseSeverity: 'moderate' },
    { drug: 'Antihistamines', reaction: 'Drowsiness', baseSeverity: 'low' }
  ],
  nausea: [
    { drug: 'Antibiotics', reaction: 'Stomach upset', baseSeverity: 'moderate' },
    { drug: 'NSAIDs', reaction: 'Gastric irritation', baseSeverity: 'high' }
  ]
};

export function generateAIInsights(symptoms: Symptom[]): AIInsights {
  if (!Array.isArray(symptoms) || symptoms.length === 0) {
    throw new Error('Invalid symptoms data provided');
  }

  try {
    // Calculate severity score (1-10)
    const severityScore = Math.min(
      10,
      symptoms.reduce((score, symptom) => {
        if (!symptom.severity || !symptom.duration) {
          console.warn('Incomplete symptom data:', symptom);
          return score;
        }

        const severityMultiplier = 
          symptom.severity === 'severe' ? 3 :
          symptom.severity === 'moderate' ? 2 : 1;
        
        const durationMultiplier = 
          symptom.duration.includes('month') ? 2 :
          symptom.duration.includes('week') ? 1.5 : 1;
        
        return score + (severityMultiplier * durationMultiplier);
      }, 0)
    );

    // Predict diseases with improved probability calculation
    const predictedDiseases = symptoms
      .flatMap(s => {
        const mappings = diseaseMapping[s.name.toLowerCase()];
        if (!mappings) {
          console.warn(`No disease mappings found for symptom: ${s.name}`);
          return [];
        }
        return mappings;
      })
      .reduce((acc: { name: string; probability: number }[], disease) => {
        const existingDisease = acc.find(d => d.name === disease.name);
        if (existingDisease) {
          existingDisease.probability = Math.min(
            1,
            existingDisease.probability + 0.2
          );
        } else {
          const severityBoost = severityScore / 20; // Convert 1-10 scale to 0.05-0.5 boost
          acc.push({
            name: disease.name,
            probability: Math.min(1, disease.baseProbability + severityBoost)
          });
        }
        return acc;
      }, [])
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 3);

    // Enhanced ADR prediction
    const possibleADRs = symptoms
      .flatMap(s => {
        const adrs = adrMapping[s.name.toLowerCase()];
        if (!adrs) return [];
        
        return adrs.map(adr => {
          const severityIncrease = severityScore > 7 ? 1 : 
                                severityScore > 5 ? 0 : -1;
          
          const severityMap: Record<string, string[]> = {
            'low': ['low', 'moderate'],
            'moderate': ['moderate', 'high'],
            'high': ['high', 'high']
          };
          
          const baseIndex = severityMap[adr.baseSeverity]?.[0] === 'low' ? 0 :
                          severityMap[adr.baseSeverity]?.[0] === 'moderate' ? 1 : 2;
          
          const finalIndex = Math.max(0, Math.min(2, baseIndex + severityIncrease));
          const severityLevels = ['low', 'moderate', 'high'];
          
          return {
            ...adr,
            severity: severityLevels[finalIndex]
          };
        });
      });

    // Calculate consultation time with complexity factors
    const baseTime = 15;
    const complexityFactor = Math.min(2, 1 + (symptoms.length * 0.2));
    const severityFactor = 1 + (severityScore * 0.1);
    const estimatedConsultationTime = Math.round(baseTime * complexityFactor * severityFactor);

    // Calculate impact factors with weighted severity
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
  } catch (error) {
    console.error('Error generating AI insights:', error);
    throw error;
  }
}
