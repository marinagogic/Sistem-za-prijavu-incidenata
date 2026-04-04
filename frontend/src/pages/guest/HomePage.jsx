import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import GuestSidebar from "../../components/guest/GuestSidebar";
import GuestTopbar from "../../components/guest/GuestTopbar";
import IncidentMap from "../../components/guest/IncidentMap";
import { getApprovedIncidents } from "../../services/incidentService";
import "./HomePage.css";

function HomePage() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIncidents = async () => {
      setLoading(true);

      try {
        const response = await getApprovedIncidents();
        const approvedIncidents = Array.isArray(response.data) ? response.data : [];

        const validIncidents = approvedIncidents.filter(
          (incident) =>
            incident.latitude !== null &&
            incident.latitude !== undefined &&
            incident.longitude !== null &&
            incident.longitude !== undefined
        );

        setIncidents(validIncidents);
      } catch (error) {
        console.error("Greška pri učitavanju odobrenih incidenata za početnu:", error);
        setIncidents([]);
      } finally {
        setLoading(false);
      }
    };

    loadIncidents();
  }, []);

  const center = incidents.length
    ? [Number(incidents[0].latitude), Number(incidents[0].longitude)]
    : [44.7722, 17.191];

  return (
    <div className="home-layout">
      <GuestSidebar />

      <main className="main-content">
        <GuestTopbar title="Guest dashboard - Početna" />

        <section className="hero-card hero-card-single">
          <div className="hero-left hero-left-full">
            <span className="hero-badge">Sistem za prijavu incidenata</span>
            <h3>Prijavi problem brzo i jednostavno</h3>
            <p>
              Ova aplikacija omogućava anonimnu prijavu incidenata na lokaciji,
              pregled odobrenih prijava na mapi i moderatorsku obradu prijava.
            </p>

            <div className="hero-buttons">
              <Link to="/report" className="btn btn-primary big-btn">
                Prijavi incident
              </Link>
              <Link to="/incidents" className="btn btn-soft big-btn">
                Pogledaj mapu
              </Link>
            </div>
          </div>
        </section>

        <section className="home-map-section">
          <div className="home-map-header">
            <h3>Mapa incidenata</h3>
            <p>
              {loading
                ? "Učitavanje odobrenih incidenata..."
                : `Prikazano odobrenih incidenata: ${incidents.length}`}
            </p>
          </div>

          <div className="home-map-card">
            <IncidentMap
              center={center}
              zoom={13}
              markers={incidents}
              className="home-map"
            />
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;