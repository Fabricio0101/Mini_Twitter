"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Loader2, X, Upload } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { postSchema, type PostFormData } from "@/lib/schemas/postSchema";
import { useCreatePost } from "@/lib/hooks/usePosts";
import { useUploadImage } from "@/lib/hooks/useUpload";

export function PostForm() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showDropArea, setShowDropArea] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const createPost = useCreatePost();
  const uploadImage = useUploadImage();
  const formRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      image: "",
    },
  });

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

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setShowDropArea(false);
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

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isSubmitting = createPost.isPending || uploadImage.isPending;

  const onSubmit = async (data: PostFormData) => {
    let imageUrl: string | undefined;

    if (imageFile) {
      try {
        imageUrl = await uploadImage.mutateAsync(imageFile);
      } catch {
        toast.error("Erro ao fazer upload da imagem.");
        return;
      }
    }

    createPost.mutate(
      {
        title: data.title,
        content: data.content,
        image: imageUrl || undefined,
      },
      {
        onSuccess: () => {
          reset();
          removeImage();
          setShowDropArea(false);
          setIsExpanded(false);
          toast.success("Post criado com sucesso!");
        },
        onError: () => {
          toast.error("Erro ao criar post. Tente novamente.");
        },
      }
    );
  };

  return (
    <Card data-tour="post-form" className="border border-border shadow-black/10 shadow-lg bg-card rounded-md p-0">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence initial={false}>
            {!isExpanded && (
              <motion.div
                key="placeholder"
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: "auto",
                  opacity: 1,
                  transition: {
                    height: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
                    opacity: { duration: 0.15, delay: 0.05, ease: "easeIn" },
                  },
                }}
                exit={{
                  height: 0,
                  opacity: 0,
                  transition: {
                    height: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
                    opacity: { duration: 0.1, ease: "easeOut" },
                  },
                }}
                style={{ overflow: "hidden" }}
              >
                <div
                  className="flex h-14 items-start cursor-text text-start text-sm text-muted-foreground/50 pt-2"
                  onClick={() => setIsExpanded(true)}
                >
                  <p>E aí, o que está rolando?</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                key="form-fields"
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: "auto",
                  opacity: 1,
                  transition: {
                    height: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
                    opacity: { duration: 0.15, delay: 0.05, ease: "easeIn" },
                  },
                }}
                exit={{
                  height: 0,
                  opacity: 0,
                  transition: {
                    height: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
                    opacity: { duration: 0.1, ease: "easeOut" },
                  },
                }}
                style={{ overflow: "hidden" }}
                ref={formRef}
              >
                <div className="space-y-3">
                  <Input
                    placeholder="Qual o título do seu post?"
                    aria-invalid={!!errors.title}
                    className="h-10 border-0 border-b border-border/40 rounded-none bg-transparent dark:bg-transparent px-0 text-sm text-foreground font-medium placeholder:text-muted-foreground/50 placeholder:font-normal focus-visible:ring-0 focus-visible:border-brand"
                    {...register("title")}
                  />
                  {errors.title && (
                    <p className="text-xs text-destructive">{errors.title.message}</p>
                  )}

                  <Textarea
                    placeholder="E aí, o que está rolando?"
                    aria-invalid={!!errors.content}
                    className="min-h-16 resize-none border-0 border-b border-border/40 rounded-none bg-transparent dark:bg-transparent px-0 text-sm text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:border-brand"
                    {...register("content")}
                  />
                  {errors.content && (
                    <p className="text-xs text-destructive">
                      {errors.content.message}
                    </p>
                  )}

                  <AnimatePresence>
                    {showDropArea && !imagePreview && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                        style={{ overflow: "hidden" }}
                      >
                        <div
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onClick={() => fileInputRef.current?.click()}
                          className={`mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors ${
                            isDragging
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
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {imagePreview && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                        style={{ overflow: "hidden" }}
                      >
                        <div className="relative mt-2 rounded-lg overflow-hidden border border-border">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full max-h-64 object-cover"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="absolute top-2 right-2 size-7 rounded-full bg-background/80 backdrop-blur-sm"
                            onClick={removeImage}
                          >
                            <X className="size-3.5" />
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleImageSelect}
          />

          <div className="border-t border-border/40 mt-2 pt-3 flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-brand/60 hover:text-brand size-9"
              title="Adicionar imagem"
              onClick={() => {
                if (!isExpanded) setIsExpanded(true);
                if (imagePreview) {
                  removeImage();
                } else {
                  fileInputRef.current?.click();
                }
              }}
            >
              <ImageIcon className="size-5" />
            </Button>

            <div className="flex items-center gap-2">
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    key="cancel-btn"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      className="rounded-full px-5 h-9 text-sm text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        reset();
                        removeImage();
                        setShowDropArea(false);
                        setIsExpanded(false);
                      }}
                    >
                      Cancelar
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
              <Button
                type={isExpanded ? "submit" : "button"}
                disabled={isExpanded && isSubmitting}
                className="rounded-full bg-brand text-white hover:bg-brand-hover px-6 h-9 font-normal text-sm"
                onClick={() => {
                  if (!isExpanded) setIsExpanded(true);
                }}
              >
                {isExpanded && isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {uploadImage.isPending ? "Enviando imagem..." : "Postando..."}
                  </>
                ) : (
                  "Postar"
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
