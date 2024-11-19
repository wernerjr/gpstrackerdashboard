'use client';

import { useState } from 'react';
import { LoadScript } from '@react-google-maps/api';
import { TrackingSessions } from '@/components/TrackingSessions';
import { Header } from '@/components/Header';
import { Loading } from '@/components/Loading';

export default function Dashboard() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const handleDataChange = () => {
    setIsLoading(true);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
        <Header onDataChange={handleDataChange} />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-white mb-8">
            GPS Tracking Dashboard
          </h1>
          
          <TrackingSessions 
            key={refreshKey} 
            onLoadingChange={setIsLoading}
          />
        </div>
      </LoadScript>
    </div>
  );
} 