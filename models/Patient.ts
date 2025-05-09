import mongoose, { Schema } from 'mongoose';
import { UserDocument } from './User';

export interface MedicalCondition {
  name: string;
  diagnosedDate?: Date;
  severity?: 'mild' | 'moderate' | 'severe';
  notes?: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  startDate?: Date;
  endDate?: Date;
}

export interface PatientDocument extends mongoose.Document {
  userId: UserDocument['_id'];
  phone?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  bloodGroup?: string;
  height?: number;
  weight?: number;
  allergies?: string[];
  medicalConditions?: MedicalCondition[];
  medications?: Medication[];
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const patientSchema = new Schema<PatientDocument>(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
      unique: true
    },
    phone: { type: String },
    dateOfBirth: { type: Date },
    gender: { 
      type: String, 
      enum: ['male', 'female', 'other'] 
    },
    bloodGroup: { type: String },
    height: { type: Number },
    weight: { type: Number },
    allergies: [{ type: String }],
    medicalConditions: [
      {
        name: { type: String },
        diagnosedDate: { type: Date },
        severity: { 
          type: String, 
          enum: ['mild', 'moderate', 'severe'] 
        },
        notes: { type: String }
      }
    ],
    medications: [
      {
        name: { type: String },
        dosage: { type: String },
        frequency: { type: String },
        startDate: { type: Date },
        endDate: { type: Date }
      }
    ],
    emergencyContact: {
      name: { type: String },
      phone: { type: String },
      relationship: { type: String }
    }
  },
  { timestamps: true }
);

// Don't recreate model if it already exists
const Patient = mongoose.models.Patient || mongoose.model<PatientDocument>('Patient', patientSchema);

export default Patient; 