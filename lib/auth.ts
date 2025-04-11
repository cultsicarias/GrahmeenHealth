import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Doctor from "@/models/Doctor";
import Patient from "@/models/Patient";
import { hardcodedDoctors, getDoctorById } from "@/lib/hardcodedDoctors";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.warn("Missing credentials - email or password not provided");
          throw new Error("Email and password are required");
        }

        try {
          console.log(`Login attempt for: ${credentials.email}`);
          
          // Check if this is a hardcoded doctor first
          const hardcodedDoctor = hardcodedDoctors.find(
            doctor => doctor.email.toLowerCase() === credentials.email.toLowerCase()
          );

          if (hardcodedDoctor) {
            console.log(`Authenticated hardcoded doctor: ${hardcodedDoctor.name}`);
            // For demo purposes, accept any password for hardcoded doctors
            // In a real application, you would validate against a stored hash
            return {
              id: hardcodedDoctor._id,
              name: hardcodedDoctor.name,
              email: hardcodedDoctor.email,
              role: 'doctor',
              profileId: hardcodedDoctor._id,
              isHardcoded: true
            };
          }

          // Connect to MongoDB for regular users
          await connectDB();

          // Find user by email
          const user = await User.findOne({ 
            email: credentials.email.toLowerCase() 
          });

          if (!user) {
            console.warn(`No user found with email: ${credentials.email}`);
            throw new Error("No user found with this email");
          }

          console.log(`Found user: ${user.name}, role: ${user.role}, id: ${user._id}`);

          // Verify password
          const isPasswordValid = await compare(credentials.password, user.password);

          if (!isPasswordValid) {
            console.warn(`Invalid password for user: ${user.email}`);
            throw new Error("Invalid password");
          }

          // Get role-specific data
          let roleData = null;
          let profileId = null;
          
          try {
            if (user.role === 'patient') {
              console.log(`Looking up patient profile for user ${user._id}`);
              roleData = await Patient.findOne({ userId: user._id });
              if (roleData) {
                profileId = roleData._id.toString();
                console.log(`Found patient profile: ${profileId}`);
              } else {
                console.warn(`No patient profile found for user ${user._id}`);
              }
            } else if (user.role === 'doctor') {
              console.log(`Looking up doctor profile for user ${user._id}`);
              roleData = await Doctor.findOne({ userId: user._id });
              if (roleData) {
                profileId = roleData._id.toString();
                console.log(`Found doctor profile: ${profileId}`);
              } else {
                console.warn(`No doctor profile found for user ${user._id}`);
              }
            }
          } catch (profileError) {
            console.error("Error fetching user profile:", profileError);
            // Don't throw error here, we can still authenticate the user without profile
          }

          // Create the session user
          const sessionUser = {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            profileId: profileId,
            isHardcoded: false
          };
          
          console.log(`Authentication successful for ${user.email}`, sessionUser);

          // Return the authenticated user
          return sessionUser;
        } catch (error) {
          console.error("Authentication error:", error);
          throw new Error(error instanceof Error ? error.message : "Authentication failed");
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.profileId = user.profileId;
        token.isHardcoded = user.isHardcoded;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.profileId = token.profileId as string;
        session.user.isHardcoded = token.isHardcoded as boolean;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || "YOUR_FALLBACK_SECRET",
};

// Augment next-auth types
declare module "next-auth" {
  interface User {
    role: string;
    profileId?: string | null;
    isHardcoded?: boolean;
  }
  
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      profileId?: string | null;
      isHardcoded?: boolean;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    profileId?: string | null;
    isHardcoded?: boolean;
  }
} 