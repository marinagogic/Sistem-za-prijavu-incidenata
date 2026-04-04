const subtypeOptions = {
  ALL: [],
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

function IncidentFilters({ filters, setFilters }) {
  const availableSubtypes = filters.type
    ? subtypeOptions[filters.type] || []
    : [];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "type") {
      setFilters((prev) => ({
        ...prev,
        type: value,
        subtype: "",
      }));
      return;
    }

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      type: "",
      subtype: "",
      timeRange: "all",
      locationText: "",
    });
  };

  return (
    <div className="filters-card">
      <div className="filters-grid">
        <div className="filter-field">
          <label>Vrsta</label>
          <select name="type" value={filters.type} onChange={handleChange}>
            <option value="">Sve</option>
            <option value="FIRE">FIRE</option>
            <option value="FLOOD">FLOOD</option>
            <option value="ACCIDENT">ACCIDENT</option>
            <option value="CRIME">CRIME</option>
            <option value="INFRASTRUCTURE">INFRASTRUCTURE</option>
            <option value="HEALTH">HEALTH</option>
            <option value="ENVIRONMENT">ENVIRONMENT</option>
          </select>
        </div>

        <div className="filter-field">
          <label>Podvrsta</label>
          <select
            name="subtype"
            value={filters.subtype}
            onChange={handleChange}
            disabled={!filters.type}
          >
            <option value="">Sve</option>
            {availableSubtypes.map((subtype) => (
              <option key={subtype} value={subtype}>
                {subtype}
              </option>
            ))}
          </select>
        </div>

       <div className="filter-field">
         <label>Vrijeme</label>
         <select
           name="timeRange"
           value={filters.timeRange}
           onChange={handleChange}
         >
           <option value="all">Sve prijave</option>
           <option value="24h">Zadnja 24h</option>
           <option value="7d">Zadnjih 7 dana</option>
           <option value="31d">Zadnjih 31 dan</option>
         </select>
       </div>

        <div className="filter-field">
          <label>Lokacija / adresa</label>
          <input
            type="text"
            name="locationText"
            value={filters.locationText}
            onChange={handleChange}
            placeholder="Pretraži po adresi"
          />
        </div>
      </div>

      <div className="filters-actions">
        <button type="button" className="btn btn-soft" onClick={resetFilters}>
          Reset filtera
        </button>
      </div>
    </div>
  );
}

export default IncidentFilters;