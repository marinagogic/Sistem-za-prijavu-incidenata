import { useMemo, useState } from "react";
import GuestSidebar from "../../components/guest/GuestSidebar";
import GuestTopbar from "../../components/guest/GuestTopbar";
import IncidentMap from "../../components/guest/IncidentMap";
import { createIncident } from "../../services/incidentService";
import "./ReportIncidentPage.css";

const subtypeOptions = {
  FIRE: [
    "BUILDING_FIRE",
    "FOREST_FIRE",
    "VEHICLE_FIRE",
    "ELECTRICAL_FIRE",
    "WASTE_FIRE",
  ],
  FLOOD: [
    "RIVER_FLOOD",
    "URBAN_FLOOD",
    "SEWER_OVERFLOW",
    "BASEMENT_FLOOD",
  ],
  ACCIDENT: [
    "CAR_ACCIDENT",
    "BIKE_ACCIDENT",
    "PEDESTRIAN_ACCIDENT",
    "WORK_ACCIDENT",
    "SPORT_ACCIDENT",
  ],
  CRIME: [
    "ROBBERY",
    "ASSAULT",
    "VANDALISM",
    "BURGLARY",
    "DRUG_ABUSE",
    "ILLEGAL_DUMPING",
  ],
  INFRASTRUCTURE: [
    "POWER_OUTAGE",
    "WATER_OUTAGE",
    "GAS_LEAK",
    "ROAD_DAMAGE",
    "BROKEN_TRAFFIC_LIGHT",
    "BRIDGE_DAMAGE",
  ],
  HEALTH: [
    "MEDICAL_EMERGENCY",
    "EPIDEMIC",
    "ANIMAL_ATTACK",
    "MISSING_PERSON",
  ],
  ENVIRONMENT: [
    "AIR_POLLUTION",
    "WATER_POLLUTION",
    "NOISE_POLLUTION",
    "ILLEGAL_LOGGING",
    "ANIMAL_CRUELTY",
  ],
};

function ReportIncidentPage() {
  const [formData, setFormData] = useState({
    type: "",
    subtype: "",
    description: "",
    address: "",
    latitude: "44.7722",
    longitude: "17.1910",
  });

  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const availableSubtypes = useMemo(() => {
    return formData.type ? subtypeOptions[formData.type] || [] : [];
  }, [formData.type]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "type") {
      setFormData((prev) => ({
        ...prev,
        type: value,
        subtype: "",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setImage(e.target.files?.[0] || null);
  };

  const handleMapClick = (latlng) => {
    setFormData((prev) => ({
      ...prev,
      latitude: latlng.lat.toFixed(6),
      longitude: latlng.lng.toFixed(6),
    }));
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setMessage("Geolokacija nije podržana u ovom browseru.");
      return;
    }

    setMessage("Učitavanje trenutne lokacije...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setFormData((prev) => ({
          ...prev,
          latitude: latitude.toFixed(6),
          longitude: longitude.toFixed(6),
        }));

        setMessage("Trenutna lokacija je uspješno učitana.");
      },
      () => {
        setMessage("Nije moguće pristupiti trenutnoj lokaciji.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSaving(true);

    try {
      const data = new FormData();
      data.append("type", formData.type);
      data.append("description", formData.description);
      data.append("address", formData.address);
      data.append("latitude", formData.latitude);
      data.append("longitude", formData.longitude);

      if (formData.subtype) {
        data.append("subtype", formData.subtype);
      }

      if (image) {
        data.append("image", image);
      }

      await createIncident(data);

      setMessage("Incident je uspješno prijavljen i čeka odobrenje moderatora.");
      setFormData({
        type: "",
        subtype: "",
        description: "",
        address: "",
        latitude: "44.7722",
        longitude: "17.1910",
      });
      setImage(null);
    } catch (error) {
      setMessage(error?.response?.data || "Greška pri prijavi incidenta.");
    } finally {
      setSaving(false);
    }
  };

  const mapMarkers = [
    {
      id: "selected-location",
      latitude: formData.latitude,
      longitude: formData.longitude,
      type: "Izabrana lokacija",
      subtype: "",
      address: formData.address,
      description: "Klik na mapu mijenja latitude i longitude.",
    },
  ];

  return (
    <div className="report-page">
      <GuestSidebar />

      <main className="report-main">
        <GuestTopbar title="Guest dashboard - Report incident" />

        <div className="report-content-grid">
          <div className="report-map-card">
            <div className="report-map-header">
              <h3>Izaberi lokaciju na mapi</h3>
              <p>
                Klikni na mapu da ručno odabereš lokaciju ili koristi svoju
                trenutnu lokaciju.
              </p>

              <button
                type="button"
                className="report-btn report-btn-outline report-location-btn"
                onClick={handleUseCurrentLocation}
              >
                Koristi moju lokaciju
              </button>
            </div>

            <div className="report-map-wrapper">
              <IncidentMap
                center={[Number(formData.latitude), Number(formData.longitude)]}
                zoom={13}
                markers={mapMarkers}
                onMapClick={handleMapClick}
                className="report-map"
              />
            </div>
          </div>

          <div className="report-form-card">
            <div className="report-modal-header">
              <h3>Report Incident</h3>
            </div>

            <form onSubmit={handleSubmit} className="report-form">
              <div className="report-grid">
                <div className="report-field">
                  <label>Latitude</label>
                  <input
                    type="number"
                    step="any"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    placeholder="Latitude"
                    required
                  />
                </div>

                <div className="report-field">
                  <label>Longitude</label>
                  <input
                    type="number"
                    step="any"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    placeholder="Longitude"
                    required
                  />
                </div>

                <div className="report-field">
                  <label>Incident Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Type</option>
                    <option value="FIRE">FIRE</option>
                    <option value="FLOOD">FLOOD</option>
                    <option value="ACCIDENT">ACCIDENT</option>
                    <option value="CRIME">CRIME</option>
                    <option value="INFRASTRUCTURE">INFRASTRUCTURE</option>
                    <option value="HEALTH">HEALTH</option>
                    <option value="ENVIRONMENT">ENVIRONMENT</option>
                  </select>
                </div>

                <div className="report-field">
                  <label>Subtype</label>
                  <select
                    name="subtype"
                    value={formData.subtype}
                    onChange={handleChange}
                    disabled={!formData.type}
                  >
                    <option value="">Subtype</option>
                    {availableSubtypes.map((subtype) => (
                      <option key={subtype} value={subtype}>
                        {subtype}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="report-field">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Address"
                    required
                  />
                </div>

                <div className="report-field">
                  <label>Image</label>
                  <label className="upload-box">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <span>{image ? image.name : "Klikni za izbor slike"}</span>
                  </label>
                </div>
              </div>

              <div className="report-field full-width">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Description"
                  rows="4"
                  required
                />
              </div>

              {message && <p className="report-message">{message}</p>}

              <div className="report-actions">
                <button
                  type="button"
                  className="report-btn report-btn-cancel"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      type: "",
                      subtype: "",
                      description: "",
                      address: "",
                    }))
                  }
                >
                  Clear
                </button>

                <button
                  type="submit"
                  className="report-btn report-btn-primary"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ReportIncidentPage;