"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api/axios";
import { useAuthStore } from "@/lib/store/authStore";
import type { LoginResponse, LogoutResponse } from "@/lib/types/api";
import type { User } from "@/lib/types/user";
import type { LoginFormData } from "@/lib/schemas/loginSchema";
import type { RegisterFormData } from "@/lib/schemas/registerSchema";

export function useLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await api.post<LoginResponse>("/auth/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      if (typeof document !== "undefined") {
        document.cookie = `mini-twitter-token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      }
      toast.success("Login realizado com sucesso!");
      router.push("/");
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const response = await api.post<User>("/auth/register", data);
      return response.data;
    },
    onSuccess: () => {
      router.push("/login");
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return useMutation({
    mutationFn: async () => {
      const response = await api.post<LogoutResponse>("/auth/logout");
      return response.data;
    },
    onSuccess: () => {
      clearAuth();
      if (typeof document !== "undefined") {
        document.cookie = "mini-twitter-token=; path=/; max-age=0";
      }
      toast.success("Logout realizado com sucesso!");
      router.push("/login");
    },
    onError: () => {
      clearAuth();
      if (typeof document !== "undefined") {
        document.cookie = "mini-twitter-token=; path=/; max-age=0";
      }
      router.push("/login");
    },
  });
}
