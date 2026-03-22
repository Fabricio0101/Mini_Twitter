"use client";

import { useState } from "react";
import { Heart, ChevronDown, ChevronUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRelativeTime } from "@/lib/utils/formatRelativeTime";
import { useReplies, useToggleCommentLike } from "@/lib/hooks/useComments";
import { useAuthStore } from "@/lib/store/authStore";
import type { Comment } from "@/lib/types/post";
import { cn } from "@/lib/utils";

interface CommentItemProps {
  comment: Comment;
  postId: number;
  isReply?: boolean;
  onReply?: (commentId: number, authorName: string) => void;
}

export function CommentItem({ comment, postId, isReply = false, onReply }: CommentItemProps) {
  const [showReplies, setShowReplies] = useState(false);
  const [liked, setLiked] = useState(comment.likedByMe);
  const [likesCount, setLikesCount] = useState(comment.likesCount);
  const token = useAuthStore((s) => s.token);

  const toggleLike = useToggleCommentLike(postId);
  const { data: replies, refetch, isFetching } = useReplies(comment.id);

  const handleLike = () => {
    if (!token) return;
    setLiked((prev) => !prev);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));

    toggleLike.mutate(comment.id, {
      onError: () => {
        setLiked((prev) => !prev);
        setLikesCount((prev) => (liked ? prev + 1 : prev - 1));
      },
    });
  };

  const handleToggleReplies = () => {
    if (!showReplies) {
      refetch();
    }
    setShowReplies((prev) => !prev);
  };

  return (
    <div className={cn("py-2.5", isReply && "pl-10")}>
      <div className="flex gap-3">
        <Avatar className={cn("shrink-0", isReply ? "size-7" : "size-8")}>
          <AvatarImage src={comment.authorAvatarUrl ?? undefined} />
          <AvatarFallback className="text-xs bg-brand/10 text-brand">
            {comment.authorName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <span className="text-sm font-semibold text-foreground">
                {comment.authorName}
              </span>
              <span className="text-sm text-foreground/80 ml-1.5">
                {comment.content}
              </span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleLike}
              disabled={!token}
              className="size-7 shrink-0 -mr-1 mt-0.5"
              aria-label={liked ? "Descurtir comentário" : "Curtir comentário"}
            >
              <Heart
                className={cn(
                  "size-3.5 transition-all",
                  liked
                    ? "fill-red-500 text-red-500 scale-110"
                    : "text-muted-foreground hover:text-red-400"
                )}
              />
            </Button>
          </div>

          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(comment.createdAt)}
            </span>
            {likesCount > 0 && (
              <span className="text-xs font-medium text-muted-foreground">
                {likesCount} {likesCount === 1 ? "curtida" : "curtidas"}
              </span>
            )}
            {!isReply && token && (
              <Button
                variant="link"
                onClick={() => onReply?.(comment.id, comment.authorName)}
                className="h-auto p-0 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                Responder
              </Button>
            )}
          </div>
        </div>
      </div>

      {!isReply && comment.repliesCount > 0 && (
        <Button
          variant="link"
          onClick={handleToggleReplies}
          className="flex items-center gap-1.5 ml-11 mt-2 h-auto p-0 text-xs font-medium text-muted-foreground hover:text-foreground no-underline"
        >
          <span className="w-6 h-px bg-muted-foreground/40" />
          {showReplies ? (
            <>
              <span>Ocultar respostas</span>
              <ChevronUp className="size-3" />
            </>
          ) : (
            <>
              <span>Ver respostas ({comment.repliesCount})</span>
              <ChevronDown className="size-3" />
            </>
          )}
        </Button>
      )}

      {showReplies && (
        <div className="mt-1">
          {isFetching && !replies && (
            <div className="pl-10 py-2">
              <Skeleton className="h-3 w-32" />
            </div>
          )}
          {replies?.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              isReply
            />
          ))}
        </div>
      )}
    </div>
  );
}
