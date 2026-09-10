import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { examService } from "../services/examService";

export const useActiveDashboardExams = () => {
  return useQuery({
    queryKey: ["active-dashboard-exams"],
    queryFn: async () => {
      const [resTersedia, resBerlangsung] = await Promise.all([
        examService.getMyExams({ status: "tersedia" }),
        examService.getMyExams({ status: "berlangsung" }),
      ]);

      const tersedia = resTersedia.success ? resTersedia.data?.data || [] : [];
      const berlangsung = resBerlangsung.success
        ? resBerlangsung.data?.data || []
        : [];

      return [...berlangsung, ...tersedia];
    },
  });
};

// Hook untuk fetch exams list
export const useExamsList = (params) => {
  return useQuery({
    queryKey: ["exams", params],
    queryFn: async () => {
      const response = await examService.getAll(params);
      if (!response.success) throw new Error("Gagal mengambil daftar ujian");
      return response.data;
    },
    placeholderData: (previousData) => previousData,
  });
};

// Hook to fetch my active exams (student schedule)
export const useMyExamsList = (params) => {
  return useQuery({
    queryKey: ["my-exams-list", params],
    queryFn: async () => {
      const response = await examService.getMyExams(params);
      if (!response.success) throw new Error("Gagal mengambil jadwal ujian saya");
      const pagination = response.data?.pagination || {};
      return {
        data: response.data?.data || [],
        pagination: {
          total_data: pagination.total_data || 0,
          total_pages: pagination.total_page || 1,
          current_page: pagination.current_page || 1,
          limit: pagination.limit || 10,
        },
      };
    },
  });
};

// Hook untuk fetch single exam detail
export const useExamDetail = (id, enabled = true) => {
  return useQuery({
    queryKey: ["exam", id],
    queryFn: async () => {
      const response = await examService.getById(id);
      if (!response.success) throw new Error("Gagal mengambil detail ujian");
      return response.data;
    },
    enabled: !!id && enabled,
  });
};

// Hook untuk create exam
export const useCreateExam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => examService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
  });
};

// Hook untuk update exam
export const useUpdateExam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => examService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      queryClient.invalidateQueries({ queryKey: ["exam", variables.id] });
    },
  });
};

// Hook untuk delete exam
export const useDeleteExam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => examService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
  });
};

// Hook untuk assign questions to an exam
export const useAssignExamQuestions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ examId, questionIds }) =>
      examService.assignQuestions(examId, questionIds),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["exam", variables.examId] });
      queryClient.invalidateQueries({
        queryKey: ["exam-questions", variables.examId],
      });
    },
  });
};

// Hook untuk fetch questions assigned to an exam
export const useExamQuestions = (examId, enabled = true) => {
  return useQuery({
    queryKey: ["exam-questions", examId],
    queryFn: async () => {
      const response = await examService.getQuestions(examId);
      if (!response.success) throw new Error("Gagal mengambil soal ujian");
      return response.data;
    },
    enabled: !!examId && enabled,
  });
};

// Hook to fetch my attempts (student)
export const useMyAttempts = (enabled = true, params) => {
  return useQuery({
    queryKey: ["attempts-my", params],
    queryFn: async () => {
      const response = await examService.getMyAttempts(params);
      if (!response.success) throw new Error("Gagal mengambil riwayat ujian saya");
      return {
        data: response.data?.data || [],
        pagination: response.data?.pagination || {
          total_data: 0,
          total_page: 1,
          current_page: 1,
          limit: 10,
        },
      };
    },
    enabled,
  });
};
export const useAttemptsForTeacher = (enabled = true, params) => {
  return useQuery({
    queryKey: ["attempts-teacher", params],
    queryFn: async () => {
      const response = await examService.getAttemptsForTeacher(params);
      if (!response.success) throw new Error("Gagal mengambil riwayat pengerjaan");
      return {
        data: response.data?.data || [],
        pagination: response.data?.pagination || {
          total_data: 0,
          total_page: 1,
          current_page: 1,
          limit: 10,
        },
      };
    },
    enabled,
  });
};