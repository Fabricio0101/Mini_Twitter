"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, MessageCircle, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserSearchSheet } from "@/components/header/UserSearchSheet";

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "Início" },
  { href: "/profile", icon: User, label: "Perfil" },
  { href: "/chat", icon: MessageCircle, label: "Chat" },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        if (currentY > lastScrollY.current && currentY > 60) {
          setVisible(false);
        } else {
          setVisible(true);
        }
        lastScrollY.current = currentY;
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 flex md:hidden items-center justify-around border-t border-border bg-background/95 backdrop-blur-sm h-14 transition-transform duration-300",
        visible ? "translate-y-0" : "translate-y-full"
      )}
    >
      {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-[10px] transition-colors",
              isActive ? "text-brand" : "text-muted-foreground"
            )}
          >
            <Icon className="size-5" />
            <span>{label}</span>
          </Link>
        );
      })}
      <div className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-[10px] text-muted-foreground [&_button]:size-5 [&_button]:p-0">
        <UserSearchSheet />
        <span>Procurar</span>
      </div>
    </nav>
  );
}
