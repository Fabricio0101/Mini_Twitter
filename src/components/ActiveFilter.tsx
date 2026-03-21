"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActiveFilterProps {
  query: string;
}

export function ActiveFilter({ query }: ActiveFilterProps) {
  const router = useRouter();

  return (
    <div className="relative flex flex-col gap-1 px-3 py-2 rounded-lg bg-brand/10 border border-brand/20 text-sm">
      <span className="text-muted-foreground text-xs">Filtrando por:</span>
      <span className="font-medium text-foreground pr-6">&quot;{query}&quot;</span>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 size-6 shrink-0 rounded-full text-foreground hover:bg-brand/20"
        onClick={() => router.replace("/")}
        aria-label="Remover filtro"
      >
        <X className="size-3.5" />
      </Button>
    </div>
  );
}
