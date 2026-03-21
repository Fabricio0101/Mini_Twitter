"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X, Upload } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { postSchema, type PostFormData } from "@/lib/schemas/postSchema";
import { useUpdatePost } from "@/lib/hooks/usePosts";
import { useUploadImage } from "@/lib/hooks/useUpload";
import type { Post } from "@/lib/types/post";

interface PostEditDialogProps {
  post: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PostEditDialog({ post, open, onOpenChange }: PostEditDialogProps) {
  const updatePost = useUpdatePost();
  const uploadImage = useUploadImage();
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post.title,
      content: post.content,
      image: post.image ?? "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        title: post.title,
        content: post.content,
        image: post.image ?? "",
      });
      setCurrentImage(post.image || null);
      setNewImageFile(null);
      setNewImagePreview(null);
    }
  }, [open, post, reset]);

  const processFile = useCallback((file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Imagem muito grande. Limite: 5MB");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Tipo não permitido. Use: JPEG, PNG, WebP ou GIF");
      return;
    }

    setNewImageFile(file);
    setNewImagePreview(URL.createObjectURL(file));
    setCurrentImage(null);
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeCurrentImage = () => {
    setCurrentImage(null);
  };

  const removeNewImage = () => {
    setNewImageFile(null);
    setNewImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isSubmitting = updatePost.isPending || uploadImage.isPending;

  const onSubmit = async (data: PostFormData) => {
    let imageUrl: string | undefined;

    if (newImageFile) {
      try {
        imageUrl = await uploadImage.mutateAsync(newImageFile);
      } catch {
        toast.error("Erro ao fazer upload da imagem.");
        return;
      }
    } else if (currentImage) {
      imageUrl = currentImage;
    }

    updatePost.mutate(
      {
        id: post.id,
        data: {
          title: data.title,
          content: data.content,
          image: imageUrl || "",
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  const hasImage = !!currentImage || !!newImagePreview;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Título</Label>
            <Input
              id="edit-title"
              placeholder="Título do post"
              className="rounded-xl"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-content">Conteúdo</Label>
            <Textarea
              id="edit-content"
              placeholder="Conteúdo do post"
              className="min-h-24 resize-none rounded-xl"
              {...register("content")}
            />
            {errors.content && (
              <p className="text-xs text-destructive">
                {errors.content.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Imagem</Label>

            {currentImage && (
              <div className="relative rounded-lg overflow-hidden border border-border">
                <img
                  src={currentImage}
                  alt="Imagem atual"
                  className="w-full max-h-48 object-cover"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="absolute top-2 right-2 size-7 rounded-full bg-background/80 backdrop-blur-sm"
                  onClick={removeCurrentImage}
                >
                  <X className="size-3.5" />
                </Button>
              </div>
            )}

            {newImagePreview && (
              <div className="relative rounded-lg overflow-hidden border border-border">
                <img
                  src={newImagePreview}
                  alt="Nova imagem"
                  className="w-full max-h-48 object-cover"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="absolute top-2 right-2 size-7 rounded-full bg-background/80 backdrop-blur-sm"
                  onClick={removeNewImage}
                >
                  <X className="size-3.5" />
                </Button>
              </div>
            )}

            {!hasImage && (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors ${isDragging
                  ? "border-brand bg-brand/5"
                  : "border-border/60 hover:border-brand/40 hover:bg-muted/30"
                  }`}
              >
                <Upload
                  className={`size-8 ${isDragging ? "text-brand" : "text-muted-foreground/40"}`}
                />
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {isDragging ? (
                      <span className="font-medium text-brand">Solte a imagem aqui</span>
                    ) : (
                      <>
                        <span className="font-medium text-foreground">
                          Clique para selecionar
                        </span>{" "}
                        ou arraste uma imagem
                      </>
                    )}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground/60">
                    JPEG, PNG, WebP ou GIF · Máx. 5MB
                  </p>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleImageSelect}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-full"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-brand text-brand-foreground hover:bg-brand-hover px-6 font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {uploadImage.isPending ? "Enviando..." : "Salvando..."}
                </>
              ) : (
                "Salvar"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
