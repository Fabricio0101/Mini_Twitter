"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api/axios";
import { useAuthStore } from "@/lib/store/authStore";
import type { User } from "@/lib/types/user";

export function useProfile() {
  const token = useAuthStore((s) => s.token);

  return useQuery<User>({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await api.get<User>("/users/me");
      return response.data;
    },
    enabled: !!token,
  });
}

interface UpdateProfilePayload {
  name?: string;
  bio?: string;
  location?: string;
  avatarUrl?: string;
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((s) => s.updateUser);

  return useMutation({
    mutationFn: async (data: UpdateProfilePayload) => {
      const response = await api.put<User>("/users/me", data);
      return response.data;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["profile"], updatedUser);
      updateUser(updatedUser);
      toast.success("Perfil atualizado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao atualizar perfil. Tente novamente.");
    },
  });
}

interface ChangePasswordPayload {
  newPassword: string;
  confirmPassword: string;
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: ChangePasswordPayload) => {
      const response = await api.put("/users/me/password", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Senha alterada com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao alterar senha. Tente novamente.");
    },
  });
}
