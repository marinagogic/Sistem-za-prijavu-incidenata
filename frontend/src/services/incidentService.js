import api from "./api";

export const createIncident = (formData) => {
  return api.post("/api/incidents", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getApprovedIncidents = (filters = {}) => {
  return api.get("/api/incidents/approved", {
    params: {
      type: filters.type || undefined,
      subtype: filters.subtype || undefined,
      location: filters.locationText || undefined,
      period: filters.timeRange || "all",
    },
  });
};

export const getPendingIncidents = () => {
  return api.get("/api/incidents/pending");
};

export const approveIncident = (id) => {
  return api.put(`/api/incidents/${id}/approve`);
};

export const rejectIncident = (id) => {
  return api.put(`/api/incidents/${id}/reject`);
};