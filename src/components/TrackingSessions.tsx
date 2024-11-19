'use client';

import { collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { LocationRecord } from '@/types/location';
import { Loading } from './Loading';
import { SessionCard } from './SessionCard';

interface ProcessedSession {
  guid: string;
  startTime: number;
  endTime: number;
  averageSpeed: number;
  maxSpeed: number;
  distance: number;
  locations: LocationRecord[];
}

interface TrackingSessionsProps {
  onLoadingChange: (isLoading: boolean) => void;
}

export function TrackingSessions({ onLoadingChange }: TrackingSessionsProps) {
  const [sessions, setSessions] = useState<ProcessedSession[]>([]);
  const [loading, setLoading] = useState(true);

  const processLocations = (locations: LocationRecord[]): ProcessedSession[] => {
    const sessionMap = new Map<string, LocationRecord[]>();
    
    locations.forEach(location => {
      const sessionId = location.trackingId || location.guid;
      const existingLocations = sessionMap.get(sessionId) || [];
      sessionMap.set(sessionId, [...existingLocations, location]);
    });

    return Array.from(sessionMap.entries())
      .filter(([_, locs]) => locs.length > 1)
      .map(([guid, locs]) => {
        const sortedLocations = locs.sort((a, b) => a.timestamp - b.timestamp);
        
        const speeds = sortedLocations.map(loc => loc.speed);
        const maxSpeed = Math.max(...speeds);
        const averageSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;
        
        let totalDistance = 0;
        for (let i = 1; i < sortedLocations.length; i++) {
          const prev = sortedLocations[i - 1];
          const curr = sortedLocations[i];
          totalDistance += calculateDistance(
            prev.latitude, prev.longitude,
            curr.latitude, curr.longitude
          );
        }

        return {
          guid,
          startTime: sortedLocations[0].timestamp,
          endTime: sortedLocations[sortedLocations.length - 1].timestamp,
          averageSpeed,
          maxSpeed,
          distance: totalDistance,
          locations: sortedLocations
        };
      })
      .sort((a, b) => b.startTime - a.startTime);
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  useEffect(() => {
    async function fetchLocations() {
      try {
        setLoading(true);
        const locationsRef = collection(db, 'locations');
        const q = query(locationsRef, orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const locationsData: LocationRecord[] = [];
        querySnapshot.forEach((doc) => {
          locationsData.push({ ...doc.data(), id: doc.id } as LocationRecord);
        });
        
        const processedSessions = processLocations(locationsData);
        setSessions(processedSessions);
      } catch (error) {
        console.error('Erro ao buscar localizações:', error);
      } finally {
        setLoading(false);
        onLoadingChange(false);
      }
    }

    fetchLocations();
  }, [onLoadingChange]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {sessions.map((session, index) => (
        <SessionCard key={index} session={session} />
      ))}
    </div>
  );
} 