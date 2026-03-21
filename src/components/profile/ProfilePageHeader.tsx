"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function ProfilePageHeader() {
  const router = useRouter();

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.push("/")}
        className="size-9 rounded-full"
        aria-label="Voltar para a timeline"
      >
        <ArrowLeft className="size-4 text-foreground" />
      </Button>
      <h1 className="text-xl text-foreground font-semibold">Perfil</h1>
    </div>
  );
}
