export interface LocationRecord {
  guid: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  speed: number;
  timestamp: number;
  trackingId: string | null;
} 