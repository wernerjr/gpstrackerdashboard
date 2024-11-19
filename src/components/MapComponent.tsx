import { LocationRecord } from '@/types/location';
import { GoogleMap, Polyline, Marker } from '@react-google-maps/api';
import { useCallback } from 'react';

interface MapComponentProps {
  locations: LocationRecord[];
}

const mapContainerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '0.5rem'
};

const mapOptions = {
  mapTypeId: 'roadmap',
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  zoomControl: true,
  styles: [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#38414e" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212a37" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9ca5b3" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#746855" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#1f2835" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#f3d19c" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#515c6d" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#17263c" }],
    },
  ],
};

export function MapComponent({ locations }: MapComponentProps) {
  const coordinates = locations.map(loc => ({
    lat: loc.latitude,
    lng: loc.longitude
  }));

  const center = coordinates[0] || { lat: -23.550520, lng: -46.633308 };

  const onLoad = useCallback((map: google.maps.Map) => {
    const bounds = new google.maps.LatLngBounds();
    coordinates.forEach(coord => bounds.extend(coord));
    map.fitBounds(bounds);
  }, [coordinates]);

  return (
    <div className="w-full h-[500px] relative">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={15}
        options={mapOptions}
        onLoad={onLoad}
      >
        <Polyline
          path={coordinates}
          options={{
            strokeColor: '#3b82f6',
            strokeOpacity: 1.0,
            strokeWeight: 4,
            geodesic: true
          }}
        />
        <Marker 
          position={coordinates[0]} 
          label={{
            text: "Início",
            className: "text-white font-semibold",
            color: "white"
          }}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#22c55e",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#ffffff",
          }}
        />
        <Marker 
          position={coordinates[coordinates.length - 1]} 
          label={{
            text: "Fim",
            className: "text-white font-semibold",
            color: "white"
          }}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#ef4444",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#ffffff",
          }}
        />
      </GoogleMap>
    </div>
  );
} 