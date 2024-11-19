'use client';

import { useState } from 'react';
import { collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { LocationRecord } from '@/types/location';

interface HeaderProps {
  onDataChange: () => void;
}

export function Header({ onDataChange }: HeaderProps) {
  const [isRemoving, setIsRemoving] = useState(false);

  const removeSessionsWithFewRecords = async () => {
    setIsRemoving(true);
    try {
      const locationsRef = collection(db, 'locations');
      const q = query(locationsRef, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const locations: LocationRecord[] = [];
      querySnapshot.forEach((doc) => {
        locations.push({ ...doc.data(), docId: doc.id } as LocationRecord & { docId: string });
      });

      const sessionMap = new Map<string, (LocationRecord & { docId: string })[]>();
      locations.forEach(location => {
        const sessionId = location.trackingId || location.guid;
        const existingLocations = sessionMap.get(sessionId) || [];
        sessionMap.set(sessionId, [...existingLocations, location as LocationRecord & { docId: string }]);
      });

      const docsToRemove = Array.from(sessionMap.entries())
        .filter(([, locs]) => locs.length < 10)
        .flatMap(([, locs]) => locs.map(loc => loc.docId));

      for (const docId of docsToRemove) {
        await deleteDoc(doc(db, 'locations', docId));
      }

      onDataChange();
    } catch (error) {
      console.error('Erro ao remover registros:', error);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center">
            <svg 
              className="h-8 w-8 text-blue-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
              />
            </svg>
            <span className="ml-2 text-xl font-semibold text-white">
              GPS Tracker
            </span>
          </div>
          
          <button
            onClick={removeSessionsWithFewRecords}
            disabled={isRemoving}
            className="px-4 py-2 text-sm font-medium text-white bg-red-500/80 hover:bg-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isRemoving ? 'Removendo...' : 'Remover Sessões < 10 registros'}
          </button>
        </nav>
      </div>
    </header>
  );
} 