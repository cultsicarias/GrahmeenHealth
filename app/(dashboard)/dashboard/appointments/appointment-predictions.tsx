'use client';

interface PredictionProps {
  symptoms: Array<{ name: string; severity: string }>;
}

// Simulated AI predictions based on symptoms
export function getAppointmentPredictions(symptoms: PredictionProps['symptoms']) {
  // Map common symptoms to likely conditions and durations
  const symptomMap: { [key: string]: { diseases: string[]; duration: number; impact: number } } = {
    'Chest pain': { 
      diseases: ['Angina', 'Myocardial Infarction', 'Costochondritis'],
      duration: 30  ,
      impact: 9
    },
    'Fever': { 
      diseases: ['Viral Infection', 'COVID-19', 'Influenza'],
      duration: 15,
      impact: 6
    },
    'Cough': { 
      diseases: ['Bronchitis', 'Upper Respiratory Infection'],
      duration: 10,
      impact: 4
    },
    'Back pain': { 
      diseases: ['Muscle Strain', 'Herniated Disc', 'Sciatica'],
      duration: 20,
      impact: 7
    },
    'Headache': { 
      diseases: ['Migraine', 'Tension Headache', 'Sinusitis'],
      duration: 20,
      impact: 5
    }
  };

  let maxImpact = 0;
  let totalDuration = 0; // Base duration
  let potentialDiseases = new Set<string>();

  symptoms.forEach(symptom => {
    const prediction = symptomMap[symptom.name];
    if (prediction) {
      // Add duration based on severity
      const severityMultiplier = 
        symptom.severity === 'Severe' ? 1.3 :
        symptom.severity === 'Moderate' ? 1.2 : 1;
      
      totalDuration += prediction.duration * severityMultiplier;
      maxImpact = Math.max(maxImpact, prediction.impact);
      prediction.diseases.forEach(disease => potentialDiseases.add(disease));
    }
  });

  // Get top 2 most likely diseases
  const predictedDiseases = Array.from(potentialDiseases).slice(0, 2);

  return {
    duration: Math.round(totalDuration),
    diseases: predictedDiseases,
    impact: maxImpact
  };
}

export function getImpactColor(impact: number) {
  if (impact >= 8) return 'text-red-600 bg-red-50';
  if (impact >= 6) return 'text-orange-600 bg-orange-50';
  if (impact >= 4) return 'text-yellow-600 bg-yellow-50';
  return 'text-green-600 bg-green-50';
}

export function getDurationColor(duration: number) {
  if (duration >= 45) return 'text-purple-600 bg-purple-50';
  if (duration >= 30) return 'text-blue-600 bg-blue-50';
  return 'text-green-600 bg-green-50';
}
