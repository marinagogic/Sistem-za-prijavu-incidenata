import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/nlp";

export const getSimilarGroups = () => {
  const token = localStorage.getItem("token");

  return axios.get(`${API_BASE_URL}/similar-groups`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};