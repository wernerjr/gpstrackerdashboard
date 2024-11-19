import { TrackingSession } from '@/types/location';

interface SessionCardProps {
  session: TrackingSession;
}

export function SessionCard({ session }: SessionCardProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('pt-BR');
  };

  const formatSpeed = (speed: number) => {
    return `${speed.toFixed(1)} km/h`;
  };

  const formatDistance = (distance: number) => {
    return `${(distance / 1000).toFixed(2)} km`; // Convertendo metros para km
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            Sessão de Rastreamento
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Início: {formatDate(session.startTime)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Fim: {formatDate(session.endTime)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Registros: {session.locations.length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Velocidade Média</p>
          <p className="text-lg font-semibold text-gray-800 dark:text-white">
            {formatSpeed(session.averageSpeed)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Velocidade Máxima</p>
          <p className="text-lg font-semibold text-gray-800 dark:text-white">
            {formatSpeed(session.maxSpeed)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Distância Total</p>
          <p className="text-lg font-semibold text-gray-800 dark:text-white">
            {formatDistance(session.distance)}
          </p>
        </div>
      </div>
    </div>
  );
} 