import { useEffect, useState } from "react";
import ModeratorSidebar from "../../components/moderator/ModeratorSidebar";
import ModeratorTopbar from "../../components/moderator/ModeratorTopbar";
import {
  getAlertSettings,
  updateAlertSettings,
  scanAlerts,
  getAllAlerts,
  getUnreadAlerts,
  getUnreadAlertsCount,
  markAlertAsViewed,
} from "../../services/alertService";
import "./ModeratorAlertsPage.css";

function ModeratorAlertsPage() {
  const [settings, setSettings] = useState({
    lookbackDays: 7,
    radiusMeters: 500,
    timeWindowHours: 24,
    minIncidentCount: 2,
    enabled: true,
  });

  const [allAlerts, setAllAlerts] = useState([]);
  const [unreadAlerts, setUnreadAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [runningScan, setRunningScan] = useState(false);
  const [message, setMessage] = useState("");

  const moderatorId = localStorage.getItem("userId");

  const formatAlertDescription = (alert) => {
    const incidentCount = alert.incidentCount ?? settings.minIncidentCount;
    const timeWindowHours = alert.timeWindowHours ?? settings.timeWindowHours;
    const radiusMeters = alert.radiusMeters ?? settings.radiusMeters;
    const address = alert.address?.trim();

    let timeText = `zadnjih ${timeWindowHours} sati`;

    if (timeWindowHours === 1) {
      timeText = "zadnjem satu";
    } else if (timeWindowHours === 24) {
      timeText = "zadnja 24 sata";
    } else if (timeWindowHours > 24 && timeWindowHours % 24 === 0) {
      const days = timeWindowHours / 24;
      timeText = days === 1 ? "zadnjem danu" : `zadnjih ${days} dana`;
    }

    let incidentText = `${incidentCount} prijava`;
    if (incidentCount === 1) {
      incidentText = "1 prijava";
    }

    let description = `Detektovano je ${incidentText} u ${timeText} u radijusu od ${radiusMeters} m`;

    if (address) {
      description += ` u blizini lokacije: ${address}`;
    }

    description += ".";

    return description;
  };

  const shouldShowSystemMessage = (alert) => {
    if (!alert.message) return false;

    const normalizedMessage = alert.message.trim().toLowerCase();
    const genericMessages = [
      `alert #${alert.id}`.toLowerCase(),
      "alert",
      "novo upozorenje",
      "new alert",
    ];

    return !genericMessages.includes(normalizedMessage);
  };

  const loadAlertsData = async () => {
    if (!moderatorId) {
      setMessage("Nedostaje userId u localStorage.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const [
        settingsResponse,
        allAlertsResponse,
        unreadAlertsResponse,
        unreadCountResponse,
      ] = await Promise.all([
        getAlertSettings(),
        getAllAlerts(moderatorId),
        getUnreadAlerts(moderatorId),
        getUnreadAlertsCount(moderatorId),
      ]);

      const settingsData = settingsResponse?.data || {};
      setSettings({
        lookbackDays: settingsData.lookbackDays ?? 7,
        radiusMeters: settingsData.radiusMeters ?? 500,
        timeWindowHours: settingsData.timeWindowHours ?? 24,
        minIncidentCount: settingsData.minIncidentCount ?? 2,
        enabled: settingsData.enabled ?? true,
      });

      setAllAlerts(
        Array.isArray(allAlertsResponse?.data) ? allAlertsResponse.data : []
      );

      setUnreadAlerts(
        Array.isArray(unreadAlertsResponse?.data) ? unreadAlertsResponse.data : []
      );

      setUnreadCount(
        typeof unreadCountResponse?.data === "number"
          ? unreadCountResponse.data
          : Number(unreadCountResponse?.data) || 0
      );
    } catch (error) {
      console.error("Greška pri učitavanju alert podataka:", error);
      setMessage("Greška pri učitavanju alert podataka.");
      setAllAlerts([]);
      setUnreadAlerts([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlertsData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : Number(value),
    }));
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    setMessage("");

    try {
      await updateAlertSettings(settings);
      setMessage("Alert podešavanja su uspješno sačuvana.");
      await loadAlertsData();
    } catch (error) {
      console.error("Greška pri čuvanju alert podešavanja:", error);
      setMessage("Greška pri čuvanju alert podešavanja.");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleRunScan = async () => {
    setRunningScan(true);
    setMessage("");

    try {
      await scanAlerts();
      setMessage("Detekcija je uspješno pokrenuta.");
      await loadAlertsData();
    } catch (error) {
      console.error("Greška pri pokretanju detekcije:", error);
      setMessage("Greška pri pokretanju detekcije.");
    } finally {
      setRunningScan(false);
    }
  };

  const handleMarkAsViewed = async (alertId) => {
    setMessage("");

    try {
      await markAlertAsViewed(alertId, moderatorId);
      setMessage("Alert je označen kao pregledan.");
      await loadAlertsData();
    } catch (error) {
      console.error("Greška pri označavanju alerta:", error);
      setMessage("Greška pri označavanju alerta kao pregledanog.");
    }
  };

  return (
    <div className="moderator-alerts-layout">
      <ModeratorSidebar />

      <main className="moderator-alerts-main">
        <ModeratorTopbar title="Moderator panel - Alert settings" />

        <section className="moderator-alerts-hero-card">
          <div className="moderator-alerts-hero-left">
            <span className="moderator-alerts-badge">Alert service</span>
            <h3>Podešavanja i obavještenja o sumnjivim prijavama</h3>
            <p>
              Moderator može mijenjati pragove detekcije, ručno pokrenuti
              skeniranje i pregledati generisana upozorenja.
            </p>
          </div>
        </section>

        {message && <div className="moderator-alerts-message">{message}</div>}

        <section className="moderator-alerts-stats-grid">
          <div className="moderator-alerts-stat-card">
            <h4>Ukupno alertova</h4>
            <p className="moderator-alerts-stat-number">
              {loading ? "..." : allAlerts.length}
            </p>
          </div>

          <div className="moderator-alerts-stat-card">
            <h4>Nepročitani alertovi</h4>
            <p className="moderator-alerts-stat-number">
              {loading ? "..." : unreadCount}
            </p>
          </div>

          <div className="moderator-alerts-stat-card">
            <h4>Status sistema</h4>
            <p className="moderator-alerts-stat-text">
              {settings.enabled ? "Uključen" : "Isključen"}
            </p>
          </div>
        </section>

        <section className="moderator-alerts-content-grid">
          <div className="moderator-alerts-card">
            <div className="moderator-alerts-section-header">
              <h3>Alert podešavanja</h3>
              <p>
                Parametri koji određuju kada će sistem prijaviti sumnjivo
                grupisanje incidenata.
              </p>
            </div>

            <form
              onSubmit={handleSaveSettings}
              className="moderator-alerts-form"
            >
              <div className="moderator-alerts-form-grid">
                <div className="moderator-alerts-field">
                  <label>Broj dana praćenja</label>
                  <input
                    type="number"
                    name="lookbackDays"
                    min="1"
                    value={settings.lookbackDays}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="moderator-alerts-field">
                  <label>Radijus (u metrima)</label>
                  <input
                    type="number"
                    name="radiusMeters"
                    min="1"
                    value={settings.radiusMeters}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="moderator-alerts-field">
                  <label>Vremenski prozor (u satima)</label>
                  <input
                    type="number"
                    name="timeWindowHours"
                    min="1"
                    value={settings.timeWindowHours}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="moderator-alerts-field">
                  <label>Minimalan broj prijava</label>
                  <input
                    type="number"
                    name="minIncidentCount"
                    min="1"
                    value={settings.minIncidentCount}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="moderator-alerts-field full-width">
                  <label className="moderator-alerts-checkbox">
                    <input
                      type="checkbox"
                      name="enabled"
                      checked={settings.enabled}
                      onChange={handleChange}
                    />
                    <span>Omogući automatsku detekciju alertova</span>
                  </label>
                </div>
              </div>

              <div className="moderator-alerts-actions">
                <button
                  type="button"
                  className="btn btn-soft"
                  onClick={handleRunScan}
                  disabled={runningScan}
                >
                  {runningScan ? "Pokretanje..." : "Pokreni detekciju"}
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={savingSettings}
                >
                  {savingSettings ? "Čuvanje..." : "Sačuvaj podešavanja"}
                </button>
              </div>
            </form>
          </div>

          <div className="moderator-alerts-card">
            <div className="moderator-alerts-section-header">
              <h3>Nepročitana upozorenja</h3>
              <p>
                Lista alertova koje moderator još nije označio kao pregledane.
              </p>
            </div>

            <div className="moderator-alerts-list">
              {!loading && unreadAlerts.length === 0 && (
                <div className="moderator-alerts-item empty">
                  Nema nepročitanih alertova.
                </div>
              )}

              {unreadAlerts.map((alert, index) => (
                <div
                  className="moderator-alerts-item"
                  key={alert.id ?? `unread-${index}`}
                >
                  <h4>Upozorenje #{alert.id ?? "-"}</h4>

                  <p>
                    <strong>Opis:</strong> {formatAlertDescription(alert)}
                  </p>

                  {shouldShowSystemMessage(alert) && (
                    <p>
                      <strong>Sistemska poruka:</strong> {alert.message}
                    </p>
                  )}

                  {alert.address && (
                    <p>
                      <strong>Lokacija:</strong> {alert.address}
                    </p>
                  )}

                  {alert.radiusMeters && (
                    <p>
                      <strong>Radijus:</strong> {alert.radiusMeters} m
                    </p>
                  )}

                  {alert.timeWindowHours && (
                    <p>
                      <strong>Vremenski prozor:</strong> {alert.timeWindowHours} h
                    </p>
                  )}

                  {alert.incidentCount && (
                    <p>
                      <strong>Broj prijava:</strong> {alert.incidentCount}
                    </p>
                  )}

                  {alert.createdAt && (
                    <p>
                      <strong>Kreirano:</strong> {alert.createdAt}
                    </p>
                  )}

                  <div className="moderator-alerts-item-actions">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => handleMarkAsViewed(alert.id)}
                    >
                      Označi kao pregledano
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="moderator-alerts-card full-width">
            <div className="moderator-alerts-section-header">
              <h3>Svi alertovi</h3>
              <p>Pregled svih generisanih upozorenja za moderatora.</p>
            </div>

            <div className="moderator-alerts-list">
              {!loading && allAlerts.length === 0 && (
                <div className="moderator-alerts-item empty">
                  Nema dostupnih alertova.
                </div>
              )}

              {allAlerts.map((alert, index) => (
                <div
                  className="moderator-alerts-item"
                  key={alert.id ?? `all-${index}`}
                >
                  <h4>Upozorenje #{alert.id ?? "-"}</h4>

                  <p>
                    <strong>Opis:</strong> {formatAlertDescription(alert)}
                  </p>

                  {shouldShowSystemMessage(alert) && (
                    <p>
                      <strong>Sistemska poruka:</strong> {alert.message}
                    </p>
                  )}

                  {alert.address && (
                    <p>
                      <strong>Lokacija:</strong> {alert.address}
                    </p>
                  )}

                  {alert.radiusMeters && (
                    <p>
                      <strong>Radijus:</strong> {alert.radiusMeters} m
                    </p>
                  )}

                  {alert.timeWindowHours && (
                    <p>
                      <strong>Vremenski prozor:</strong> {alert.timeWindowHours} h
                    </p>
                  )}

                  {alert.incidentCount && (
                    <p>
                      <strong>Broj prijava:</strong> {alert.incidentCount}
                    </p>
                  )}

                  {alert.createdAt && (
                    <p>
                      <strong>Kreirano:</strong> {alert.createdAt}
                    </p>
                  )}

                  {"viewed" in alert && (
                    <p>
                      <strong>Status:</strong>{" "}
                      {alert.viewed ? "Pregledano" : "Nepročitano"}
                    </p>
                  )}

                  {"read" in alert && (
                    <p>
                      <strong>Status:</strong>{" "}
                      {alert.read ? "Pregledano" : "Nepročitano"}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ModeratorAlertsPage;