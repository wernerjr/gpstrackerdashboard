import { LocationRecord } from '@/types/location';
import { MapComponent } from './MapComponent';
import { formatDistance, formatSpeed, formatDate } from '@/utils/format';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  locations: LocationRecord[];
  startTime: Date;
  maxSpeed: number;
  averageSpeed: number;
  distance: number;
}

export function MapModal({ isOpen, onClose, locations, startTime, maxSpeed, averageSpeed, distance }: MapModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100]">
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full h-[calc(100vh-2rem)] md:w-[95%] md:h-[95vh] md:rounded-2xl bg-gray-900/95 border border-gray-800 shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 md:p-6 flex justify-between items-center border-b border-gray-800/50 bg-gray-900/95 backdrop-blur-md">
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
            {/* Mapa */}
            <div className="flex-1 rounded-xl overflow-hidden border border-gray-800/50 relative min-h-[400px] md:min-h-0">
              <MapComponent locations={locations} />
              
              {/* Stats Overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-gray-900/90 backdrop-blur-sm rounded-lg border border-gray-800/50 p-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Velocidade Média</p>
                    <p className="text-blue-400 text-lg font-bold">
                      {formatSpeed(averageSpeed)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Velocidade Máxima</p>
                    <p className="text-blue-400 text-lg font-bold">
                      {formatSpeed(maxSpeed)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Distância Total</p>
                    <p className="text-blue-400 text-lg font-bold">
                      {formatDistance(distance)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Side Panel */}
            <div className="w-full md:w-80 bg-gray-800/30 rounded-xl border border-gray-800/50 flex flex-col min-h-0">
              <h4 className="text-lg font-semibold text-white p-4 border-b border-gray-800/50">
                Pontos do Trajeto
              </h4>
              <div className="flex-1 p-4 modal-sidebar scroll-container">
                <div className="space-y-3">
                  {locations.map((location, index) => (
                    <div 
                      key={`${location.guid}-${index}`}
                      className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50"
                    >
                      <p className="text-sm text-gray-300">Ponto {index + 1}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Lat: {location.latitude.toFixed(6)}
                      </p>
                      <p className="text-xs text-gray-400">
                        Long: {location.longitude.toFixed(6)}
                      </p>
                      <p className="text-xs text-blue-400 mt-1">
                        {formatSpeed(location.speed * 3.6)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 