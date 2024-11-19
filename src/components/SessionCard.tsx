'use client';

import { useState } from 'react';
import { MapModal } from './MapModal';
import { TrackingSession } from '@/types/location';

interface SessionCardProps {
  session: TrackingSession;
}

export function SessionCard({ session }: SessionCardProps) {
  const [isMapOpen, setIsMapOpen] = useState(false);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('pt-BR');
  };

  const formatSpeed = (speed: number) => {
    return `${speed.toFixed(1)} km/h`;
  };

  const formatDistance = (distance: number) => {
    return `${(distance / 1000).toFixed(2)} km`;
  };

  return (
    <>
      <div 
        onClick={() => setIsMapOpen(true)}
        className="bg-gray-900 rounded-xl shadow-lg hover:shadow-blue-500/20 transition-all cursor-pointer border border-gray-800 hover:border-blue-500/50"
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Sessão de Rastreamento
              </h3>
              <div className="space-y-1">
                <p className="text-sm text-gray-400">
                  Início: {formatDate(session.startTime)}
                </p>
                <p className="text-sm text-gray-400">
                  Fim: {formatDate(session.endTime)}
                </p>
                <p className="text-sm text-gray-400">
                  Registros: <span className="text-blue-400">{session.locations.length}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <p className="text-sm text-gray-400 mb-1">
                Velocidade Média
              </p>
              <p className="text-2xl font-bold text-blue-400">
                {formatSpeed(session.averageSpeed)}
              </p>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <p className="text-sm text-gray-400 mb-1">
                Velocidade Máxima
              </p>
              <p className="text-2xl font-bold text-blue-400">
                {formatSpeed(session.maxSpeed)}
              </p>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <p className="text-sm text-gray-400 mb-1">
                Distância Total
              </p>
              <p className="text-2xl font-bold text-blue-400">
                {formatDistance(session.distance)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <MapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        locations={session.locations}
      />
    </>
  );
} 