import { NavLink } from "react-router-dom";

function GuestSidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Početna
        </NavLink>

        <NavLink
          to="/report"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Prijavi incident
        </NavLink>

        <NavLink
          to="/incidents"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Mapa incidenata
        </NavLink>
      </nav>
    </aside>
  );
}

export default GuestSidebar;