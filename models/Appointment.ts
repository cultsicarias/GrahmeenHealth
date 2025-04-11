import mongoose, { Schema } from 'mongoose';

export interface AppointmentDocument extends mongoose.Document {
  patientId: mongoose.Types.ObjectId;
  doctorId: string;
  doctorName: string;
  date: Date;
  time: string;
  symptoms: string;
  severity: string;
  duration: string;
  reason: string;
  previousTreatments?: string;
  allergies?: string;
  currentMedications?: string;
  additionalNotes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<AppointmentDocument>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: String, required: true },
    doctorName: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    symptoms: { type: String, required: true },
    severity: { type: String, required: true },
    duration: { type: String, required: true },
    reason: { type: String },
    previousTreatments: { type: String },
    allergies: { type: String },
    currentMedications: { type: String },
    additionalNotes: { type: String },
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