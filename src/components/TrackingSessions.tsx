'use client';

import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { useEffect, useState, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { LocationRecord, TrackingSession } from '@/types/location';
import { SessionCard } from './SessionCard';
import { Loading } from './Loading';

interface TrackingSessionsProps {
  onLoadingChange?: (loading: boolean) => void;
}

export function TrackingSessions({ onLoadingChange }: TrackingSessionsProps) {
  const [sessions, setSessions] = useState<TrackingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const processLocations = useCallback((locations: LocationRecord[]): TrackingSession[] => {
    const sessionMap = new Map<string, LocationRecord[]>();
    
    locations.forEach(location => {
      const sessionId = location.trackingId || location.guid;
      const existingLocations = sessionMap.get(sessionId) || [];
      sessionMap.set(sessionId, [...existingLocations, location]);
    });

    return Array.from(sessionMap.entries())
      .map(([, sessionLocations]) => {
        const sortedLocations = sessionLocations.sort((a, b) => a.timestamp - b.timestamp);
        
        let totalDistance = 0;
        let maxSpeed = 0;
        let totalSpeed = 0;

        for (let i = 1; i < sortedLocations.length; i++) {
          const prev = sortedLocations[i - 1];
          const curr = sortedLocations[i];
          
          totalDistance += calculateDistance(
            prev.latitude,
            prev.longitude,
            curr.latitude,
            curr.longitude
          );

          maxSpeed = Math.max(maxSpeed, curr.speed);
          totalSpeed += curr.speed;
        }

        return {
          locations: sortedLocations,
          startTime: sortedLocations[0].timestamp,
          endTime: sortedLocations[sortedLocations.length - 1].timestamp,
          distance: totalDistance,
          maxSpeed: maxSpeed, // Convertendo para km/h
          averageSpeed: (totalSpeed / sortedLocations.length) // Convertendo para km/h
        };
      })
      .sort((a, b) => b.startTime - a.startTime);
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const locationsRef = collection(db, 'locations');
        const q = query(locationsRef, orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const locationsData: LocationRecord[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          locationsData.push({
            ...data,
            trackingId: data.trackingId || null
          } as LocationRecord);
        });
        
        const processedSessions = processLocations(locationsData);
        setSessions(processedSessions);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao carregar os dados. Por favor, tente novamente.');
      } finally {
        setLoading(false);
        onLoadingChange?.(false);
      }
    };

    fetchLocations().catch(console.error);
  }, [processLocations, onLoadingChange]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // raio da Terra em metros
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // em metros
  };

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="h-[calc(100vh-12rem)] modern-scroll">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-1">
        {sessions.map((session) => (
          <SessionCard key={session.startTime} session={session} />
        ))}
      </div>
    </div>
  );
} 