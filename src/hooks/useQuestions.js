import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { questionService } from "../services/questionService";

export const useQuestionsByCourse = (courseId, params) => {
  return useQuery({
    queryKey: ["questions-course", courseId, params],
    queryFn: async () => {
      const response = await questionService.getByCourseId(courseId, params);
      if (!response.success) throw new Error("Gagal mengambil daftar soal kelas");
      return response.data;
    },
    enabled: !!courseId,
    placeholderData: (previousData) => previousData,
  });
};

// Hook to fetch questions list
export const useQuestionsList = (params) => {
  return useQuery({
    queryKey: ["questions", params],
    queryFn: async () => {
      const response = await questionService.getAll(params);
      if (!response.success) throw new Error("Gagal mengambil daftar soal");
      return response.data;
    },
    placeholderData: (previousData) => previousData,
  });
};

// Hook untuk fetch single question detail
export const useQuestionDetail = (id, enabled = true) => {
  return useQuery({
    queryKey: ["question", id],
    queryFn: async () => {
      const response = await questionService.getById(id);
      if (!response.success) throw new Error("Gagal mengambil detail soal");
      return response.data;
    },
    enabled: !!id && enabled,
  });
};

// Hook untuk create question
export const useCreateQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => questionService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
};

// Hook untuk update question
export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => questionService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      queryClient.invalidateQueries({ queryKey: ["question", variables.id] });
    },
  });
};

// Hook untuk delete question
export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => questionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
};