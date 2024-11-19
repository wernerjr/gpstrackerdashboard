import { LocationRecord } from '@/types/location';
import { MapComponent } from './MapComponent';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  locations: LocationRecord[];
}

export function MapModal({ isOpen, onClose, locations }: MapModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl w-full max-w-5xl max-h-[90vh] relative flex flex-col border border-gray-800">
        {/* Header do Modal */}
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">
            Trajeto do Rastreamento
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Conteúdo do Modal */}
        <div className="p-4 flex-1">
          <MapComponent locations={locations} />
        </div>
      </div>
    </div>
  );
} 