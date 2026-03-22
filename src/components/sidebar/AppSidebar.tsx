"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "Início" },
  { href: "/profile", icon: User, label: "Perfil" },
  { href: "/chat", icon: MessageCircle, label: "Chat" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside
      data-tour="sidebar"
      className="hidden md:flex flex-col h-[calc(100vh-64px)] sticky top-16 border-r border-border transition-all duration-300 z-40 w-14 group hover:w-52"
    >
      <nav className="flex-1 flex flex-col gap-1 py-4 px-2">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link key={href} href={href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 h-10 px-2.5 transition-colors",
                  isActive && "bg-brand/10 text-brand hover:bg-brand/15",
                  !isActive && "text-muted-foreground hover:text-foreground"
                )}
                title={label}
              >
                <Icon className="size-5 shrink-0" />
                <span
                  className="text-sm whitespace-nowrap overflow-hidden transition-all duration-300 opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto"
                >
                  {label}
                </span>
              </Button>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
