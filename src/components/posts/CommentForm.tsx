"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateComment } from "@/lib/hooks/useComments";
import { useAuthStore } from "@/lib/store/authStore";

interface CommentFormProps {
  postId: number;
}

export function CommentForm({ postId }: CommentFormProps) {
  const [content, setContent] = useState("");
  const token = useAuthStore((s) => s.token);
  const createComment = useCreateComment(postId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !token) return;

    createComment.mutate(
      { content: content.trim() },
      { onSuccess: () => setContent("") }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={token ? "Escreva um comentário..." : "Faça login para comentar"}
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
  );
}
