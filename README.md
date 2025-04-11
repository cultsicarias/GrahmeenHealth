# VaidyaCare - Smart Care Assistant

A modern healthcare platform designed to help doctors manage patient data efficiently and detect potential health issues early. This system enables doctors to track patient symptoms, identify adverse drug reactions, and prioritize appointments based on severity.

## Project Overview

VaidyaCare is a web application built with Next.js, MongoDB, and TypeScript, designed for two primary user types:

### For Doctors
- Secure dashboard to manage patient information
- Smart appointment scheduling with priority-based queueing
- Early detection of adverse drug reactions (ADRs)
- Patient history and medical records tracking
- Auto-generated reports and handoff sheets

### For Patients
- Easy appointment booking with symptom tracking
- Medication management and reminders
- Visual representation of symptom trends over time
- Medical history documentation

## Key Features

- **Smart Symptom Tracking**: Record structured symptom data with severity, duration, and other relevant information.
- **ADR Detection System**: Automatically flag potential adverse drug reactions based on patient symptoms and medication history.
- **Priority-Based Appointments**: Intelligent algorithm to assign emergency ratings (0-10) based on symptom severity.
- **Estimated Appointment Duration**: Automatically calculate approximate consultation time based on symptoms and conditions.
- **Early Warning System**: Predict potential conditions based on reported symptoms.

## Technology Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Node.js, Next.js API Routes
- **Database**: MongoDB
- **Authentication**: NextAuth.js
- **Type Safety**: TypeScript

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- MongoDB instance (local or Atlas)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/riya-healthcare.git
cd riya-healthcare
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

4. Start the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## Project Structure

```
riya-healthcare/
├── app/                  # Next.js app directory
│   ├── (auth)/           # Authentication pages (login, register)
│   ├── (dashboard)/      # Dashboard pages
│   ├── api/              # API routes
│   └── page.tsx          # Landing page
├── components/           # Reusable UI components
├── lib/                  # Utility functions and libraries
│   ├── adrDetection.ts   # Adverse Drug Reaction detection
│   ├── earlyDetection.ts # Early symptom detection and analysis
│   └── mongodb.ts        # MongoDB connection utility
├── models/               # MongoDB schema models
├── public/               # Static assets
└── tailwind.config.js    # TailwindCSS configuration
```

## Intelligent Features Explained

### ADR Detection

The system uses a predefined medication database to:
- Detect potential drug-drug interactions
- Identify symptoms that may be related to adverse drug reactions
- Flag dangerous medication combinations

### Symptom Analysis

For each symptom collected, the system:
- Evaluates severity based on patient input
- Considers duration and intensity
- Cross-references with existing conditions
- Suggests possible diagnoses for the physician to consider

### Emergency Rating

Appointments are automatically assigned a priority score (0-10) based on:
- Symptom severity
- Known high-risk combinations
- Patient history and risk factors
- Duration of symptoms

## Future Enhancements

- Integration with wearable health devices
- Machine learning for improved symptom analysis
- Voice-to-text for easier data entry
- Mobile application development
- Integration with hospital EHR systems
- Telemedicine features

## License

This project is licensed under the MIT License - see the LICENSE file for details.
