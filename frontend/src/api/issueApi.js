import axiosClient from "./axiosClient";

export const issueApi = {
  createIssue: (formData) =>
    axiosClient.post("/issues", formData),

  getMyIssues: () =>
    axiosClient.get("/issues/my"),
};