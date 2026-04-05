import { useNavigate } from "react-router-dom";

function AdminTopbar({ title }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <div className="topbar">
      <h2>{title}</h2>

      <div className="topbar-actions">
        <span className="btn btn-soft" style={{ cursor: "default" }}>
          Admin
        </span>

        <button type="button" className="btn btn-primary" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default AdminTopbar;