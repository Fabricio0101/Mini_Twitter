"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/utils/formatRelativeTime";
import { useConversations } from "@/lib/hooks/useChat";
import { useChatStore } from "@/lib/store/chatStore";
import { useState } from "react";

interface ChatSidebarProps {
  onSelectConversation?: (conversationId: number) => void;
  activeConversationId?: number | null;
}

export function ChatSidebar({ onSelectConversation, activeConversationId }: ChatSidebarProps) {
  const [search, setSearch] = useState("");
  const conversations = useChatStore((s) => s.conversations);
  const { isLoading } = useConversations();

  const filtered = search
    ? conversations.filter((c) =>
        c.otherUserName.toLowerCase().includes(search.toLowerCase())
      )
    : conversations;

  return (
    <div className="flex w-80 flex-col border-r border-border p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Chat</h1>
      </div>

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar conversa..."
          className="pl-9 h-9 text-sm"
        />
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto scrollbar-thin">
        {isLoading &&
          [...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3">
              <Skeleton className="size-10 rounded-full shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-3 w-36" />
              </div>
            </div>
          ))}

        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">Nenhuma conversa encontrada.</p>
          </div>
        )}

        {filtered.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelectConversation?.(conv.id)}
            className={cn(
              "flex items-center gap-3 w-full p-3 rounded-lg transition-colors text-left cursor-pointer",
              activeConversationId === conv.id
                ? "bg-muted"
                : "hover:bg-muted/50"
            )}
          >
            <Avatar className="size-10 shrink-0">
              <AvatarImage src={conv.otherUserAvatarUrl ?? undefined} />
              <AvatarFallback className="text-xs bg-brand/10 text-brand">
                {conv.otherUserName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground truncate">
                  {conv.otherUserName}
                </span>
                <span className="text-[11px] text-muted-foreground shrink-0">
                  {formatRelativeTime(conv.lastMessageAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground truncate">
                  {conv.lastMessage || "Sem mensagens"}
                </p>
                {conv.unreadCount > 0 && (
                  <span className="ml-2 size-5 flex items-center justify-center rounded-full bg-brand text-[10px] font-bold text-brand-foreground shrink-0">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}