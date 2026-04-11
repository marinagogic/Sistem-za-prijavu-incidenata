import api from "./api";

export const getAnalyticsSummary = () => {
  return api.get("/api/analytics/summary");
};

export const getAnalyticsByType = () => {
  return api.get("/api/analytics/type");
};

export const getAnalyticsBySubtype = () => {
  return api.get("/api/analytics/subtype");
};

export const getAnalyticsTimeline = () => {
  return api.get("/api/analytics/time/timeline");
};

export const getTopLocations = () => {
  return api.get("/api/analytics/location/top");
};

export const getMapPoints = () => {
  return api.get("/api/analytics/location/points");
};