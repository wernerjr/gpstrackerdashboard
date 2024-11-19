import { LocationRecord } from '@/types/location';
import { GoogleMap, Polyline, Marker } from '@react-google-maps/api';
import { useMemo, useCallback } from 'react';

interface MapComponentProps {
  locations: LocationRecord[];
}

export function MapComponent({ locations }: MapComponentProps) {
  const center = useMemo(() => {
    if (locations.length === 0) return { lat: 0, lng: 0 };
    const midPoint = Math.floor(locations.length / 2);
    return {
      lat: locations[midPoint].latitude,
      lng: locations[midPoint].longitude
    };
  }, [locations]);

  const mapOptions = useMemo(() => ({
    mapTypeId: 'roadmap',
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    zoomControl: true,
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

  return (
    <GoogleMap
      mapContainerClassName="w-full h-full"
      center={center}
      zoom={14}
      options={mapOptions}
    >
      {/* Linha do trajeto */}
      <Polyline
        path={locations.map(loc => ({ lat: loc.latitude, lng: loc.longitude }))}
        options={polylineOptions}
      />

      {/* Marcadores de início e fim */}
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