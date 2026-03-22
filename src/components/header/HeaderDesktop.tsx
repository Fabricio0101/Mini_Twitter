"use client";

import { Search } from "lucide-react";
import { SearchCommand } from "@/components/SearchCommand";
import { NavUser } from "@/components/header/NavUser";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HelpMenu } from "@/components/tour/HelpMenu";
import { UserSearchSheet } from "@/components/header/UserSearchSheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeaderDesktop() {
  return (
    <header className="hidden md:flex sticky top-0 relative w-full z-50 border-b border-border bg-background">
      <div className="flex w-full h-16 justify-between items-center px-8">
        <Link href="/">
          <p className="relative z-10 text-lg font-semibold text-brand dark:text-foreground shrink-0">
            Mini Twitter
          </p>
        </Link>
        <div className="absolute inset-0 flex items-center justify-center pl-14 px-4 pointer-events-none">
          <div className="w-full max-w-2xl flex items-center gap-2 pointer-events-auto">
            <div data-tour="user-search">
              <UserSearchSheet />
            </div>
            <div className="flex-1">
              <SearchCommand
                trigger={
                  <Button
                    variant="outline"
                    className="flex items-center w-full h-10 rounded-md bg-card dark:bg-card border border-border text-sm text-muted-foreground/50 px-3 gap-2 cursor-pointer hover:border-brand/40 transition-colors justify-start font-normal"
                    aria-label="Buscar posts"
                    title="Buscar posts"
                  >
                    <Search className="size-4 text-muted-foreground/60" />
                    <span>Buscar por post...</span>
                  </Button>
                }
              />
            </div>
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-2">
          <HelpMenu />
          <ThemeToggle />
          <NavUser />
        </div>
      </div>
    </header>
  );
}

