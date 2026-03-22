"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateComment } from "@/lib/hooks/useComments";
import { useAuthStore } from "@/lib/store/authStore";

interface CommentFormProps {
  postId: number;
  replyTo?: { commentId: number; authorName: string } | null;
  onCancelReply?: () => void;
}

export function CommentForm({ postId, replyTo, onCancelReply }: CommentFormProps) {
  const [content, setContent] = useState("");
  const token = useAuthStore((s) => s.token);
  const createComment = useCreateComment(postId);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (replyTo) {
      inputRef.current?.focus();
    }
  }, [replyTo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !token) return;

    createComment.mutate(
      {
        content: content.trim(),
        ...(replyTo ? { parentId: replyTo.commentId } : {}),
      },
      {
        onSuccess: () => {
          setContent("");
          onCancelReply?.();
        },
      }
    );
  };

  return (
    <div>
      {replyTo && (
        <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
          <span>
            Respondendo a <strong className="text-foreground">{replyTo.authorName}</strong>
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancelReply}
            className="size-5"
          >
            <X className="size-3" />
          </Button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Input
          ref={inputRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={
            !token
              ? "Faça login para comentar"
              : replyTo
                ? `Responder a ${replyTo.authorName}...`
                : "Escreva um comentário..."
          }
          disabled={!token || createComment.isPending}
          className="h-10 text-sm flex-1"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!content.trim() || !token || createComment.isPending}
          className="size-10 shrink-0 bg-brand hover:bg-brand-hover text-brand-foreground rounded-lg"
        >
          {createComment.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
        </Button>
      </form>
    </div>
  );
}
