"use client";

import { useState, lazy, Suspense } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Post } from "@/lib/types/post";

const PostEditDialog = lazy(() =>
  import("./PostEditDialog").then((m) => ({ default: m.PostEditDialog }))
);
const DeletePostDialog = lazy(() =>
  import("./DeletePostDialog").then((m) => ({ default: m.DeletePostDialog }))
);

interface PostActionsProps {
  post: Post;
}

export function PostActions({ post }: PostActionsProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground"
              aria-label="Ações do post"
              title="Ações do post"
            />
          }
        >
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Pencil className="size-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setDeleteOpen(true)}
            variant="destructive"
          >
            <Trash2 className="size-4" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {editOpen && (
        <Suspense fallback={null}>
          <PostEditDialog post={post} open={editOpen} onOpenChange={setEditOpen} />
        </Suspense>
      )}
      {deleteOpen && (
        <Suspense fallback={null}>
          <DeletePostDialog postId={post.id} open={deleteOpen} onOpenChange={setDeleteOpen} />
        </Suspense>
      )}
    </>
  );
}
