import { useEffect, useState } from "react";
import ModeratorSidebar from "../../components/moderator/ModeratorSidebar";
import ModeratorTopbar from "../../components/moderator/ModeratorTopbar";
import IncidentMap from "../../components/guest/IncidentMap";
import { getPendingIncidents } from "../../services/incidentService";
import "./ModeratorMapPage.css";

function ModeratorMapPage() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPendingIncidents = async () => {
      try {
        const response = await getPendingIncidents();
        setIncidents(Array.isArray(response?.data) ? response.data : []);
      } catch (error) {
        console.error("Greška pri učitavanju mape prijava:", error);
        setIncidents([]);
      } finally {
        setLoading(false);
      }
    };

    loadPendingIncidents();
  }, []);

  const center = incidents.length
    ? [Number(incidents[0].latitude), Number(incidents[0].longitude)]
    : [44.7722, 17.191];

  return (
    <div className="moderator-map-layout">
      <ModeratorSidebar />

      <main className="moderator-map-main">
        <ModeratorTopbar title="Moderator panel - Mapa prijava" />

        <div className="moderator-map-content">
          <div className="moderator-map-card">
            <div className="moderator-map-header">
              <h3>Mapa neodobrenih prijava</h3>
              <p>
                {loading
                  ? "Učitavanje prijava..."
                  : `Prikazano pending prijava: ${incidents.length}`}
              </p>
            </div>

            <div className="moderator-map-wrapper">
              <IncidentMap
                center={center}
                zoom={13}
                markers={incidents}
                className="moderator-map"
              />
            </div>
          </div>

          <div className="moderator-map-list-card">
            <div className="moderator-map-header">
              <h3>Lista prijava</h3>
              <p>Pregled pending prijava za bržu provjeru.</p>
            </div>

            <div className="moderator-map-list">
              {!loading && incidents.length === 0 && (
                <div className="moderator-map-item empty">
                  Nema pending prijava za prikaz.
                </div>
              )}

              {incidents.map((incident) => (
                <div className="moderator-map-item" key={incident.id}>
                  <h4>
                    {incident.type} {incident.subtype ? `- ${incident.subtype}` : ""}
                  </h4>
                  <p><strong>Adresa:</strong> {incident.address}</p>
                  <p><strong>Opis:</strong> {incident.description}</p>
                  {incident.createdAt && (
                    <p><strong>Vrijeme:</strong> {incident.createdAt}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ModeratorMapPage;