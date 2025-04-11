import mongoose, { Schema } from 'mongoose';

interface Symptom {
  name: string;
  severity: string;
  duration: string;
}

interface AdditionalInfo {
  allergies?: string;
  currentMedications?: string;
  previousTreatments?: string;
  additionalNotes?: string;
}

export interface AppointmentDocument extends mongoose.Document {
  patientId: mongoose.Types.ObjectId;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  symptoms: Symptom[];
  additionalInfo: AdditionalInfo;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const symptomSchema = new Schema<Symptom>({
  name: { type: String, required: true },
  severity: { type: String, required: true },
  duration: { type: String, required: true }
});

const additionalInfoSchema = new Schema<AdditionalInfo>({
  allergies: String,
  currentMedications: String,
  previousTreatments: String,
  additionalNotes: String
});

const appointmentSchema = new Schema<AppointmentDocument>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    patientName: { type: String, required: true },
    doctorId: { type: String, required: true },
    doctorName: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    symptoms: { type: [symptomSchema], required: true },
    additionalInfo: { type: additionalInfoSchema, default: {} },
    status: { 
      type: String, 
      required: true, 
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'scheduled'
    }
  },
  { timestamps: true }
);

// Add indexes for better performance
appointmentSchema.index({ patientId: 1 });
appointmentSchema.index({ doctorId: 1 });
appointmentSchema.index({ date: 1 });
appointmentSchema.index({ status: 1 });

export default mongoose.models.Appointment || 
  mongoose.model<AppointmentDocument>('Appointment', appointmentSchema);