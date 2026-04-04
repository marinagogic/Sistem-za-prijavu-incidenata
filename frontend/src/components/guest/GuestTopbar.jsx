import { Link } from "react-router-dom";

function GuestTopbar({ title }) {
  return (
    <div className="topbar">
      <h2>{title}</h2>

      <div className="topbar-actions">
        <Link to="/login" className="btn btn-outline">
          Login
        </Link>
        <Link to="/register" className="btn btn-primary">
          Register
        </Link>
      </div>
    </div>
  );
}

export default GuestTopbar;