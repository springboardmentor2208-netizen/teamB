import axiosClient from "./axiosClient";

export const issueApi = {
  createIssue: (formData) =>
    axiosClient.post("/issues", formData),

  getMyIssues: () =>
    axiosClient.get("/issues/my"),

  getIssue: (id) =>
    axiosClient.get(`/issues/${id}`),

  voteIssue: (id, voteType) =>
    axiosClient.post(`/issues/${id}/vote`, { vote_type: voteType }),

  addComment: (id, content) =>
    axiosClient.post(`/issues/${id}/comments`, { content }),

  getAllIssues: () =>
    axiosClient.get("/issues"),

  updateIssueStatus: (id, status) =>
    axiosClient.patch(`/issues/${id}/status`, { status }),


};
