import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courseService } from "../services/courseService";

// 1. Hook untuk fetch courses list
export const useCoursesList = (params) => {
  return useQuery({
    queryKey: ["courses", params],
    queryFn: async () => {
      const response = await courseService.getAll(params);
      if (!response.success) throw new Error("Gagal mengambil daftar mata pelajaran");
      return response.data;
    },
    placeholderData: (previousData) => previousData,
  });
};

// 2. Hook untuk fetch single course detail
export const useCourseDetail = (id, enabled = true) => {
  return useQuery({
    queryKey: ["course", id],
    queryFn: async () => {
      const response = await courseService.getById(id);
      if (!response.success) throw new Error("Gagal mengambil detail mata pelajaran");
      return response.data;
    },
    enabled: !!id && enabled,
  });
};

// 3. Hook untuk create course
export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => courseService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};

// 4. Hook untuk update course
export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => courseService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["course", variables.id] });
    },
  });
};

// 5. Hook untuk delete course
export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => courseService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};