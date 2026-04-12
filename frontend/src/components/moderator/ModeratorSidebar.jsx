import { NavLink } from "react-router-dom";

function ModeratorSidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <NavLink
          to="/moderator"
          end
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Početna
        </NavLink>

        <NavLink
          to="/moderator/pending"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Neodobrene prijave
        </NavLink>

        <NavLink
          to="/moderator/approved"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Odobreni incidenti
        </NavLink>

        <NavLink
          to="/moderator/analytics"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Analitika
        </NavLink>

        <NavLink
          to="/moderator/alerts"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Alert settings
        </NavLink>

        <NavLink
          to="/moderator/profile"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Profil
        </NavLink>
      </nav>
    </aside>
  );
}

export default ModeratorSidebar;