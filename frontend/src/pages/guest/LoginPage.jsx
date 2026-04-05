import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import "./LoginPage.css";

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(window.atob(base64));
  } catch (error) {
    return null;
  }
}

function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await login(formData);

      const token =
        response?.data?.token ||
        response?.data?.jwt ||
        response?.data?.accessToken;

      if (!token) {
        setMessage("Token nije vraćen nakon logina.");
        return;
      }

      localStorage.setItem("token", token);

      const decoded = parseJwt(token);
      console.log("JWT payload:", decoded);

      const role =
        decoded?.role ||
        decoded?.roles?.[0] ||
        decoded?.authorities?.[0] ||
        "";

      const userId =
        decoded?.id ||
        decoded?.userId ||
        decoded?.sub ||
        "";

      const normalizedRole = String(role).replace("ROLE_", "");

      if (normalizedRole) {
        localStorage.setItem("role", normalizedRole);
      }

      if (userId) {
        localStorage.setItem("userId", String(userId));
      }

      if (formData.username) {
        localStorage.setItem("username", formData.username);
      }

      if (normalizedRole === "MODERATOR") {
        navigate("/moderator");
        return;
      }

      if (normalizedRole === "ADMIN") {
        navigate("/admin");
        return;
      }

      navigate("/user");
    } catch (error) {
      setMessage(error?.response?.data || "Login nije uspio.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Login</h2>
        <p>Prijavi se na sistem.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {message && <div className="auth-message">{message}</div>}

          <button type="submit" className="auth-btn">
            Login
          </button>
        </form>

        <div className="auth-links">
          <Link to="/">Nazad na početnu</Link>
          <Link to="/register">Nemaš nalog? Register</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;