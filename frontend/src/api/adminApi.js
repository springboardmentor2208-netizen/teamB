import axiosClient from "./axiosClient";

export const adminApi = {
  getAllComplaints: () => axiosClient.get("/admin/complaints"),
  getAllUsers: () => axiosClient.get("/admin/users"),
};