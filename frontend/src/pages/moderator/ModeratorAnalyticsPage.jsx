import { useEffect, useMemo, useState } from "react";
import ModeratorSidebar from "../../components/moderator/ModeratorSidebar";
import ModeratorTopbar from "../../components/moderator/ModeratorTopbar";
import {
  getAnalyticsSummary,
  getAnalyticsByType,
  getAnalyticsBySubtype,
  getAnalyticsTimeline,
  getTopLocations,
  getMapPoints,
} from "../../services/analyticsService";
import "./ModeratorAnalyticsPage.css";

function ModeratorAnalyticsPage() {
  const [summary, setSummary] = useState(null);
  const [typeStats, setTypeStats] = useState([]);
  const [subtypeStats, setSubtypeStats] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [topLocations, setTopLocations] = useState([]);
  const [mapPoints, setMapPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      setMessage("");

      try {
        const [
          summaryResponse,
          typeResponse,
          subtypeResponse,
          timelineResponse,
          locationResponse,
          mapPointsResponse,
        ] = await Promise.all([
          getAnalyticsSummary(),
          getAnalyticsByType(),
          getAnalyticsBySubtype(),
          getAnalyticsTimeline(),
          getTopLocations(),
          getMapPoints(),
        ]);

        setSummary(summaryResponse?.data || null);
        setTypeStats(Array.isArray(typeResponse?.data) ? typeResponse.data : []);
        setSubtypeStats(Array.isArray(subtypeResponse?.data) ? subtypeResponse.data : []);
        setTimeline(Array.isArray(timelineResponse?.data) ? timelineResponse.data : []);
        setTopLocations(Array.isArray(locationResponse?.data) ? locationResponse.data : []);
        setMapPoints(Array.isArray(mapPointsResponse?.data) ? mapPointsResponse.data : []);
      } catch (error) {
        console.error("Greška pri učitavanju analitike:", error);
        setMessage("Greška pri učitavanju analitike.");
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const topType = useMemo(() => {
    if (!typeStats.length) return "Nema podataka";
    return `${typeStats[0].label} (${typeStats[0].value})`;
  }, [typeStats]);

  const topLocation = useMemo(() => {
    if (!topLocations.length) return "Nema podataka";
    return `${topLocations[0].address} (${topLocations[0].count})`;
  }, [topLocations]);

  const maxTypeValue = useMemo(() => {
    if (!typeStats.length) return 0;
    return Math.max(...typeStats.map((item) => item.value || 0));
  }, [typeStats]);

  const linePoints = useMemo(() => {
    if (!timeline.length) return "";

    const width = 560;
    const height = 220;
    const padding = 24;
    const maxValue = Math.max(...timeline.map((item) => item.count || 0), 1);

    return timeline
      .map((item, index) => {
        const x =
          padding +
          (index * (width - padding * 2)) / Math.max(timeline.length - 1, 1);
        const y =
          height - padding - ((item.count || 0) * (height - padding * 2)) / maxValue;
        return `${x},${y}`;
      })
      .join(" ");
  }, [timeline]);

  const mapBounds = useMemo(() => {
    const validPoints = mapPoints.filter(
      (point) =>
        typeof point.latitude === "number" &&
        typeof point.longitude === "number"
    );

    if (!validPoints.length) {
      return null;
    }

    const latitudes = validPoints.map((point) => point.latitude);
    const longitudes = validPoints.map((point) => point.longitude);

    return {
      minLat: Math.min(...latitudes),
      maxLat: Math.max(...latitudes),
      minLng: Math.min(...longitudes),
      maxLng: Math.max(...longitudes),
      points: validPoints,
    };
  }, [mapPoints]);

  const projectMapPoint = (lat, lng) => {
    if (!mapBounds) return { x: 0, y: 0 };

    const width = 560;
    const height = 280;
    const padding = 42;

    const latRange = Math.max(mapBounds.maxLat - mapBounds.minLat, 0.01);
    const lngRange = Math.max(mapBounds.maxLng - mapBounds.minLng, 0.01);

    const x =
      padding + ((lng - mapBounds.minLng) * (width - padding * 2)) / lngRange;
    const y =
      height - padding - ((lat - mapBounds.minLat) * (height - padding * 2)) / latRange;

    return { x, y };
  };

  return (
    <div className="moderator-analytics-layout">
      <ModeratorSidebar />

      <main className="moderator-analytics-main">
        <ModeratorTopbar title="Moderator panel - Analitika" />

        <section className="moderator-analytics-hero-card">
          <div className="moderator-analytics-hero-left">
            <span className="moderator-analytics-badge">Analytics service</span>
            <h3>Pregled statistike incidenata</h3>
            <p>
              Ovdje moderator može pratiti osnovnu analizu i vizualizaciju
              incidenata po vremenu, vrsti i lokaciji.
            </p>
          </div>
        </section>

        {message && <div className="moderator-analytics-message">{message}</div>}

        <section className="moderator-analytics-stats-grid">
          <div className="moderator-analytics-stat-card">
            <h4>Ukupan broj incidenata</h4>
            <p className="moderator-analytics-stat-number">
              {loading ? "..." : summary?.totalIncidents ?? 0}
            </p>
          </div>

          <div className="moderator-analytics-stat-card">
            <h4>Zadnja 24h</h4>
            <p className="moderator-analytics-stat-number">
              {loading ? "..." : summary?.incidentsLast24Hours ?? 0}
            </p>
          </div>

          <div className="moderator-analytics-stat-card">
            <h4>Zadnjih 7 dana</h4>
            <p className="moderator-analytics-stat-number">
              {loading ? "..." : summary?.incidentsLast7Days ?? 0}
            </p>
          </div>

          <div className="moderator-analytics-stat-card">
            <h4>Zadnjih 31 dan</h4>
            <p className="moderator-analytics-stat-number">
              {loading ? "..." : summary?.incidentsLast31Days ?? 0}
            </p>
          </div>

          <div className="moderator-analytics-stat-card">
            <h4>Najčešća vrsta</h4>
            <p className="moderator-analytics-stat-text">
              {loading ? "Učitavanje..." : topType}
            </p>
          </div>

          <div className="moderator-analytics-stat-card">
            <h4>Najčešća lokacija</h4>
            <p className="moderator-analytics-stat-text">
              {loading ? "Učitavanje..." : topLocation}
            </p>
          </div>
        </section>

        <section className="moderator-analytics-content-grid">
          <div className="moderator-analytics-card">
            <div className="moderator-analytics-section-header">
              <h3>Bar chart - incidenti po vrsti</h3>
              <p>Grafički prikaz broja incidenata po vrstama.</p>
            </div>

            {!loading && typeStats.length === 0 ? (
              <div className="moderator-analytics-item empty">Nema podataka.</div>
            ) : (
              <div className="moderator-chart-wrap">
                {typeStats.map((item, index) => (
                  <div className="moderator-bar-row" key={`${item.label}-${index}`}>
                    <div className="moderator-bar-label">{item.label}</div>
                    <div className="moderator-bar-track">
                      <div
                        className="moderator-bar-fill"
                        style={{
                          width: `${
                            maxTypeValue ? (item.value / maxTypeValue) * 100 : 0
                          }%`,
                        }}
                      />
                    </div>
                    <div className="moderator-bar-value">{item.value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="moderator-analytics-card">
            <div className="moderator-analytics-section-header">
              <h3>Line chart - vremenska linija</h3>
              <p>Broj incidenata po danima u posljednjem periodu.</p>
            </div>

            {!loading && timeline.length === 0 ? (
              <div className="moderator-analytics-item empty">Nema podataka.</div>
            ) : (
              <div className="moderator-line-chart-box">
                <svg viewBox="0 0 560 220" className="moderator-line-chart">
                  <polyline
                    fill="none"
                    stroke="#d63384"
                    strokeWidth="4"
                    points={linePoints}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {timeline.map((item, index) => {
                    const width = 560;
                    const height = 220;
                    const padding = 24;
                    const maxValue = Math.max(...timeline.map((x) => x.count || 0), 1);

                    const x =
                      padding +
                      (index * (width - padding * 2)) / Math.max(timeline.length - 1, 1);
                    const y =
                      height -
                      padding -
                      ((item.count || 0) * (height - padding * 2)) / maxValue;

                    return (
                      <circle
                        key={`${item.date}-${index}`}
                        cx={x}
                        cy={y}
                        r="4.5"
                        fill="#ff78ad"
                      />
                    );
                  })}
                </svg>

                <div className="moderator-line-labels">
                  {timeline.slice(-6).map((item, index) => (
                    <span key={`${item.date}-${index}`}>{item.date}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="moderator-analytics-card">
            <div className="moderator-analytics-section-header">
              <h3>Mapa lokacija</h3>
              <p>Vizualni prikaz prijavljenih tačaka po koordinatama.</p>
            </div>

            {!loading && (!mapBounds || !mapBounds.points.length) ? (
              <div className="moderator-analytics-item empty">Nema lokacijskih podataka.</div>
            ) : (
              <div className="moderator-map-box">
                <svg viewBox="0 0 560 280" className="moderator-map-chart">
                  <defs>
                    <pattern
                      id="mapGrid"
                      width="40"
                      height="40"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 40 0 L 0 0 0 40"
                        fill="none"
                        stroke="#f3dde7"
                        strokeWidth="1"
                      />
                    </pattern>
                  </defs>

                  <rect x="0" y="0" width="560" height="280" rx="20" fill="#fffafc" />
                  <rect x="0" y="0" width="560" height="280" rx="20" fill="url(#mapGrid)" />

                  {mapBounds?.points.map((point, index) => {
                    const { x, y } = projectMapPoint(point.latitude, point.longitude);

                    return (
                      <g key={`${point.latitude}-${point.longitude}-${index}`}>
                        <circle cx={x} cy={y} r="10" fill="#d63384" opacity="0.12" />
                        <circle cx={x} cy={y} r="6" fill="#f062a6" opacity="0.22" />
                        <circle cx={x} cy={y} r="3.5" fill="#d63384" />
                      </g>
                    );
                  })}
                </svg>

                <div className="moderator-map-legend">
                  Prikazano tačaka: {mapBounds?.points.length || 0}
                </div>
              </div>
            )}
          </div>

          <div className="moderator-analytics-card">
            <div className="moderator-analytics-section-header">
              <h3>Top lokacije</h3>
              <p>Najčešće prijavljivane adrese/lokacije.</p>
            </div>

            <div className="moderator-analytics-list">
              {!loading && topLocations.length === 0 && (
                <div className="moderator-analytics-item empty">Nema podataka.</div>
              )}

              {topLocations.map((item, index) => (
                <div className="moderator-analytics-item" key={`${item.address}-${index}`}>
                  <div className="moderator-analytics-row">
                    <span className="moderator-analytics-label">{item.address}</span>
                    <span className="moderator-analytics-value">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="moderator-analytics-card">
            <div className="moderator-analytics-section-header">
              <h3>Incidenti po podvrsti</h3>
              <p>Detaljniji prikaz prijava po podvrstama.</p>
            </div>

            <div className="moderator-analytics-list">
              {!loading && subtypeStats.length === 0 && (
                <div className="moderator-analytics-item empty">Nema podataka.</div>
              )}

              {subtypeStats.slice(0, 10).map((item, index) => (
                <div className="moderator-analytics-item" key={`${item.label}-${index}`}>
                  <div className="moderator-analytics-row">
                    <span className="moderator-analytics-label">{item.label}</span>
                    <span className="moderator-analytics-value">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ModeratorAnalyticsPage;