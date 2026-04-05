import { NavLink } from "react-router-dom";

function UserSidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <NavLink
          to="/user"
          end
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Početna
        </NavLink>

        <NavLink
          to="/user/report"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Prijavi incident
        </NavLink>

        <NavLink
          to="/user/incidents"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Mapa incidenata
        </NavLink>

        <NavLink
          to="/user/profile"
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

export default UserSidebar;