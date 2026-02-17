import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

function LocationMarker({ location, setLocation }) {
  useMapEvents({
    click(e) {
      setLocation(e.latlng);
    },
  });

  return location ? <Marker position={location} /> : null;
}

export default function ReportMap({ location, setLocation }) {
  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker location={location} setLocation={setLocation} />
    </MapContainer>
  );
}
