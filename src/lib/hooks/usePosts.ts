"use client";

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api/axios";
import { useLikedPostsStore } from "@/lib/store/likedPostsStore";
import type { PostsResponse, CreatePostPayload, UpdatePostPayload } from "@/lib/types/post";
import type { AxiosError } from "axios";

export function usePosts(search?: string) {
  const { addLike, removeLike } = useLikedPostsStore();

  return useInfiniteQuery<PostsResponse>({
    queryKey: ["posts", search],
    queryFn: async ({ pageParam }) => {
      const params: Record<string, string> = { page: String(pageParam) };
      if (search) params.search = search;
      const response = await api.get<PostsResponse>("/posts", { params });

      const normalizedPosts = response.data.posts.map((post) => ({
        ...post,
        likesCount: Number(post.likesCount),
        commentsCount: Number(post.commentsCount),
        likedByMe: Number(post.likedByMe),
        repostsCount: Number(post.repostsCount),
        repostedByMe: Number(post.repostedByMe),
        favoritedByMe: Number(post.favoritedByMe),
        viewsCount: Number(post.viewsCount),
        isOwner: Boolean(post.isOwner),
      }));

      for (const post of normalizedPosts) {
        if (post.likedByMe) {
          addLike(post.id);
        } else {
          removeLike(post.id);
        }
      }

      return { ...response.data, posts: normalizedPosts };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const hasMore = lastPage.page * lastPage.limit < lastPage.total;
      return hasMore ? lastPage.page + 1 : undefined;
    },
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePostPayload) => {
      const response = await api.post("/posts", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdatePostPayload }) => {
      const response = await api.put(`/posts/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post atualizado com sucesso!");
    },
    onError: (error) => {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 403) {
        toast.error("Você não tem permissão para editar este post");
      } else {
        toast.error("Erro ao atualizar post. Tente novamente.");
      }
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/posts/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post excluído com sucesso!");
    },
    onError: (error) => {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 403) {
        toast.error("Você não tem permissão para excluir este post");
      } else {
        toast.error("Erro ao excluir post. Tente novamente.");
      }
    },
  });
}
