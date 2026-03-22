"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLike } from "@/lib/hooks/useLike";
import { useLikedPostsStore } from "@/lib/store/likedPostsStore";
import { useAuthStore } from "@/lib/store/authStore";

interface LikeButtonProps {
  postId: number;
  likesCount: number;
}

export function LikeButton({ postId, likesCount }: LikeButtonProps) {
  const token = useAuthStore((s) => s.token);
  const isLiked = useLikedPostsStore((s) => s.isLiked(postId));
  const likeMutation = useLike(postId);

  const handleLike = () => {
    if (!token) return;
    likeMutation.mutate();
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      disabled={!token || likeMutation.isPending}
      title={isLiked ? "Descurtir" : "Curtir"}
      className="gap-1.5 px-2 h-8 text-muted-foreground hover:text-red-500"
    >
      <Heart
        className={`size-4 transition-colors ${
          isLiked ? "fill-red-500 text-red-500" : ""
        }`}
      />
      <span className="text-xs">{likesCount}</span>
    </Button>
  );
}
