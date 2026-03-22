"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  LogOut,
  User,
  Loader2,
  Home,
  MessageCircle,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SearchCommand } from "@/components/SearchCommand";
import { HelpMenu } from "@/components/tour/HelpMenu";
import { useAuthStore } from "@/lib/store/authStore";
import { useLogout } from "@/lib/hooks/useAuth";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "Início" },
  { href: "/profile", icon: User, label: "Meu Perfil" },
  { href: "/chat", icon: MessageCircle, label: "Chat" },
];

export function HeaderMobile() {
  const user = useAuthStore((s) => s.user);
  const logoutMutation = useLogout();
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);

  if (!user) return null;

  return (
    <header className="flex md:hidden sticky top-0 w-full z-50 border-b border-border bg-background">
      <div className="flex w-full h-14 justify-between items-center px-4">
        <Link href="/">
          <p className="text-lg font-semibold text-brand dark:text-foreground">
            Mini Twitter
          </p>
        </Link>
        <div className="flex items-center gap-1">
          <SearchCommand />
          <HelpMenu />
          <ThemeToggle />
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger
              className="inline-flex items-center justify-center size-9 rounded-md text-foreground hover:bg-accent cursor-pointer"
              aria-label="Menu"
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0">
              <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 p-6 border-b border-border">
                  <Avatar className="size-10">
                    {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
                    <AvatarFallback className="bg-brand/15 text-brand text-sm font-semibold">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                  {NAV_ITEMS.map(({ href, icon: Icon, label }) => (
                    <Button
                      key={href}
                      variant="ghost"
                      className="w-full justify-start text-foreground gap-3 h-11"
                      onClick={() => {
                        router.push(href);
                        setSheetOpen(false);
                      }}
                    >
                      <Icon className="size-4" />
                      {label}
                    </Button>
                  ))}
                </nav>
                <div className="p-4 border-t border-border">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 h-11 text-destructive hover:text-destructive"
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                  >
                    {logoutMutation.isPending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <LogOut className="size-4" />
                    )}
                    Sair
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
