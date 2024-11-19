'use client';

import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { useEffect, useState, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { LocationRecord, TrackingSession } from '@/types/location';
import { SessionCard } from './SessionCard';
import { Loading } from './Loading';

export function TrackingSessions() {
  const [sessions, setSessions] = useState<TrackingSession[]>([]);
  const [loading, setLoading] = useState(true);

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
          maxSpeed: maxSpeed * 3.6, // Convertendo para km/h
          averageSpeed: (totalSpeed / sortedLocations.length) * 3.6 // Convertendo para km/h
        };
      })
      .sort((a, b) => b.startTime - a.startTime);
  }, []);

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
      }
    }

    fetchLocations();
  }, [processLocations]);

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