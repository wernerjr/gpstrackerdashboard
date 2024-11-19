import { useState, useEffect } from 'react';
import { LocationRecord } from '@/types/location';
import { MapComponent } from './MapComponent';
import { formatDistance, formatSpeed, formatDate } from '@/utils/format';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  locations: LocationRecord[];
  startTime: number;
  maxSpeed: number;
  averageSpeed: number;
  distance: number;
}

export function MapModal({ isOpen, onClose, locations, startTime, maxSpeed, averageSpeed, distance }: MapModalProps) {
  if (!isOpen) return null;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100]">
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full h-[calc(100vh-2rem)] md:w-[95%] md:h-[95vh] md:rounded-2xl bg-neutral-900/95 border border-primary-900/50 shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 md:p-6 flex justify-between items-center border-b border-primary-900/50 bg-neutral-900/95 backdrop-blur-md">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white">
                Detalhes do Trajeto
              </h3>
              {startTime && (
                <p className="text-gray-400 text-sm md:text-base mt-1">
                  {formatDate(startTime)}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors"
              aria-label="Fechar modal"
            >
              <svg className="w-6 h-6 text-gray-400 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col md:flex-row gap-4 p-4 md:p-6 min-h-0">
            {/* Mapa e Stats Container */}
            <div className="flex-1 flex flex-col gap-4">
              {/* Mapa */}
              <div className="flex-1 rounded-xl overflow-hidden border border-primary-900/50 relative min-h-[400px] md:min-h-0">
                <MapComponent locations={locations} />
              </div>
              
              {/* Stats abaixo do mapa */}
              <div className="bg-neutral-800/80 rounded-xl border border-primary-900/50 p-4">
                <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col justify-between">
                        <p className="text-gray-400 text-sm">Velocidade Média</p>
                        <p className="text-primary-400 text-lg font-semibold">
                        {formatSpeed(averageSpeed)}
                        </p>
                    </div>
                    <div className="flex flex-col justify-between">
                        <p className="text-gray-400 text-sm">Velocidade Máxima</p>
                        <p className="text-primary-400 text-lg font-semibold">
                        {formatSpeed(maxSpeed)}
                        </p>
                    </div>
                    <div className="flex flex-col justify-between">
                        <p className="text-gray-400 text-sm">Distância Total</p>
                        <p className="text-primary-400 text-lg font-semibold">
                        {formatDistance(distance)}
                        </p>
                    </div>
                </div>
              </div>
            </div>

            {/* Side Panel */}
            {!isMobile &&
            (            
            <div className="w-full md:w-80 bg-neutral-800/80 rounded-xl border border-primary-900/50 flex flex-col min-h-0">
                <h4 className="text-lg font-semibold text-white p-4 border-b border-primary-900/50">
                  Pontos do Trajeto
                </h4>
                <div className="flex-1 p-4 modal-sidebar scroll-container">
                  <div className="space-y-3">
                    {locations.map((location, index) => (
                      <div 
                        key={`${location.guid}-${index}`}
                        className="bg-neutral-900/50 rounded-lg p-3 border border-primary-900/50"
                      >
                        <p className="text-sm text-gray-300">Ponto {index + 1}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Lat: {location.latitude.toFixed(6)}
                        </p>
                        <p className="text-xs text-gray-400">
                          Long: {location.longitude.toFixed(6)}
                        </p>
                        <p className="text-xs text-primary-400 mt-1">
                          {formatSpeed(location.speed)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
} 