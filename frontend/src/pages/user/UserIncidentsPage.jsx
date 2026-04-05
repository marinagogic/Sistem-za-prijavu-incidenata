import { useEffect, useState } from "react";
import UserSidebar from "../../components/user/UserSidebar";
import UserTopbar from "../../components/user/UserTopbar";
import IncidentFilters from "../../components/guest/IncidentFilters";
import IncidentMap from "../../components/guest/IncidentMap";
import { getApprovedIncidents } from "../../services/incidentService";
import "../guest/IncidentsPage.css";

function UserIncidentsPage() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    type: "",
    subtype: "",
    timeRange: "all",
    locationText: "",
  });

  useEffect(() => {
    const loadIncidents = async () => {
      setLoading(true);

      try {
        const response = await getApprovedIncidents(filters);
        setIncidents(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Greška pri učitavanju incidenata:", error);
        setIncidents([]);
      } finally {
        setLoading(false);
      }
    };

    loadIncidents();
  }, [filters]);

  const center = incidents.length
    ? [Number(incidents[0].latitude), Number(incidents[0].longitude)]
    : [44.7722, 17.191];

  return (
    <div className="incidents-layout">
      <UserSidebar />

      <main className="incidents-main">
        <UserTopbar title="Korisnički panel - Mapa incidenata" />

        <IncidentFilters filters={filters} setFilters={setFilters} />

        <div className="incidents-content">
          <div className="incidents-map-card">
            <div className="incidents-section-header">
              <h3>Javna mapa odobrenih incidenata</h3>
              <p>Ovdje se prikazuju odobrene prijave sa mogućnošću filtriranja.</p>
            </div>

            <div className="incidents-map-wrapper">
              <IncidentMap
                center={center}
                zoom={13}
                markers={incidents}
                className="incidents-map"
              />
            </div>
          </div>

          <div className="incidents-list-card">
            <div className="incidents-section-header">
              <h3>Lista incidenata</h3>
              <p>
                {loading ? "Učitavanje..." : `Prikazano incidenata: ${incidents.length}`}
              </p>
            </div>

            <div className="incident-list">
              {!loading && incidents.length === 0 && (
                <div className="incident-item empty">
                  Nema incidenata za izabrane filtere.
                </div>
              )}

              {incidents.map((incident) => (
                <div className="incident-item" key={incident.id}>
                  <h4>
                    {incident.type} {incident.subtype ? `- ${incident.subtype}` : ""}
                  </h4>
                  <p><strong>Adresa:</strong> {incident.address}</p>
                  <p><strong>Opis:</strong> {incident.description}</p>
                  <p><strong>Koordinate:</strong> {incident.latitude}, {incident.longitude}</p>
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

export default UserIncidentsPage;