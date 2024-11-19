'use client';

import { useState, useEffect } from 'react';
import { LoadScript } from '@react-google-maps/api';
import { Header } from './Header';
import { TrackingSessions } from './TrackingSessions';
import { Loading } from './Loading';

export function TrackingSessionsWrapper() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDataChange = () => {
    setIsLoading(true);
    setRefreshKey(prev => prev + 1);
  };

  if (!mounted) {
    return <Loading />;
  }

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
      <>
        <Header onDataChange={handleDataChange} />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
            Sessões de Rastreamento
          </h1>
          
          {isLoading && <Loading />}
          <TrackingSessions 
            key={refreshKey} 
            onLoadingChange={setIsLoading}
          />
        </div>
      </>
    </LoadScript>
  );
} 