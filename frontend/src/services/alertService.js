import api from "./api";

export const getAlertSettings = () => {
  return api.get("/api/incident-alerts/settings");
};

export const updateAlertSettings = (data) => {
  return api.put("/api/incident-alerts/settings", data);
};

export const scanAlerts = () => {
  return api.post("/api/incident-alerts/scan");
};

export const getAllAlerts = (moderatorId) => {
  return api.get("/api/incident-alerts", {
    params: { moderatorId },
  });
};

export const getUnreadAlerts = (moderatorId) => {
  return api.get("/api/incident-alerts/unread", {
    params: { moderatorId },
  });
};

export const getUnreadAlertsCount = (moderatorId) => {
  return api.get("/api/incident-alerts/unread/count", {
    params: { moderatorId },
  });
};

export const markAlertAsViewed = (alertId, moderatorId) => {
  return api.post(`/api/incident-alerts/${alertId}/view`, null, {
    params: { moderatorId },
  });
};