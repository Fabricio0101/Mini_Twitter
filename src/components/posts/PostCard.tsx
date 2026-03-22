"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { LikeButton } from "@/components/posts/LikeButton";
import { CommentButton } from "@/components/posts/CommentButton";
import { RepostButton } from "@/components/posts/RepostButton";
import { FavoriteButton } from "@/components/posts/FavoriteButton";
import { PostActions } from "@/components/posts/PostActions";
import { Eye } from "lucide-react";
import { useTrackView } from "@/lib/hooks/useTrackView";
import type { Post } from "@/lib/types/post";

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getHandle(name: string) {
  return `@${name.toLowerCase().replace(/\s+/g, "")}`;
}

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  useTrackView(post.id);

  return (
    <Card data-tour="post-card" className="border border-border shadow-black/10 shadow-lg bg-card rounded-md p-3 md:p-4">
      <CardContent className="p-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-1.5 text-sm flex-wrap">
            <Link href={`/user/${post.authorId}`} className="font-medium text-post-heading hover:underline">
              {post.authorName}
            </Link>
            <span className="text-xs text-muted-foreground">
              {getHandle(post.authorName)}
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">
              {formatDate(post.createdAt)}
            </span>
          </div>
          {post.isOwner && <PostActions post={post} />}
        </div>

        <h3 className="mt-2 font-semibold leading-snug text-post-heading">
          {post.title}
        </h3>
        <p className="text-sm text-post-body leading-relaxed mt-1 whitespace-pre-wrap">
          {post.content}
        </p>

        {post.image && (
          <div className="mt-3 overflow-hidden rounded-xl">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-auto max-h-80 object-cover"
              loading="lazy"
            />
          </div>
        )}

        <div className="mt-3 flex items-center gap-1">
          <LikeButton postId={post.id} likesCount={post.likesCount} />
          <CommentButton post={post} />
          <RepostButton postId={post.id} repostsCount={post.repostsCount} repostedByMe={post.repostedByMe} />
          <FavoriteButton postId={post.id} favoritedByMe={post.favoritedByMe} />
          <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground" title="Visualizações">
            <Eye className="size-3.5" />
            <span>{post.viewsCount || 0}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
