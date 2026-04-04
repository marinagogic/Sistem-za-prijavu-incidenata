import { useEffect, useState } from "react";
import ModeratorSidebar from "../../components/moderator/ModeratorSidebar";
import ModeratorTopbar from "../../components/moderator/ModeratorTopbar";
import IncidentMap from "../../components/guest/IncidentMap";
import {
  approveIncident,
  getPendingIncidents,
  rejectIncident,
} from "../../services/incidentService";
import "./ModeratorPendingPage.css";

function ModeratorPendingPage() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadPendingIncidents = async () => {
    setLoading(true);
    try {
      const response = await getPendingIncidents();
      setIncidents(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      console.error("Greška pri učitavanju pending incidenata:", error);
      setIncidents([]);
      setMessage("Greška pri učitavanju pending incidenata.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingIncidents();
  }, []);

  const handleApprove = async (id) => {
    setMessage("");

    try {
      await approveIncident(id);
      setMessage("Incident je uspješno odobren.");
      setIncidents((prev) => prev.filter((incident) => incident.id !== id));
    } catch (error) {
      console.error("Greška pri odobravanju incidenta:", error);
      setMessage("Greška pri odobravanju incidenta.");
    }
  };

  const handleReject = async (id) => {
    setMessage("");

    try {
      await rejectIncident(id);
      setMessage("Incident je uspješno odbijen.");
      setIncidents((prev) => prev.filter((incident) => incident.id !== id));
    } catch (error) {
      console.error("Greška pri odbijanju incidenta:", error);
      setMessage("Greška pri odbijanju incidenta.");
    }
  };

  const center = incidents.length
    ? [Number(incidents[0].latitude), Number(incidents[0].longitude)]
    : [44.7722, 17.191];

  return (
    <div className="moderator-pending-layout">
      <ModeratorSidebar />

      <main className="moderator-pending-main">
        <ModeratorTopbar title="Moderator panel - Neodobrene prijave" />

        {message && <div className="moderator-message">{message}</div>}

        <div className="moderator-pending-content">
          <div className="moderator-pending-map-card">
            <div className="moderator-pending-header">
              <h3>Mapa neodobrenih prijava</h3>
              <p>
                {loading
                  ? "Učitavanje..."
                  : `Prikazano pending prijava: ${incidents.length}`}
              </p>
            </div>

            <div className="moderator-pending-map-wrapper">
              <IncidentMap
                center={center}
                zoom={13}
                markers={incidents}
                className="moderator-pending-map"
              />
            </div>
          </div>

          <div className="moderator-pending-list-card">
            <div className="moderator-pending-header">
              <h3>Lista neodobrenih prijava</h3>
              <p>Moderator može odmah odobriti ili odbiti prijavu.</p>
            </div>

            <div className="moderator-pending-list">
              {!loading && incidents.length === 0 && (
                <div className="moderator-pending-item empty">
                  Nema neodobrenih prijava.
                </div>
              )}

              {incidents.map((incident) => (
                <div className="moderator-pending-item" key={incident.id}>
                  <h4>
                    {incident.type}{" "}
                    {incident.subtype ? `- ${incident.subtype}` : ""}
                  </h4>

                  <p><strong>Adresa:</strong> {incident.address}</p>
                  <p><strong>Opis:</strong> {incident.description}</p>
                  <p>
                    <strong>Koordinate:</strong> {incident.latitude},{" "}
                    {incident.longitude}
                  </p>

                  {incident.createdAt && (
                    <p><strong>Vrijeme:</strong> {incident.createdAt}</p>
                  )}

                  {incident.imagePath && (
                    <p><strong>Slika:</strong> {incident.imagePath}</p>
                  )}

                  <div className="moderator-pending-actions">
                    <button
                      type="button"
                      className="btn btn-soft"
                      onClick={() => handleReject(incident.id)}
                    >
                      Odbij
                    </button>

                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => handleApprove(incident.id)}
                    >
                      Odobri
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ModeratorPendingPage;