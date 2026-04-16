import { useEffect, useState } from "react";
import ModeratorSidebar from "../../components/moderator/ModeratorSidebar";
import ModeratorTopbar from "../../components/moderator/ModeratorTopbar";
import IncidentFilters from "../../components/guest/IncidentFilters";
import IncidentMap from "../../components/guest/IncidentMap";
import { getApprovedIncidents } from "../../services/incidentService";
import { translateText } from "../../services/translationService";
import "../../pages/guest/IncidentsPage.css";

function ModeratorApprovedPage() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [translations, setTranslations] = useState({});

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
        const loadedIncidents = Array.isArray(response.data) ? response.data : [];

        setIncidents(loadedIncidents);

        const translatedMap = {};

        for (const incident of loadedIncidents) {
          const originalText = incident.description || "";

          if (!originalText.trim()) {
            translatedMap[incident.id] = "";
            continue;
          }

          const translated = await translateText(originalText);
          translatedMap[incident.id] = translated;
        }

        setTranslations(translatedMap);
      } catch (error) {
        console.error("Greška pri učitavanju odobrenih incidenata:", error);
        setIncidents([]);
        setTranslations({});
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
      <ModeratorSidebar />

      <main className="incidents-main">
        <ModeratorTopbar title="Moderator panel - Odobreni incidenti" />

        <IncidentFilters filters={filters} setFilters={setFilters} />

        <div className="incidents-content">
          <div className="incidents-map-card">
            <div className="incidents-section-header">
              <h3>Mapa odobrenih incidenata</h3>
              <p>
                Pregled javno odobrenih prijava sa filterima za moderatora.
              </p>
            </div>

            <div className="incidents-map-wrapper">
              <IncidentMap
                center={center}
                zoom={13}
                markers={incidents}
                translations={translations}
                className="incidents-map"
              />
            </div>
          </div>

          <div className="incidents-list-card">
            <div className="incidents-section-header">
              <h3>Lista odobrenih incidenata</h3>
              <p>
                {loading
                  ? "Učitavanje..."
                  : `Prikazano incidenata: ${incidents.length}`}
              </p>
            </div>

            <div className="incident-list">
              {!loading && incidents.length === 0 && (
                <div className="incident-item empty">
                  Nema incidenata za izabrane filtere.
                </div>
              )}

              {incidents.map((incident) => {
                const imageUrl = incident.imagePath
                  ? `http://localhost:8080${incident.imagePath}`
                  : null;

                return (
                  <div className="incident-item" key={incident.id}>
                    <h4>
                      {incident.type} {incident.subtype ? `- ${incident.subtype}` : ""}
                    </h4>

                    {imageUrl && (
                      <div className="incident-image-wrapper">
                        <img
                          src={imageUrl}
                          alt="Slika incidenta"
                          className="incident-image"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      </div>
                    )}

                    <p><strong>Adresa:</strong> {incident.address}</p>
                    <p><strong>Opis (original):</strong> {incident.description}</p>
                    <p>
                      <strong>Description (EN):</strong>{" "}
                      {translations[incident.id] || "Prevod nije dostupan."}
                    </p>
                    <p>
                      <strong>Koordinate:</strong> {incident.latitude}, {incident.longitude}
                    </p>
                    {incident.createdAt && (
                      <p><strong>Vrijeme:</strong> {incident.createdAt}</p>
                    )}
                    {incident.status && (
                      <p><strong>Status:</strong> {incident.status}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ModeratorApprovedPage;