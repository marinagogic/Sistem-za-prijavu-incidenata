import api from "./api";

export const getUserById = (id) => {
  return api.get(`/api/users/${id}`);
};

export const updateUser = (id, userData) => {
  const loggedInUserId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  return api.put(`/api/users/${id}`, userData, {
    headers: {
      "X-User-Id": loggedInUserId,
      "X-Role": role,
    },
  });
};

export const getAllUsers = () => {
  return api.get("/api/users/all");
};

export const createEmployee = (userData) => {
  return api.post("/api/users/employee", userData);
};