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
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: true,
  streetViewControl: false,
  fullscreenControl: true,
  styles: [
    {
      featureType: 'all',
      elementType: 'geometry',
      stylers: [{ color: '#242f3e' }]
    },
    {
      featureType: 'all',
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#242f3e' }]
    },
    {
      featureType: 'all',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#746855' }]
    }
  ]
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
            strokeWeight: 3,
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
            url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
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
            url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
          }}
        />
      </GoogleMap>
    </div>
  );
} 