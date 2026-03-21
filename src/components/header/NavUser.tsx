"use client";

import { LogOut, User, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
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

export function NavUser() {
  const user = useAuthStore((s) => s.user);
  const logoutMutation = useLogout();
  const router = useRouter();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="flex items-center gap-2 rounded-sm px-2 h-10 hover:bg-input"
            aria-label="Menu do usuário"
          />
        }
      >
        <Avatar className="size-8">
          {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
          <AvatarFallback className="bg-brand/15 text-brand text-xs font-semibold">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
        <div className="hidden sm:flex flex-col items-start text-left leading-tight">
          <p className="text-sm text-foreground font-medium truncate max-w-[120px]">
            {user.name}
          </p>
          <p className="text-xs text-muted-foreground truncate max-w-[120px]">
            {user.email}
          </p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-56 rounded-xl"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2.5 px-2 py-2 text-left text-sm text-foreground">
              <Avatar className="size-9">
                {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
                <AvatarFallback className="bg-brand/15 text-muted-foreground text-xs font-semibold">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm text-foreground leading-tight">
                <p className="truncate text-foreground font-medium">{user.name}</p>
                <p className="truncate text-foreground text-xs">
                  {user.email}
                </p>
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/profile")}>
            <User className="size-4" />
            Minha conta
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          variant="destructive"
        >
          {logoutMutation.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <LogOut className="size-4" />
          )}
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
