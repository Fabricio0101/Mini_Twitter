"use client";

import { MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CommentItem } from "./CommentItem";
import { CommentForm } from "./CommentForm";
import { LikeButton } from "./LikeButton";
import { useComments } from "@/lib/hooks/useComments";
import { useMobile } from "@/lib/hooks/useMobile";
import type { Post } from "@/lib/types/post";

interface CommentsDialogProps {
  post: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function CommentSkeleton() {
  return (
    <div className="flex gap-3 py-3">
      <Skeleton className="size-8 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-3 w-10" />
        </div>
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-3/4" />
      </div>
    </div>
  );
}

function CommentsList({ post }: { post: Post }) {
  const { data: comments, isLoading } = useComments(post.id);

  return (
    <>
      {isLoading && (
        <div className="divide-y divide-border">
          <CommentSkeleton />
          <CommentSkeleton />
          <CommentSkeleton />
        </div>
      )}

      {!isLoading && (!comments || comments.length === 0) && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <MessageCircle className="size-10 text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground">
            Sem comentários ainda.
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Seja o primeiro a comentar!
          </p>
        </div>
      )}

      {comments && comments.length > 0 && (
        <div className="divide-y divide-border">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </>
  );
}

function PostHeader({ post }: { post: Post }) {
  return (
    <div className="flex items-center gap-3 pb-3">
      <Avatar className="size-9 shrink-0">
        <AvatarImage src={post.authorAvatarUrl ?? undefined} />
        <AvatarFallback className="text-xs bg-brand/10 text-brand">
          {post.authorName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span className="font-semibold text-sm text-foreground">
        {post.authorName}
      </span>
    </div>
  );
}

function DesktopLayout({ post }: { post: Post }) {
  return (
    <div className="flex gap-0 -m-4 h-[80vh]">
      {post.image && (
        <div className="w-[55%] shrink-0 bg-black flex items-center justify-center rounded-l-xl overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-contain max-h-[80vh]"
          />
        </div>
      )}

      <div className={`flex flex-col ${post.image ? "w-[45%]" : "w-full"} min-w-0`}>
        <div className="p-4 border-b border-border">
          <PostHeader post={post} />
          <h3 className="font-semibold text-foreground">{post.title}</h3>
          <p className="text-sm text-foreground/80 mt-1 whitespace-pre-wrap">
            {post.content}
          </p>
          <div className="mt-2">
            <LikeButton postId={post.id} likesCount={post.likesCount} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 min-h-0 scrollbar-thin">
          <CommentsList post={post} />
        </div>

        <div className="p-4 border-t border-border">
          <CommentForm postId={post.id} />
        </div>
      </div>
    </div>
  );
}

function MobileLayout({ post }: { post: Post }) {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <PostHeader post={post} />

      {post.image && (
        <div className="mb-3 -mx-4 bg-black">
          <img
            src={post.image}
            alt={post.title}
            className="w-full max-h-64 object-contain"
          />
        </div>
      )}

      <h3 className="font-semibold text-foreground">{post.title}</h3>
      <p className="text-sm text-foreground/80 mt-1 whitespace-pre-wrap line-clamp-4">
        {post.content}
      </p>
      <div className="mt-2 mb-3">
        <LikeButton postId={post.id} likesCount={post.likesCount} />
      </div>

      <Separator />

      <div className="flex-1 overflow-y-auto min-h-0 py-1 scrollbar-thin">
        <CommentsList post={post} />
      </div>

      <Separator />

      <div className="pt-3">
        <CommentForm postId={post.id} />
      </div>
    </div>
  );
}

export function CommentsDialog({ post, open, onOpenChange }: CommentsDialogProps) {
  const isMobile = useMobile();

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[90vh] rounded-t-2xl flex flex-col px-4 pb-4 overflow-hidden">
          <SheetHeader className="px-0">
            <SheetTitle>Comentários</SheetTitle>
          </SheetHeader>
          <MobileLayout post={post} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="sm:max-w-4xl w-[90vw] h-[80vh] p-4 overflow-hidden"
      >
        <DesktopLayout post={post} />
      </DialogContent>
    </Dialog>
  );
}
