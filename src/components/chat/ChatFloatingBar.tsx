"use client";

import { MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/lib/store/chatStore";
import { useConversations } from "@/lib/hooks/useChat";
import { useAuthStore } from "@/lib/store/authStore";

export function ChatFloatingBar() {
  const token = useAuthStore((s) => s.token);
  const togglePopup = useChatStore((s) => s.togglePopup);
  const unreadTotal = useChatStore((s) => s.unreadTotal);
  const conversations = useChatStore((s) => s.conversations);

  useConversations();

  if (!token) return null;

  const recentAvatars = conversations.slice(0, 3);

  return (
    <Button
      data-tour="chat-floating"
      variant="outline"
      onClick={togglePopup}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-full bg-card border border-border px-5 py-3 h-auto shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
    >
      <div className="relative">
        <MessageCircle className="size-5 text-brand" />
        {unreadTotal > 0 && (
          <Badge className="absolute -top-2 -right-2 size-4 p-0 flex items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
            {unreadTotal > 9 ? "9+" : unreadTotal}
          </Badge>
        )}
      </div>
      <span className="text-sm font-medium text-foreground">Mensagens</span>
      {recentAvatars.length > 0 && (
        <div className="flex -space-x-2">
          {recentAvatars.map((c) => (
            <Avatar key={c.id} className="size-6 border-2 border-card">
              <AvatarImage src={c.otherUserAvatarUrl ?? undefined} />
              <AvatarFallback className="text-[10px] bg-brand/10 text-foreground">
                {c.otherUserName.charAt(0)}
              </AvatarFallback>
            </Avatar>
          ))}
          {conversations.length > 3 && (
            <div className="flex items-center justify-center size-6 rounded-full bg-muted border-2 border-card text-[10px] font-medium text-muted-foreground">
              +{conversations.length - 3}
            </div>
          )}
        </div>
      )}
    </Button>
  );
}
