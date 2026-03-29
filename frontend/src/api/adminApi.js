import axiosClient from "./axiosClient";

export const adminApi = {
  getAllComplaints: () => axiosClient.get("/issues"),
  getAllUsers: () => axiosClient.get("/admin/users"),
};