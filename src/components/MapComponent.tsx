import { LocationRecord } from '@/types/location';
import { GoogleMap, Polyline, Marker } from '@react-google-maps/api';
import { useMemo, useCallback } from 'react';

interface MapComponentProps {
  locations: LocationRecord[];
}

interface PathSegment {
  path: { lat: number; lng: number }[];
  color: string;
}

export function MapComponent({ locations }: MapComponentProps) {
  const { center, bounds } = useMemo(() => {
    if (locations.length === 0) {
      return {
        center: { lat: 0, lng: 0 },
        bounds: null
      };
    }

    const bounds = new google.maps.LatLngBounds();
    
    locations.forEach(location => {
      bounds.extend({
        lat: location.latitude,
        lng: location.longitude
      });
    });

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    const latDiff = (ne.lat() - sw.lat()) * 0.1;
    const lngDiff = (ne.lng() - sw.lng()) * 0.1;
    
    bounds.extend({
      lat: ne.lat() + latDiff,
      lng: ne.lng() + lngDiff
    });
    bounds.extend({
      lat: sw.lat() - latDiff,
      lng: sw.lng() - lngDiff
    });

    return {
      center: {
        lat: (bounds.getNorthEast().lat() + bounds.getSouthWest().lat()) / 2,
        lng: (bounds.getNorthEast().lng() + bounds.getSouthWest().lng()) / 2
      },
      bounds
    };
  }, [locations]);

  const onLoad = useCallback((map: google.maps.Map) => {
    if (bounds) {
      map.fitBounds(bounds);
    }
  }, [bounds]);

  const mapOptions = useMemo(() => ({
    mapTypeId: 'roadmap',
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    zoomControl: false,
    styles: [
      {
        featureType: "all",
        elementType: "labels.text.fill",
        stylers: [{ color: "#ffffff" }]
      },
      {
        featureType: "all",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#000000" }, { lightness: 13 }]
      },
      {
        featureType: "administrative",
        elementType: "geometry.fill",
        stylers: [{ color: "#000000" }]
      },
      {
        featureType: "administrative",
        elementType: "geometry.stroke",
        stylers: [{ color: "#144b53" }, { lightness: 14 }, { weight: 1.4 }]
      },
      {
        featureType: "landscape",
        elementType: "all",
        stylers: [{ color: "#08304b" }]
      },
      {
        featureType: "poi",
        elementType: "geometry",
        stylers: [{ color: "#0c4152" }, { lightness: 5 }]
      },
      {
        featureType: "road.highway",
        elementType: "geometry.fill",
        stylers: [{ color: "#000000" }]
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#0b434f" }, { lightness: 25 }]
      },
      {
        featureType: "road.arterial",
        elementType: "geometry.fill",
        stylers: [{ color: "#000000" }]
      },
      {
        featureType: "road.arterial",
        elementType: "geometry.stroke",
        stylers: [{ color: "#0b3d51" }, { lightness: 16 }]
      },
      {
        featureType: "road.local",
        elementType: "geometry",
        stylers: [{ color: "#000000" }]
      },
      {
        featureType: "transit",
        elementType: "all",
        stylers: [{ color: "#146474" }]
      },
      {
        featureType: "water",
        elementType: "all",
        stylers: [{ color: "#021019" }]
      },
    ],
  }), []);

  const polylineOptions = useMemo(() => ({
    strokeColor: '#3b82f6',
    strokeOpacity: 0.8,
    strokeWeight: 3,
  }), []);

  const maxTrackSpeed = useMemo(() => {
    return Math.max(...locations.map(loc => loc.speed * 3.6));
  }, [locations]);

  const getColorForSpeed = useCallback((speed: number): string => {
    const minSpeed = 0;
    const maxSpeed = maxTrackSpeed * 1.1;
    
    const normalizedSpeed = Math.min(Math.max((speed - minSpeed) / (maxSpeed - minSpeed), 0), 1);
    
    const colors = [
      { pos: 0, color: '#22c55e' },     // Verde
      { pos: 0.15, color: '#16a34a' },  // Verde escuro
      { pos: 0.3, color: '#84cc16' },   // Verde-limão
      { pos: 0.45, color: '#eab308' },  // Amarelo
      { pos: 0.6, color: '#f97316' },   // Laranja
      { pos: 0.75, color: '#ea580c' },  // Laranja escuro
      { pos: 0.9, color: '#dc2626' },   // Vermelho
      { pos: 1, color: '#991b1b' }      // Vermelho escuro
    ];
    
    let startColor, endColor;
    for (let i = 0; i < colors.length - 1; i++) {
      if (normalizedSpeed <= colors[i + 1].pos) {
        startColor = colors[i];
        endColor = colors[i + 1];
        break;
      }
    }
    
    if (!startColor || !endColor) {
      return colors[colors.length - 1].color;
    }
    
    const colorPos = (normalizedSpeed - startColor.pos) / (endColor.pos - startColor.pos);
    
    const start = {
      r: parseInt(startColor.color.slice(1, 3), 16),
      g: parseInt(startColor.color.slice(3, 5), 16),
      b: parseInt(startColor.color.slice(5, 7), 16)
    };
    
    const end = {
      r: parseInt(endColor.color.slice(1, 3), 16),
      g: parseInt(endColor.color.slice(3, 5), 16),
      b: parseInt(endColor.color.slice(5, 7), 16)
    };
    
    const r = Math.round(start.r + (end.r - start.r) * colorPos);
    const g = Math.round(start.g + (end.g - start.g) * colorPos);
    const b = Math.round(start.b + (end.b - start.b) * colorPos);
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }, [maxTrackSpeed]);

  const pathSegments = useMemo(() => {
    const segments: PathSegment[] = [];
    
    for (let i = 0; i < locations.length - 1; i++) {
      const speed = locations[i].speed * 3.6;
      segments.push({
        path: [
          { lat: locations[i].latitude, lng: locations[i].longitude },
          { lat: locations[i + 1].latitude, lng: locations[i + 1].longitude }
        ],
        color: getColorForSpeed(speed)
      });
    }
    
    return segments;
  }, [locations, getColorForSpeed]);

  const SpeedLegend = () => (
    <div className="absolute bottom-4 left-4 bg-neutral-900/90 p-3 rounded-lg border border-primary-900/50">
      <div className="space-y-2">
        <div className="text-xs text-gray-300 font-medium">Velocidade</div>
        <div className="flex items-center space-x-2">
          <div className="h-2 w-32 rounded bg-gradient-to-r from-[#22c55e] via-[#eab308] to-[#991b1b]" />
          <div className="flex justify-between text-xs text-gray-400 w-full">
            <span>0</span>
            <span>{Math.round(maxTrackSpeed)} km/h</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <GoogleMap
      mapContainerClassName="w-full h-full"
      center={center}
      zoom={14}
      options={mapOptions}
      onLoad={onLoad}
    >
      {pathSegments.map((segment, index) => (
        <Polyline
          key={index}
          path={segment.path}
          options={{
            strokeColor: segment.color,
            strokeOpacity: 1.0,
            strokeWeight: 4,
          }}
        />
      ))}

      {locations.length > 0 && (
        <>
          <Marker
            position={{
              lat: locations[0].latitude,
              lng: locations[0].longitude
            }}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#22c55e',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            }}
            title="Início"
          />
          <Marker
            position={{
              lat: locations[locations.length - 1].latitude,
              lng: locations[locations.length - 1].longitude
            }}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#991b1b',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            }}
            title="Fim"
          />
        </>
      )}

      <SpeedLegend />
    </GoogleMap>
  );
} 