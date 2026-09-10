import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";

export const useAdminStats = (enabled = true) => {
  return useQuery({
    queryKey: ["dashboard-admin"],
    queryFn: async () => {
      const response = await dashboardService.getAdminStats();
      if (!response.success) throw new Error("Gagal mengambil statistik admin");
      return response.data;
    },
    enabled,
  });
};

export const useTeacherStats = (enabled = true) => {
    return useQuery({
        queryKey: ["dashboard-teacher"],
        queryFn: async () => {
            const response = await dashboardService.getTeacherStats();
            if (!response.success) throw new Error("Gagal mengambil statistik guru");
            return response.data;
        },
        enabled,
    });
};
export const useStudentStats = (enabled = true) => {
    return useQuery({
        queryKey: ["dashboard-student"],
        queryFn: async () => {
            const response = await dashboardService.getStudentStats();
            if (!response.success) throw new Error("Gagal mengambil statistik siswa");
            return response.data;
        },
        enabled,
    });
};