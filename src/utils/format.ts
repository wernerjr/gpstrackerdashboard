export function formatDistance(meters: number | undefined | null): string {
  if (meters === undefined || meters === null) return '0m';
  if (meters < 1000) {
    return `${meters.toFixed(0)}m`;
  }
  return `${(meters / 1000).toFixed(2)}km`;
}

export function formatSpeed(kmh: number | undefined | null): string {
  if (kmh === undefined || kmh === null) return '0.0 km/h';
  return `${kmh.toFixed(1)} km/h`;
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatDuration(startTime: number, endTime: number): string {
  const durationInSeconds = Math.floor((endTime - startTime) / 1000);
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  const seconds = durationInSeconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}min`);
  if (seconds > 0) parts.push(`${seconds}s`);

  return parts.join(' ');
} 