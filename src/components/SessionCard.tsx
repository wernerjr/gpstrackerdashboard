'use client';

import { useState } from 'react';
import { MapModal } from './MapModal';
import { TrackingSession } from '@/types/location';
import { formatDate, formatSpeed, formatDistance, formatDuration } from '@/utils/format';

interface SessionCardProps {
  session: TrackingSession;
}

export function SessionCard({ session }: SessionCardProps) {
  const [isMapOpen, setIsMapOpen] = useState(false);

  return (
    <>
      <div 
        className="bg-neutral-900/90 rounded-xl border border-primary-900/50 p-4 hover:border-primary-700/50 transition-colors cursor-pointer"
        onClick={() => setIsMapOpen(true)}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">
              {formatDate(session.startTime)}
            </h3>
            <p className="text-primary-400 mt-1">
              {formatDuration(session.startTime, session.endTime)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col justify-between">
            <p className="text-gray-400 text-sm">Velocidade Média</p>
            <p className="text-primary-400 text-lg font-semibold">
              {formatSpeed(session.averageSpeed)}
            </p>
          </div>
          <div className="flex flex-col justify-between">
            <p className="text-gray-400 text-sm">Velocidade Máxima</p>
            <p className="text-primary-400 text-lg font-semibold">
              {formatSpeed(session.maxSpeed)}
            </p>
          </div>
          <div className="flex flex-col justify-between">
            <p className="text-gray-400 text-sm">Distância Total</p>
            <p className="text-primary-400 text-lg font-semibold">
              {formatDistance(session.distance)}
            </p>
          </div>
        </div>
      </div>

      <MapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        locations={session.locations}
        startTime={session.startTime}
        maxSpeed={session.maxSpeed}
        averageSpeed={session.averageSpeed}
        distance={session.distance}
      />
    </>
  );
} 