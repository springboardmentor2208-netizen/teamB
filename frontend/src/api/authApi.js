import axiosClient from "./axiosClient";

export const authApi = {
  login: (payload) => axiosClient.post("/auth/login", payload),
  register: (payload) => axiosClient.post("/auth/register", payload),
  getProfile: () => axiosClient.get("/users/me"),
  updateProfile: (formData) =>
  axiosClient.put("/users/me", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }),
  forgotPassword: (payload) => axiosClient.post("/auth/forgot-password", payload),
  verifyOTP: (payload) => axiosClient.post("/auth/verify-otp", payload),
  resetPassword: (payload) => axiosClient.post("/auth/reset-password", payload),
  verifyRegistrationOTP: (payload) => axiosClient.post("/auth/verify-registration-otp", payload),
};
