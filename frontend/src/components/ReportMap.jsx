import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";

function ChangeView({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, 16);
    }
  }, [center, map]);

  return null;
}

function DraggableMarker({ location, setLocation }) {
  const eventHandlers = {
    dragend(e) {
      const marker = e.target;
      const position = marker.getLatLng();
      setLocation(position);
    },
  };

  return location ? (
    <Marker
      draggable
      eventHandlers={eventHandlers}
      position={location}
    />
  ) : null;
}

export default function ReportMap({
  location,
  setLocation,
  accuracy,
  loading,
}) {
  return (
    <div style={{ position: "relative" }}>
      {loading && (
        <div
          style={{
            position: "absolute",
            zIndex: 1000,
            inset: 0,
            background: "rgba(255,255,255,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
          }}
        >
          Fetching Location...
        </div>
      )}

      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ChangeView center={location} />

        <DraggableMarker
          location={location}
          setLocation={setLocation}
        />

        {location && accuracy && (
          <Circle
            center={location}
            radius={accuracy}
            pathOptions={{ color: "blue", fillOpacity: 0.1 }}
          />
        )}
      </MapContainer>
    </div>
  );
}