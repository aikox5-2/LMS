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
  getAll: async (params) => {
    const response = await api.get("/exams", { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/exams/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post("/exams", data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/exams/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/exams/${id}`);
    return response.data;
  },
  assignQuestions: async (examId, questionIds) => {
    const response = await api.patch(`/exams/${examId}/questions`, {
      question_ids: questionIds,
    });
    return response.data;
  },
  getQuestions: async (examId) => {
    const response = await api.get(`/exams/${examId}/questions`);
    return response.data;
  },
  getActiveExams: async (params) => {
    const response = await api.get(`/exams/active`, { params });
    return response.data;
  },
  getExamDetail: async (id) => {
    const response = await api.get(`/exam-attempts/${id}/detail`);
    return response.data;
  },
  submitAnswer: async (examId, data) => {
    const response = await api.post(`/exam-attempts/${examId}/answer`, data);
    return response.data;
  },
  submitExam: async (examId) => {
    const response = await api.post(`/exam-attempts/${examId}/submit`);
    return response.data;
  },
  getMyAttempt: async (examId) => {
    const response = await api.get(`/exam-attempts/my-attempts/${examId}`);
    return response.data;
  },
  getMyAttempts: async (params) => {
    const response = await api.get("/exam-attempts/my-attempts", { params });
    return response.data;
  },
  getAttemptsForTeacher: async (params) => {
    const response = await api.get("/exam-attempts/teacher", { params });
    return response.data;
  },
  getAttemptDetailForTeacher: async (examId, userId) => {
    const response = await api.get(`/exam-attempts/${examId}?user_id=${userId}`);
    return response.data;
  },
  correctAnswers: async (data) => {
    const response = await api.patch("/answers/correct", data);
    return response.data;
  },
  getExamMonitor: async (examId, params) => {
    const response = await api.get(`/exams/monitor/${examId}`, { params });
    return response.data;
  },
};