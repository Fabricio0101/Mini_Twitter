"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";
import { PostCard } from "@/components/posts/PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Bookmark } from "lucide-react";
import type { PostsResponse } from "@/lib/types/post";

export default function FavoritesPage() {
  const { data, isLoading } = useQuery<PostsResponse>({
    queryKey: ["favorites"],
    queryFn: async () => {
      const response = await api.get("/social/favorites");
      return response.data;
    },
  });

  const posts = data?.posts ?? [];

  return (
    <div className="mx-auto max-w-2xl px-4 md:px-0 py-4 md:py-6 space-y-4 md:space-y-6">
      <h1 className="text-xl font-bold text-foreground">Favoritos</h1>

      {isLoading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-4">
              <CardContent className="p-0 space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && posts.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center flex flex-col items-center gap-3">
            <Bookmark className="size-10 text-muted-foreground" />
            <p className="text-muted-foreground">
              Nenhum post favoritado ainda.
            </p>
          </CardContent>
        </Card>
      )}

      {posts.length > 0 && (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
