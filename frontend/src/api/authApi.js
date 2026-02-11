import axiosClient from "./axiosClient";

export const authApi = {
  login: (payload) => axiosClient.post("/auth/login", payload),
  register: (payload) => axiosClient.post("/auth/register", payload),
  getProfile: () => axiosClient.get("/users/me"),
  updateProfile: (payload) => axiosClient.put("/users/me", payload),
};
