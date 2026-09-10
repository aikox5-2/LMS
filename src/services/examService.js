import api from "../config/api";

export const examService = {
  getMyExams: async (params) => {
    const response = await api.get("/exams/my-exams", { params });
    return response.data;
  },
  startExam: async (id) => {
    const response = await api.post(`/exam-attempts/${id}/start`);
    return response.data;
  },
};