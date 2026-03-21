"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";
import { useLikedPostsStore } from "@/lib/store/likedPostsStore";
import type { LikeResponse, PostsResponse } from "@/lib/types/post";
import type { InfiniteData } from "@tanstack/react-query";

export function useLike(postId: number) {
  const queryClient = useQueryClient();
  const { isLiked, toggleLike } = useLikedPostsStore();

  return useMutation({
    mutationFn: async () => {
      const response = await api.post<LikeResponse>(`/posts/${postId}/like`);
      return response.data;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previousData = queryClient.getQueriesData<InfiniteData<PostsResponse>>({
        queryKey: ["posts"],
      });

      const wasLiked = isLiked(postId);

      queryClient.setQueriesData<InfiniteData<PostsResponse>>(
        { queryKey: ["posts"] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              posts: page.posts.map((post) =>
                post.id === postId
                  ? {
                      ...post,
                      likesCount: post.likesCount + (wasLiked ? -1 : 1),
                    }
                  : post
              ),
            })),
          };
        }
      );

      toggleLike(postId);

      return { previousData, wasLiked };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          if (data) {
            queryClient.setQueryData(queryKey, data);
          }
        });
      }
      if (context) {
        toggleLike(postId);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
