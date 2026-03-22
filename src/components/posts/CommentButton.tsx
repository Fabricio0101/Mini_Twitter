"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommentsDialog } from "./CommentsDialog";
import type { Post } from "@/lib/types/post";

interface CommentButtonProps {
  post: Post;
}

export function CommentButton({ post }: CommentButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-1.5 px-2 h-8 text-muted-foreground hover:text-brand"
        title="Comentários"
      >
        <MessageCircle className="size-4" />
        <span className="text-xs">{post.commentsCount}</span>
      </Button>

      <CommentsDialog post={post} open={open} onOpenChange={setOpen} />
    </>
  );
}
