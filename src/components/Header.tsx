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
    <header className="fixed top-0 left-0 right-0 bg-gray-900 border-b border-gray-800 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-white">GPS Tracker</h1>
        </div>
        
        <button
          onClick={removeSessionsWithFewRecords}
          disabled={isRemoving}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          {isRemoving ? 'Removendo...' : 'Remover Sessões Incompletas'}
        </button>
      </div>
    </header>
  );
} 