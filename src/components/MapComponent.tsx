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
      bounds.extend({ lat: location.latitude, lng: location.longitude });
    });

    const center = {
      lat: (bounds.getNorthEast().lat() + bounds.getSouthWest().lat()) / 2,
      lng: (bounds.getNorthEast().lng() + bounds.getSouthWest().lng()) / 2
    };

    return { center, bounds };
  }, [locations]);

  const onLoad = useCallback((map: google.maps.Map) => {
    if (bounds) {
      map.fitBounds(bounds, {
        padding: { top: 60, right: 60, bottom: 60, left: 60 }
      });

      google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
        if (map.getZoom()! > 16) {
          map.setZoom(16);
        }
      });
    }
  }, [bounds]);

  const mapOptions = useMemo(() => ({
    mapTypeId: 'roadmap',
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    zoomControl: false,
    scaleControl: false,
    rotateControl: false,
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
    return Math.max(...locations.map(loc => loc.speed));
  }, [locations]);

  const getColorForSpeed = (speed: number): string => {
    const minSpeed = 0;
    const maxSpeed = maxTrackSpeed * 1.1;
    
    const normalizedSpeed = Math.min(Math.max((speed - minSpeed) / (maxSpeed - minSpeed), 0), 1);
    
    const colors = [
      { pos: 0, color: '#22c55e' },     // Verde
      { pos: 0.2, color: '#84cc16' },   // Verde-limão
      { pos: 0.4, color: '#eab308' },   // Amarelo
      { pos: 0.6, color: '#f97316' },   // Laranja
      { pos: 0.8, color: '#ea580c' },   // Laranja escuro
      { pos: 1, color: '#dc2626' }      // Vermelho
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
  };

  const pathSegments = useMemo(() => {
    const segments: PathSegment[] = [];
    
    for (let i = 0; i < locations.length - 1; i++) {
      const speed = locations[i].speed;
      segments.push({
        path: [
          { lat: locations[i].latitude, lng: locations[i].longitude },
          { lat: locations[i + 1].latitude, lng: locations[i + 1].longitude }
        ],
        color: getColorForSpeed(speed)
      });
    }
    
    return segments;
  }, [locations]);

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

      <div className="absolute bottom-4 left-4 bg-gray-900/90 p-3 rounded-lg border border-gray-800/50">
        <div className="flex items-center space-x-2">
          <div className="text-xs text-gray-400">Velocidade:</div>
          <div className="w-24 h-2 bg-gradient-to-r from-[#22c55e] via-[#eab308] to-[#dc2626] rounded" />
          <div className="text-xs text-gray-400">{maxTrackSpeed.toFixed(0)} km/h</div>
        </div>
      </div>

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
              fillColor: '#ef4444',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            }}
            title="Fim"
          />
        </>
      )}
    </GoogleMap>
  );
} 