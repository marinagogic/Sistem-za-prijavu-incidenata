import { useEffect, useState } from "react";
import UserSidebar from "../../components/user/UserSidebar";
import UserTopbar from "../../components/user/UserTopbar";
import { getUserById, updateUser } from "../../services/userService";
import "../moderator/ModeratorProfilePage.css";

function UserProfilePage() {
  const [formData, setFormData] = useState({
    id: "",
    username: "",
    role: "",
    firstName: "",
    lastName: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        setMessage("Nedostaje userId u localStorage.");
        setLoading(false);
        return;
      }

      try {
        const response = await getUserById(userId);
        const user = response.data;

        setFormData({
          id: user.id || "",
          username: user.username || "",
          role: user.role || "",
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
        });
      } catch (error) {
        console.error("Greška pri učitavanju profila:", error);
        setMessage("Greška pri učitavanju profila.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

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
      const payload = {
        id: formData.id,
        username: formData.username,
        role: formData.role,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      };

      const response = await updateUser(formData.id, payload);
      const updated = response.data;

      setFormData({
        id: updated.id || "",
        username: updated.username || "",
        role: updated.role || "",
        firstName: updated.firstName || "",
        lastName: updated.lastName || "",
        email: updated.email || "",
      });

      setMessage("Podaci su uspješno ažurirani.");
    } catch (error) {
      console.error("Greška pri ažuriranju profila:", error);
      setMessage(error?.response?.data || "Greška pri ažuriranju profila.");
    }
  };

  return (
    <div className="moderator-profile-layout">
      <UserSidebar />

      <main className="moderator-profile-main">
        <UserTopbar title="Korisnički panel - Profil" />

        <section className="moderator-profile-card">
          <div className="moderator-profile-header">
            <h3>Moj profil</h3>
            <p>Pregled i izmjena osnovnih korisničkih podataka.</p>
          </div>

          {message && <div className="moderator-profile-message">{message}</div>}

          {loading ? (
            <div className="moderator-profile-loading">Učitavanje profila...</div>
          ) : (
            <form onSubmit={handleSubmit} className="moderator-profile-form">
              <div className="moderator-profile-grid">
                <div className="moderator-profile-field">
                  <label>Korisničko ime</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="moderator-profile-field">
                  <label>Uloga</label>
                  <input type="text" name="role" value={formData.role} disabled />
                </div>

                <div className="moderator-profile-field">
                  <label>Ime</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="moderator-profile-field">
                  <label>Prezime</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="moderator-profile-field full-width">
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

              <div className="moderator-profile-actions">
                <button type="submit" className="btn btn-primary">
                  Sačuvaj izmjene
                </button>
              </div>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}

export default UserProfilePage;