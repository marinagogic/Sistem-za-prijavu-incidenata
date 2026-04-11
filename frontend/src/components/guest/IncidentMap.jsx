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
  const validMarkers = markers.filter(
    (marker) =>
      marker.latitude !== null &&
      marker.latitude !== undefined &&
      marker.longitude !== null &&
      marker.longitude !== undefined
  );

  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} className={className}>
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ClickHandler onMapClick={onMapClick} />

      {validMarkers.map((marker) => {
        const imageUrl = marker.imagePath
          ? `http://localhost:8080${marker.imagePath}`
          : null;

        return (
          <Marker
            key={marker.id}
            position={[Number(marker.latitude), Number(marker.longitude)]}
          >
            <Popup maxWidth={260} minWidth={220}>
              <div className="incident-popup">
                <div className="incident-popup-title">
                  {marker.type || "Incident"}
                  {marker.subtype ? ` - ${marker.subtype}` : ""}
                </div>

                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Slika incidenta"
                    className="incident-popup-image"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                )}

                {marker.address && (
                  <p><strong>Adresa:</strong> {marker.address}</p>
                )}

                {marker.description && (
                  <p><strong>Opis:</strong> {marker.description}</p>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default IncidentMap;