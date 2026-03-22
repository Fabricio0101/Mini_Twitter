"use client";

import { useRef } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/lib/store/themeStore";
import { useMobile } from "@/lib/hooks/useMobile";


export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const mobile = useMobile();

  const handleToggle = () => {
    if (
      !("startViewTransition" in document) ||
      !buttonRef.current
    ) {
      toggleTheme();
      return;
    }

    const rect = buttonRef.current.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    document.documentElement.style.setProperty("--toggle-x", `${x}px`);
    document.documentElement.style.setProperty("--toggle-y", `${y}px`);

    (document as Document & { startViewTransition: (cb: () => void) => void })
      .startViewTransition(() => {
        document.documentElement.classList.toggle("dark");
        toggleTheme();
      });
  };

  return (
    <Button
      ref={buttonRef}
      data-tour="theme-toggle"
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className={`size-10 rounded-full hover:text-foreground ${mobile ? "text-foreground" : "text-muted-foreground"}`}
      aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
      title={theme === "dark" ? "Modo claro" : "Modo escuro"}
    >
      {theme === "dark" ? (
        <Sun className={mobile ? "size-5" : "size-4"} />
      ) : (
        <Moon className={mobile ? "size-5" : "size-4"} />
      )}
    </Button>
  );
}

