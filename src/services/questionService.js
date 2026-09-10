import api from "../config/api";

export const questionService = {
  getByCourseId: async (courseId, params) => {
    const response = await api.get(`/questions/course/${courseId}`, { params });
    return response.data;
  },
  getAll: async (params) => {
    const response = await api.get("/questions", { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/questions/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post("/questions", data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/questions/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/questions/${id}`);
    return response.data;
  },
};