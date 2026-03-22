"use client";

import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorite } from "@/lib/hooks/useSocial";
import { useAuthStore } from "@/lib/store/authStore";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  postId: number;
  favoritedByMe: number;
}

export function FavoriteButton({ postId, favoritedByMe }: FavoriteButtonProps) {
  const favoriteMutation = useFavorite();
  const token = useAuthStore((s) => s.token);
  const isFavorited = favoritedByMe > 0;

  const handleFavorite = () => {
    favoriteMutation.mutate(postId);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleFavorite}
      disabled={!token || favoriteMutation.isPending}
      title={isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      className={cn(
        "gap-1.5 px-2 h-8 text-muted-foreground hover:text-yellow-500",
        isFavorited && "text-yellow-500"
      )}
    >
      <Bookmark
        className={cn("size-4", isFavorited && "fill-yellow-500 text-yellow-500")}
      />
    </Button>
  );
}
