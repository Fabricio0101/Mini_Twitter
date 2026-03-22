"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { HelpCircle, Map, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TOUR_CONFIGS } from "@/lib/utils/tourConfigs";

const TOUR_ENTRIES = Object.entries(TOUR_CONFIGS);

export function HelpMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleTourSelect = (key: string) => {
    const config = TOUR_CONFIGS[key];
    setOpen(false);
    localStorage.removeItem(`tour-${key}`);

    if (pathname !== config.path) {
      router.push(config.path);
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("tour:start", { detail: key }));
      }, 800);
    } else {
      window.dispatchEvent(new CustomEvent("tour:start", { detail: key }));
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="size-10 rounded-full text-muted-foreground hover:text-foreground"
        onClick={() => setOpen(!open)}
        aria-label="Ajuda"
        title="Ajuda"
      >
        <HelpCircle className="size-4" />
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <Card className="fixed inset-x-4 top-16 z-50 mx-auto max-w-sm md:absolute md:inset-auto md:right-0 md:top-12 md:w-80 shadow-2xl border-border/50 animate-in fade-in-0 slide-in-from-top-2 duration-200">
            <CardContent className="p-0">
              <div className="p-3 border-b border-border">
                <h3 className="font-semibold text-sm text-foreground">Precisa de Ajuda?</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Escolha um tour guiado abaixo</p>
              </div>
              <div className="py-1">
                {TOUR_ENTRIES.map(([key, config]) => (
                  <Button
                    key={key}
                    variant="ghost"
                    className="w-full flex items-start gap-3 px-4 py-3 h-auto text-left rounded-none"
                    onClick={() => handleTourSelect(key)}
                  >
                    <Map className="size-5 text-brand shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{config.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 font-normal">{config.description}</p>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground shrink-0 mt-1" />
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
