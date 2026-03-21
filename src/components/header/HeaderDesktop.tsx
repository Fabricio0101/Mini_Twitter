"use client";

import { Search } from "lucide-react";
import { SearchCommand } from "@/components/SearchCommand";
import { NavUser } from "@/components/header/NavUser";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";

export function HeaderDesktop() {
  return (
    <header className="hidden md:flex relative w-full z-50 border-b border-border">
      <div className="flex w-full h-16 justify-between items-center px-8">
        <Link href="/">
          <p className="relative z-10 text-lg font-semibold text-brand dark:text-foreground shrink-0">
            Mini Twitter
          </p>
        </Link>
        <div className="absolute inset-0 flex items-center justify-center px-4 pointer-events-none">
          <div className="w-full max-w-2xl pointer-events-auto">
            <SearchCommand
              trigger={
                <button
                  className="flex items-center w-full h-10 rounded-md bg-card dark:bg-card border border-border text-sm text-muted-foreground/50 px-3 gap-2 cursor-pointer hover:border-brand/40 transition-colors"
                  aria-label="Buscar posts"
                >
                  <Search className="size-4 text-muted-foreground/60" />
                  <span>Buscar por post...</span>
                </button>
              }
            />
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-2">
          <ThemeToggle />
          <NavUser />
        </div>
      </div>
    </header>
  );
}
