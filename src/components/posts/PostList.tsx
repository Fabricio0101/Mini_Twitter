"use client";

import { useEffect } from "react";
import { Loader2, SearchX, MessageSquarePlus } from "lucide-react";
import { PostCard } from "@/components/posts/PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { usePosts } from "@/lib/hooks/usePosts";
import { useIntersection } from "@/lib/hooks/useIntersection";

interface PostListProps {
  search?: string;
}

function PostCardSkeleton() {
  return (
    <Card className="border-0 shadow-black/10 shadow-lg bg-card rounded-md p-4">
      <CardContent className="p-0 space-y-3">
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-5 w-3/4" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Skeleton className="h-8 w-16 rounded-md" />
      </CardContent>
    </Card>
  );
}

export function PostList({ search }: PostListProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = usePosts(search);

  const { ref, isIntersecting } = useIntersection({
    threshold: 0.1,
  });

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <PostCardSkeleton />
        <PostCardSkeleton />
        <PostCardSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            Erro ao carregar posts. Tente novamente.
          </p>
        </CardContent>
      </Card>
    );
  }

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  if (posts.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center flex flex-col items-center gap-3">
          {search ? (
            <>
              <SearchX className="size-10 text-muted-foreground" />
              <p className="text-muted-foreground">
                Nenhum post encontrado para &quot;{search}&quot;
              </p>
            </>
          ) : (
            <>
              <MessageSquarePlus className="size-10 text-muted-foreground" />
              <p className="text-muted-foreground">
                Nenhum post ainda. Seja o primeiro a postar!
              </p>
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      <div ref={ref} className="h-10" />

      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Loader2 className="size-6 animate-spin text-brand" />
        </div>
      )}

      {!hasNextPage && posts.length > 0 && (
        <p className="text-center text-sm text-muted-foreground py-6">
          Isso é tudo! Você viu todos os posts.
        </p>
      )}
    </div>
  );
}
