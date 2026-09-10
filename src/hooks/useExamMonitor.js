import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { examService } from "../services/examService";
import { socket } from "../config/socket";

// Get all active exams
export const useActiveExams = () => {
  return useQuery({
    queryKey: ["active-exams"],
    queryFn: async () => {
      const response = await examService.getActiveExams();
      if (!response.success) throw new Error("Gagal mengambil data ujian aktif");
      const data = response.data || [];
      return Array.isArray(data) ? data : (data.data || []);
    },
  });
};

// Get specific exam monitor details (student attempts list)
export const useExamMonitorDetails = (examId, page, limit) => {
  return useQuery({
    queryKey: ["exam-monitor", examId, { page, limit }],
    queryFn: async () => {
      const response = await examService.getExamMonitor(examId, { page, limit });
      if (!response.success || !response.data) {
        throw new Error("Gagal mengambil data monitor ujian");
      }
      return response.data;
    },
    placeholderData: (previousData) => previousData,
  });
};

// Socket real-time synchronization hook
export const useExamMonitorSocket = (examId) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!examId) return;

    if (!socket.connected) {
      socket.connect();
    }

    // Join monitor room on backend
    socket.emit("join-monitor");

    // Handle student start/submit update
    const handleRefresh = (data) => {
      console.log("WebSocket exam-monitor:refresh received:", data);

      if (data && Number(data.exam_id) === Number(examId)) {
        queryClient.invalidateQueries({ queryKey: ["exam-monitor", examId] });
      }
    };

    socket.on("exam-monitor:refresh", handleRefresh);

    // Cleanup on unmount
    return () => {
      socket.emit("leave-monitor");
      socket.off("exam-monitor:refresh", handleRefresh);
    };
  }, [examId, queryClient]);
};