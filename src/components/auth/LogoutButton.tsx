"use client";

import { LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/lib/hooks/useAuth";

export function LogoutButton() {
  const logoutMutation = useLogout();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => logoutMutation.mutate()}
      disabled={logoutMutation.isPending}
      className="rounded-full bg-brand text-brand-foreground hover:bg-brand-hover size-10"
    >
      {logoutMutation.isPending ? (
        <Loader2 className="size-5 animate-spin" />
      ) : (
        <LogOut className="size-5" />
      )}
    </Button>
  );
}
