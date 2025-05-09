import mongoose, { Schema } from 'mongoose';


export interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
  name: string;
  role: 'patient' | 'doctor' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    email: { 
      type: String, 
      required: true, 
      unique: true,
      trim: true,
      lowercase: true
    },
    password: { 
      type: String, 
      required: true 
    },
    name: { 
      type: String, 
      required: true 
    },
    role: { 
      type: String, 
      required: true, 
      enum: ['patient', 'doctor', 'admin'],
      default: 'patient'
    }
  },
  { timestamps: true }
);

// Don't recreate model if it already exists
const User = mongoose.models.User || mongoose.model<UserDocument>('User', userSchema);

export default User; 
