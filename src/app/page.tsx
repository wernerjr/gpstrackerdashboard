'use client';

import { useState } from 'react';
import { Suspense } from 'react';
import { TrackingSessions } from '@/components/TrackingSessions';
import { Header } from '@/components/Header';
import { Loading } from '@/components/Loading';

export default function Dashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDataChange = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header onDataChange={handleDataChange} />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
          GPS Tracking Dashboard
        </h1>
        
        <Suspense fallback={<Loading />}>
          <TrackingSessions key={refreshKey} />
        </Suspense>
      </main>
    </div>
  );
} 