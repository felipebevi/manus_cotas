import { useEffect, useRef, useState } from "react";
import { MapView } from "./Map";
import { trpc } from "@/lib/trpc";
import { useI18n } from "@/lib/i18n";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";

interface DevelopmentMarker {
  id: number;
  name: string;
  cityId: number;
  cityName: string;
  lat: number;
  lng: number;
  count: number;
}

export function Globe3D() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [, setLocation] = useLocation();
  const { t } = useI18n();
  const { data: developments, isLoading } = trpc.developments.getAll.useQuery();
  const [markers, setMarkers] = useState<google.maps.marker.AdvancedMarkerElement[]>([]);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);

  const handleMapReady = (map: google.maps.Map) => {
    if (!developments) return;

    // Group developments by city
    const cityGroups = new Map<number, DevelopmentMarker>();
    
    developments.forEach((item) => {
      const cityId = item.city.id;
      if (!cityGroups.has(cityId)) {
        cityGroups.set(cityId, {
          id: item.development.id,
          name: item.development.nameKey,
          cityId: item.city.id,
          cityName: item.city.nameKey,
          lat: parseFloat(item.city.latitude),
          lng: parseFloat(item.city.longitude),
          count: 0,
        });
      }
      const group = cityGroups.get(cityId)!;
      group.count++;
    });

    // Create info window
    const newInfoWindow = new google.maps.InfoWindow();
    setInfoWindow(newInfoWindow);

    // Create markers for each city
    const newMarkers: google.maps.marker.AdvancedMarkerElement[] = [];
    
    cityGroups.forEach((cityData) => {
      const markerDiv = document.createElement('div');
      markerDiv.className = 'city-marker';
      markerDiv.innerHTML = `
        <div style="
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 8px 12px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 14px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          cursor: pointer;
          transition: transform 0.2s;
        " class="marker-content">
          ${cityData.count}
        </div>
      `;

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: { lat: cityData.lat, lng: cityData.lng },
        content: markerDiv,
        title: t(cityData.cityName, cityData.cityName),
      });

      // Hover effect
      markerDiv.addEventListener('mouseenter', () => {
        const content = markerDiv.querySelector('.marker-content') as HTMLElement;
        if (content) {
          content.style.transform = 'scale(1.1)';
        }
        newInfoWindow.setContent(`
          <div style="padding: 8px; font-weight: 500;">
            <strong>${t(cityData.cityName, cityData.cityName)}</strong><br/>
            ${cityData.count} ${t('developments_available', 'developments available')}
          </div>
        `);
        newInfoWindow.open(map, marker);
      });

      markerDiv.addEventListener('mouseleave', () => {
        const content = markerDiv.querySelector('.marker-content') as HTMLElement;
        if (content) {
          content.style.transform = 'scale(1)';
        }
      });

      // Click to navigate to city page
      markerDiv.addEventListener('click', () => {
        setLocation(`/city/${cityData.cityId}`);
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);
  };

  useEffect(() => {
    return () => {
      // Cleanup markers
      markers.forEach(marker => {
        marker.map = null;
      });
      if (infoWindow) {
        infoWindow.close();
      }
    };
  }, [markers, infoWindow]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full h-screen">
      <MapView
        onMapReady={handleMapReady}
        initialCenter={{ lat: 20, lng: 0 }}
        initialZoom={2}
        className="w-full h-full"
      />
    </div>
  );
}
