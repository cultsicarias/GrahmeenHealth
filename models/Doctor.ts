import mongoose, { Schema } from 'mongoose';
import { UserDocument } from './User';

export interface DoctorDocument extends mongoose.Document {
  userId: UserDocument['_id'];
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
  rating: number;
  reviews: Array<{
    patientId: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    date: Date;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: number;
  }>;
  awards: string[];
  languages: string[];
  consultationFee: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const doctorSchema = new Schema<DoctorDocument>(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
      unique: true
    },
    specialization: { 
      type: String, 
      required: true 
    },
    experience: { 
      type: Number, 
      default: 0 
    },
    qualifications: { 
      type: String, 
      default: '' 
    },
    licenseNumber: { 
      type: String, 
      default: '' 
    },
    availability: {
      days: [{ type: String }],
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '17:00' }
    },
    about: { 
      type: String, 
      default: '' 
    },
    imageUrl: {
      type: String,
      default: ''  // Empty string to use the initial fallback
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5
    },
    reviews: [{
      patientId: { type: Schema.Types.ObjectId, ref: 'User' },
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String },
      date: { type: Date, default: Date.now }
    }],
    education: [{
      degree: { type: String },
      institution: { type: String },
      year: { type: Number }
    }],
    awards: [{ type: String }],
    languages: [{ type: String }],
    consultationFee: {
      type: Number,
      default: 0
    },
    isAvailable: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Don't recreate model if it already exists
const Doctor = mongoose.models.Doctor || mongoose.model<DoctorDocument>('Doctor', doctorSchema);

export default Doctor; 