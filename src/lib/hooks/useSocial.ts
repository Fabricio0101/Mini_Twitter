"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";
import type { PublicProfile, PostsResponse } from "@/lib/types/post";

export function useRepost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: number) => {
      const response = await api.post(`/social/repost/${postId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useFollow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: number) => {
      const response = await api.post(`/social/follow/${userId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publicProfile"] });
    },
  });
}

export function useFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: number) => {
      const response = await api.post(`/social/favorite/${postId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

export function usePublicProfile(userId: number | null) {
  return useQuery<PublicProfile>({
    queryKey: ["publicProfile", userId],
    queryFn: async () => {
      const response = await api.get(`/social/profile/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });
}

export function useUserPosts(userId: number | null) {
  return useQuery<PostsResponse>({
    queryKey: ["userPosts", userId],
    queryFn: async () => {
      const response = await api.get(`/social/user-posts/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });
}
