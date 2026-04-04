import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function ClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick(e.latlng);
      }
    },
  });

  return null;
}

function IncidentMap({
  center = [44.7722, 17.191],
  zoom = 13,
  markers = [],
  onMapClick = null,
  className = "shared-map",
}) {
  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} className={className}>
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ClickHandler onMapClick={onMapClick} />

      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={[Number(marker.latitude), Number(marker.longitude)]}
        >
          <Popup>
            <div>
              <strong>{marker.type || "Incident"}</strong>
              <br />
              {marker.subtype || ""}
              <br />
              {marker.address || ""}
              <br />
              {marker.description || ""}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default IncidentMap;