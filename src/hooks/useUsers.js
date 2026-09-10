import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../services/userService";

// 1. Hook untuk fetch users list
export const useUsersList = (params) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: async () => {
      const response = await userService.getAll(params);
      if (!response.success) throw new Error("Gagal mengambil daftar pengguna");
      return response.data;
    },
    placeholderData: (previousData) => previousData,
  });
};

// 2. Hook untuk fetch single user detail
export const useUserDetail = (id, enabled = true) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const response = await userService.getById(id);
      if (!response.success) throw new Error("Gagal mengambil detail pengguna");
      return response.data;
    },
    enabled: !!id && enabled,
  });
};

// 3. Hook untuk create user
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => userService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

// 4. Hook untuk update user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => userService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", variables.id] });
    },
  });
};

// 5. Hook untuk delete user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => userService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};