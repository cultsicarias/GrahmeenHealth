'use client';

import { useState } from 'react';

interface HospitalMapProps {
  onClose: () => void;
}

interface Hospital {
  name: string;
  coordinates: string;
  type: string;
  address: string;
  phone?: string;
  specialities?: string[];
  distance: string;
}

const HospitalMap = ({ onClose }: HospitalMapProps) => {
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null);

  // Current location coordinates
  const currentLocation = "12.900599583218849,77.49649742518235";

  const hospitals: Hospital[] = [
    {
      name: "Your Current Location",
      coordinates: currentLocation,
      type: "Current Location",
      address: "Your current position",
      distance: "0 km"
    },
    {
      name: "BGS Global Hospital",
      coordinates: "12.903119762598125,77.49745591271339",
      type: "Multi-Specialty Hospital",
      address: "67, Uttarahalli Road, Kengeri, Bengaluru",
      phone: "080 2849 3333",
      specialities: ["Cardiology", "Neurology", "Orthopedics", "Transplant", "Oncology"],
      distance: "4.2 km"
    },
    {
      name: "Sparsh Hospital",
      coordinates: "12.8912,77.5850",
      type: "Orthopedic Hospital",
      address: "29/P2, Infantry Road, Bengaluru",
      phone: "080 2222 2222",
      specialities: ["Orthopedics", "Sports Medicine", "Joint Replacement"],
      distance: "4.1 km"
    },
    {
      name: "Narayana Health",
      coordinates: "12.908311541594493,77.64344902242856",
      type: "Cardiac Hospital",
      address: "258/A, Bommasandra Industrial Area, Hosur Road, Bengaluru",
      phone: "080 6750 6900",
      specialities: ["Cardiology", "Cardiac Surgery", "Pediatric Cardiology"],
      distance: "8.2 km"
    },
    {
      name: "Rainbow Children's Hospital",
      coordinates: "12.9050,77.4985",
      type: "Pediatric Hospital",
      address: "78, Marathahalli Road, Bengaluru",
      phone: "080 4530 2222",
      specialities: ["Pediatrics", "Neonatology", "Pediatric Surgery"],
      distance: "4.3 km"
    },
    {
      name: "Manipal Hospital",
      coordinates: "12.9060,77.4990",
      type: "Multi-Specialty Hospital",
      address: "98, HAL Airport Road, Kodihalli, Bengaluru",
      phone: "080 2502 4444",
      specialities: ["Cardiology", "Neurology", "Orthopedics", "Oncology"],
      distance: "4.5 km"
    },
    {
      name: "Apollo Hospital",
      coordinates: "12.9721,77.5951",
      type: "Multi-Specialty Hospital",
      address: "154, Bannerghatta Road, Bengaluru",
      phone: "080 2630 4050",
      specialities: ["Cardiology", "Neurology", "Pediatrics", "Gynecology"],
      distance: "8.5 km"
    },
    {
      name: "Fortis Hospital",
      coordinates: "12.9706,77.5936",
      type: "Multi-Specialty Hospital",
      address: "154, Bannerghatta Road, Bengaluru",
      phone: "080 6621 4444",
      specialities: ["Cardiology", "Neurology", "Orthopedics", "Transplant"],
      distance: "8.3 km"
    }
  ];

  const getMapUrl = (coordinates: string) => {
    const [lat, lon] = coordinates.split(',');
    // If it's the current location, just show the location
    if (coordinates === currentLocation) {
      return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${lat},${lon}&zoom=15`;
    }
    // For hospitals, show directions from current location
    const [currentLat, currentLon] = currentLocation.split(',');
    return `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=${currentLat},${currentLon}&destination=${lat},${lon}&mode=driving&zoom=13`;
  };

  const handleHospitalSelect = (coordinates: string) => {
    setSelectedHospital(coordinates);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-4 w-[90vw] h-[80vh] relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-[1000] bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Close
        </button>
        
        <div className="flex h-full gap-4">
          {/* Hospital List */}
          <div className="w-1/4 bg-gray-50 rounded-lg p-4 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Nearby Hospitals</h2>
            <div className="space-y-2">
              {hospitals.map((hospital, index) => (
                <button
                  key={index}
                  onClick={() => handleHospitalSelect(hospital.coordinates)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    selectedHospital === hospital.coordinates
                      ? 'bg-blue-500 text-white'
                      : 'bg-white hover:bg-blue-50 text-gray-800'
                  }`}
                >
                  <h3 className="font-semibold">{hospital.name}</h3>
                  <p className="text-sm opacity-80">{hospital.type}</p>
                  {hospital.distance && (
                    <p className="text-sm font-medium text-green-600 mt-1">
                      Distance: {hospital.distance}
                    </p>
                  )}
                  {hospital.specialities && (
                    <div className="mt-2">
                      <p className="text-xs font-medium mb-1">Specialities:</p>
                      <div className="flex flex-wrap gap-1">
                        {hospital.specialities.map((speciality, idx) => (
                          <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {speciality}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Map */}
          <div className="w-3/4 bg-gray-100 rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={getMapUrl(selectedHospital || currentLocation)}
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalMap; 