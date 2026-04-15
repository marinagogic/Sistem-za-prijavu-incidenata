import { useEffect, useState } from "react";
import ModeratorSidebar from "../../components/moderator/ModeratorSidebar";
import ModeratorTopbar from "../../components/moderator/ModeratorTopbar";
import { getSimilarGroups } from "../../services/nlpService";
import "./ModeratorSimilarGroupsPage.css";

function ModeratorSimilarGroupsPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadGroups = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await getSimilarGroups();
      setGroups(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      console.error("Greška pri učitavanju sličnih prijava:", error);
      setGroups([]);
      setMessage("Greška pri učitavanju sličnih prijava.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  return (
    <div className="moderator-similar-layout">
      <ModeratorSidebar />

      <main className="moderator-similar-main">
        <ModeratorTopbar title="Moderator panel - Slične prijave" />

        <section className="moderator-similar-hero-card">
          <div className="moderator-similar-hero-left">
            <span className="moderator-similar-badge">NLP service</span>
            <h3>Grupisane slične prijave</h3>
            <p>
              Ovdje moderator može vidjeti grupe prijava koje imaju sličan
              tekstualni opis i lakše uočiti moguće duplikate ili povezane incidente.
            </p>
          </div>
        </section>

        {message && <div className="moderator-similar-message">{message}</div>}

        <section className="moderator-similar-stats-grid">
          <div className="moderator-similar-stat-card">
            <h4>Ukupno grupa</h4>
            <p className="moderator-similar-stat-number">
              {loading ? "..." : groups.length}
            </p>
          </div>

          <div className="moderator-similar-stat-card">
            <h4>Ukupno prijava u grupama</h4>
            <p className="moderator-similar-stat-number">
              {loading
                ? "..."
                : groups.reduce(
                    (sum, group) => sum + (group.incidents?.length || 0),
                    0
                  )}
            </p>
          </div>
        </section>

        <section className="moderator-similar-list-card">
          <div className="moderator-similar-section-header">
            <h3>Lista grupa sličnih prijava</h3>
            <p>
              {loading
                ? "Učitavanje grupa..."
                : groups.length > 0
                ? `Pronađeno grupa: ${groups.length}`
                : "Nema pronađenih sličnih grupa."}
            </p>
          </div>

          <div className="moderator-similar-groups">
            {!loading && groups.length === 0 && (
              <div className="moderator-similar-group empty">
                Nema sličnih prijava za prikaz.
              </div>
            )}

            {groups.map((group) => (
              <div className="moderator-similar-group" key={group.groupId}>
                <div className="moderator-similar-group-header">
                  <div>
                    <h4>Grupa #{group.groupId}</h4>
                    <p>
                      Prosječna sličnost:{" "}
                      {group.averageSimilarity != null
                        ? `${(group.averageSimilarity * 100).toFixed(1)}%`
                        : "N/A"}
                    </p>
                  </div>

                  <span className="moderator-similar-count">
                    Prijava: {group.incidents?.length || 0}
                  </span>
                </div>

                <div className="moderator-similar-incidents">
                  {(group.incidents || []).map((incident) => {
                    const imageUrl = incident.imagePath
                      ? `http://localhost:8080${incident.imagePath}`
                      : null;

                    return (
                      <div
                        className="moderator-similar-incident-item"
                        key={incident.id}
                      >
                        <h5>
                          {incident.type}
                          {incident.subtype ? ` - ${incident.subtype}` : ""}
                        </h5>

                        {imageUrl && (
                          <div className="moderator-similar-image-wrapper">
                            <img
                              src={imageUrl}
                              alt="Slika incidenta"
                              className="moderator-similar-image"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          </div>
                        )}

                        <p>
                          <strong>ID:</strong> {incident.id}
                        </p>
                        <p>
                          <strong>Status:</strong> {incident.status}
                        </p>
                        <p>
                          <strong>Adresa:</strong> {incident.address}
                        </p>
                        <p>
                          <strong>Opis:</strong> {incident.description}
                        </p>
                        <p>
                          <strong>Koordinate:</strong> {incident.latitude},{" "}
                          {incident.longitude}
                        </p>

                        {incident.createdAt && (
                          <p>
                            <strong>Vrijeme:</strong> {incident.createdAt}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default ModeratorSimilarGroupsPage;