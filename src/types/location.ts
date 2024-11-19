export interface LocationRecord {
  guid: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  speed: number;
  timestamp: number;
  trackingId: string | null;
}

export interface TrackingSession {
  locations: LocationRecord[];
  startTime: number;
  endTime: number;
  distance: number;
  maxSpeed: number;
  averageSpeed: number;
} 