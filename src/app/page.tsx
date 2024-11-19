import { Suspense } from 'react';
import { TrackingSessions } from '@/components/TrackingSessions';
import { Header } from '@/components/Header';
import { Loading } from '@/components/Loading';

export default function Dashboard() {
  console.log('Renderizando Dashboard');
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
          GPS Tracking Dashboard
        </h1>
        
        <Suspense fallback={<Loading />}>
          <TrackingSessions />
        </Suspense>
      </main>
    </div>
  );
} 