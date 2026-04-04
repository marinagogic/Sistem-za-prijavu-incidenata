import ModeratorSidebar from "../../components/moderator/ModeratorSidebar";
import ModeratorTopbar from "../../components/moderator/ModeratorTopbar";
import "./ModeratorDashboardPage.css";

function ModeratorDashboardPage() {
  return (
    <div className="moderator-layout">
      <ModeratorSidebar />

      <main className="moderator-main">
        <ModeratorTopbar title="Moderator panel - Početna" />

        <section className="moderator-hero-card">
          <div className="moderator-hero-left">
            <span className="moderator-badge">Moderator dashboard</span>
            <h3>Pregled prijava i brza moderatorska obrada</h3>
            <p>
              Ovdje moderator može pregledati neodobrene incidente, pratiti prijave
              i upravljati objavom incidenata.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ModeratorDashboardPage;