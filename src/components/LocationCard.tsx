import { LocationRecord } from '@/types/location';

interface LocationCardProps {
  location: LocationRecord;
}

export function LocationCard({ location }: LocationCardProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('pt-BR');
  };

  const formatSpeed = (speed: number) => {
    return `${(speed).toFixed(1)} km/h`; // Convertendo m/s para km/h
  };

  const formatCoordinates = (value: number) => {
    return value.toFixed(6);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Localização
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Data: {formatDate(location.timestamp)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ID: {location.guid}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-blue-500">
            {formatSpeed(location.speed)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Precisão: {location.accuracy.toFixed(1)}m
          </p>
        </div>
      </div>

      <div className="border-t pt-4 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Latitude</p>
            <p className="text-lg font-semibold text-gray-800 dark:text-white">
              {formatCoordinates(location.latitude)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Longitude</p>
            <p className="text-lg font-semibold text-gray-800 dark:text-white">
              {formatCoordinates(location.longitude)}
            </p>
          </div>
        </div>
      </div>

      {location.trackingId && (
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Tracking ID: {location.trackingId}
        </div>
      )}
    </div>
  );
} 