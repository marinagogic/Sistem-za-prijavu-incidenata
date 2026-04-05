import { useEffect, useMemo, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import { getAllUsers, createEmployee, updateUser } from "../../services/userService";
import "../guest/HomePage.css";
import "./AdminUsersPage.css";

const emptyForm = {
  id: "",
  username: "",
  password: "",
  role: "USER",
  firstName: "",
  lastName: "",
  email: "",
};

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState("create");
  const [formData, setFormData] = useState(emptyForm);

  const visibleUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.role === "USER" ||
        user.role === "MODERATOR" ||
        user.role === "ADMIN"
    );
  }, [users]);

  const loadUsers = async () => {
    setLoading(true);

    try {
      const response = await getAllUsers();
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Greška pri učitavanju korisnika:", error);
      setUsers([]);
      setMessage("Greška pri učitavanju korisnika.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNewUser = () => {
    setMode("create");
    setMessage("");
    setFormData({
      ...emptyForm,
      role: "USER",
    });
  };

  const handleEditUser = (user) => {
    setMode("edit");
    setMessage("");
    setFormData({
      id: user.id || "",
      username: user.username || "",
      password: "",
      role: user.role || "USER",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (mode === "create") {
        const payload = {
          username: formData.username,
          password: formData.password,
          role: formData.role,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
        };

        await createEmployee(payload);

        setFormData({
          ...emptyForm,
          role: "USER",
        });
        setMode("create");
        setMessage("Korisnik je uspješno dodan.");
      } else {
        const payload = {
          id: formData.id,
          username: formData.username,
          role: formData.role,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
        };

        await updateUser(formData.id, payload);
        setMessage("Profil je uspješno ažuriran.");
      }

      await loadUsers();
    } catch (error) {
      console.error("Greška pri čuvanju:", error);
      setMessage(error?.response?.data || "Greška pri čuvanju podataka.");
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <AdminTopbar title="Admin panel - Svi korisnici" />

        {message && <div className="admin-message">{message}</div>}

        <div className="admin-content">
          <section className="admin-list-card">
            <div className="admin-section-header">
              <h3>Pregled korisnika</h3>
              <p>
                {loading
                  ? "Učitavanje..."
                  : `Ukupno prikazano: ${visibleUsers.length}`}
              </p>
            </div>

            <div className="admin-toolbar">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleNewUser}
              >
                Dodaj korisnika
              </button>
            </div>

            <div className="admin-user-list">
              {!loading && visibleUsers.length === 0 && (
                <div className="admin-user-item empty">
                  Nema korisnika za prikaz.
                </div>
              )}

              {visibleUsers.map((user) => (
                <div className="admin-user-item" key={user.id}>
                  <div className="admin-user-top">
                    <div>
                      <h4>{user.username}</h4>
                      <p><strong>Uloga:</strong> {user.role}</p>
                      <p><strong>Ime:</strong> {user.firstName} {user.lastName}</p>
                      <p><strong>Email:</strong> {user.email}</p>
                    </div>

                    <button
                      type="button"
                      className="btn btn-soft"
                      onClick={() => handleEditUser(user)}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="admin-form-card">
            <div className="admin-section-header">
              <h3>
                {mode === "create" ? "Dodavanje korisnika" : "Izmjena profila"}
              </h3>
              <p>
                {mode === "create"
                  ? "Unesi podatke za novog korisnika."
                  : "Ažuriraj podatke postojećeg korisnika."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
              <div className="admin-grid">
                <div className="admin-field">
                  <label>Korisničko ime</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="admin-field">
                  <label>Uloga</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="USER">USER</option>
                    <option value="MODERATOR">MODERATOR</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>

                {mode === "create" && (
                  <div className="admin-field full-width">
                    <label>Lozinka</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}

                <div className="admin-field">
                  <label>Ime</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="admin-field">
                  <label>Prezime</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="admin-field full-width">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="admin-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleNewUser}
                >
                  Reset
                </button>

                <button type="submit" className="btn btn-primary">
                  {mode === "create" ? "Dodaj korisnika" : "Sačuvaj izmjene"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}

export default AdminUsersPage;