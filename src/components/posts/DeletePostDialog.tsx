"use client";

import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useDeletePost } from "@/lib/hooks/usePosts";

interface DeletePostDialogProps {
  postId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeletePostDialog({ postId, open, onOpenChange }: DeletePostDialogProps) {
  const deletePost = useDeletePost();

  const handleDelete = () => {
    deletePost.mutate(postId, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir post</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-full">Cancelar</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deletePost.isPending}
            className="rounded-full"
          >
            {deletePost.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Excluir"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
