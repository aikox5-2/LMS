import api from "../config/api";

export const dashboardService = {
  getAdminStats: async () => {
    const response = await api.get("/dashboard/admin");
    return response.data;
  },

  getTeacherStats: async () => {
    const response = await api.get("dashboard/teacher");
    return response.data;
  },
  getStudentStats: async () => {
    const response = await api.get("dashboard/student");
    return response.data;
  }
};