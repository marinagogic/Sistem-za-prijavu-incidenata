import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import UserSidebar from "../../components/user/UserSidebar";
import UserTopbar from "../../components/user/UserTopbar";
import IncidentMap from "../../components/guest/IncidentMap";
import { getApprovedIncidents } from "../../services/incidentService";
import "../guest/HomePage.css";

function UserHomePage() {
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
        console.error("Greška pri učitavanju odobrenih incidenata:", error);
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
      <UserSidebar />

      <main className="main-content">
        <UserTopbar title="Korisnički panel - Početna" />

        <section className="hero-card hero-card-single">
          <div className="hero-left hero-left-full">
            <span className="hero-badge">Sistem za prijavu incidenata</span>
            <h3>Dobro došli u korisnički panel</h3>
            <p>
              Kao registrovani korisnik možeš pregledati odobrene incidente,
              prijaviti novi incident i ažurirati svoje profil podatke.
            </p>

            <div className="hero-buttons">
              <Link to="/user/report" className="btn btn-primary big-btn">
                Prijavi incident
              </Link>
              <Link to="/user/incidents" className="btn btn-soft big-btn">
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

export default UserHomePage;