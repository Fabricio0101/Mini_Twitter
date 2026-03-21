"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";
import type { PostsResponse } from "@/lib/types/post";

export function useSearchPosts(search: string) {
  return useQuery<PostsResponse>({
    queryKey: ["search-posts", search],
    queryFn: async () => {
      const response = await api.get<PostsResponse>("/posts", {
        params: { search, page: "1" },
      });
      return response.data;
    },
    enabled: search.length >= 2,
    staleTime: 30_000,
  });
}
