"use client";

import { Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRepost } from "@/lib/hooks/useSocial";
import { useAuthStore } from "@/lib/store/authStore";
import { cn } from "@/lib/utils";

interface RepostButtonProps {
  postId: number;
  repostsCount: number;
  repostedByMe: number;
}

export function RepostButton({ postId, repostsCount, repostedByMe }: RepostButtonProps) {
  const repostMutation = useRepost();
  const token = useAuthStore((s) => s.token);
  const isReposted = repostedByMe > 0;

  const handleRepost = () => {
    repostMutation.mutate(postId);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleRepost}
      disabled={!token || repostMutation.isPending}
      title={isReposted ? "Desfazer repost" : "Repostar"}
      className={cn(
        "gap-1.5 px-2 h-8 text-muted-foreground hover:text-green-500",
        isReposted && "text-green-500"
      )}
    >
      <Repeat className={cn("size-4", isReposted && "text-green-500")} />
      <span className="text-xs">{repostsCount || 0}</span>
    </Button>
  );
}
