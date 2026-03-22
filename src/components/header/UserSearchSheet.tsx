"use client";

import { useState, useMemo } from "react";
import { Search, UserPlus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAllUsers, useStartConversation } from "@/lib/hooks/useChat";
import { useAuthStore } from "@/lib/store/authStore";

export function UserSearchSheet() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const currentUserId = useAuthStore((s) => s.user?.id);
  const { data: users, isLoading } = useAllUsers();
  const startConversation = useStartConversation();

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users
      .filter((u) => u.id !== currentUserId)
      .filter((u) =>
        search.trim()
          ? u.name.toLowerCase().includes(search.toLowerCase())
          : true
      );
  }, [users, search, currentUserId]);

  const handleSelectUser = (userId: number) => {
    startConversation.mutate(userId, {
      onSuccess: (data) => {
        setOpen(false);
        setSearch("");
        router.push(`/chat?id=${data.id}`);
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="size-9 text-muted-foreground hover:text-foreground"
            aria-label="Buscar usuários para conversar"
          />
        }
      >
        <UserPlus className="size-[18px]" />
      </SheetTrigger>
      <SheetContent side="left" className="w-80 sm:w-96 p-0">
        <SheetHeader className="p-4 pb-2 border-b border-border">
          <SheetTitle className="text-base">Procurar</SheetTitle>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar usuário..."
              className="pl-9 h-9 text-sm"
              autoFocus
            />
          </div>
        </SheetHeader>

        <div className="overflow-y-auto flex-1">
          {!search.trim() && (
            <p className="px-4 pt-3 pb-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Sugestões
            </p>
          )}

          {isLoading && (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          )}

          {!isLoading && filteredUsers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-sm text-muted-foreground">
                {search.trim()
                  ? `Nenhum usuário encontrado para "${search}"`
                  : "Nenhum usuário disponível"}
              </p>
            </div>
          )}

          {filteredUsers.map((user) => (
            <Button
              key={user.id}
              variant="ghost"
              onClick={() => handleSelectUser(user.id)}
              disabled={startConversation.isPending}
              className="flex items-center gap-3 w-full h-auto px-4 py-3 justify-start rounded-none"
            >
              <Avatar className="size-10 shrink-0">
                <AvatarImage src={user.avatarUrl ?? undefined} />
                <AvatarFallback className="text-sm bg-brand/10 text-brand">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex justify-start min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user.name}
                </p>
              </div>
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
