import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import "../moderator/ModeratorDashboardPage.css";

function AdminDashboardPage() {
  return (
    <div className="moderator-layout">
      <AdminSidebar />

      <main className="moderator-main">
        <AdminTopbar title="Admin panel - Početna" />

        <section className="moderator-hero-card">
          <div className="moderator-hero-left">
            <span className="moderator-badge">Admin dashboard</span>
            <h3>Pregled korisnika i administracija sistema</h3>
            <p>
              Ovdje admin može upravljati korisnicima, dodavati nove naloge,
              mijenjati profile postojećih korisnika i pregledati svoje osnovne podatke.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboardPage;