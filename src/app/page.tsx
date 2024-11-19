'use client';

import { useState } from 'react';
import { LoadScript } from '@react-google-maps/api';
import { TrackingSessions } from '@/components/TrackingSessions';
import { Header } from '@/components/Header';

export default function Dashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDataChange = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="h-screen overflow-hidden bg-gray-950">
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
        <Header onDataChange={handleDataChange} />
        <main className="container mx-auto px-4 h-[calc(100vh-4rem)] pt-20">
          <h1 className="text-2xl font-bold text-white mb-6">
            Sessões de Rastreamento
          </h1>
          
          <TrackingSessions 
            key={refreshKey} 
          />
        </main>
      </LoadScript>
    </div>
  );
} 