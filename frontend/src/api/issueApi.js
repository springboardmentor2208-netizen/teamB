import axiosClient from "./axiosClient";

export const issueApi = {
  createIssue: (payload) =>
    axiosClient.post("/issues", payload),

  getMyIssues: () =>
    axiosClient.get("/issues/my"),

  getIssueById: (id) =>
    axiosClient.get(`/issues/${id}`),

  updateIssue: (id, payload) =>
    axiosClient.put(`/issues/${id}`, payload),

  deleteIssue: (id) =>
    axiosClient.delete(`/issues/${id}`),
};
