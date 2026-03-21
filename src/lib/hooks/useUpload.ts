"use client";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";

export function useUploadImage() {
  return useMutation({
    mutationFn: async (file: File): Promise<string> => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post<{ url: string }>("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data.url;
    },
  });
}
