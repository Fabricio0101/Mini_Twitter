"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useChatStore } from "@/lib/store/chatStore";
import { useConversations } from "@/lib/hooks/useChat";
import { formatRelativeTime } from "@/lib/utils/formatRelativeTime";
import type { Conversation } from "@/lib/types/chat";

interface ConversationListProps {
  onSelect: (conv: Conversation) => void;
}

export function ConversationList({ onSelect }: ConversationListProps) {
  const conversations = useChatStore((s) => s.conversations);
  const { isLoading } = useConversations();

  if (isLoading) {
    return (
      <div className="space-y-1 p-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3">
            <Skeleton className="size-10 rounded-full shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <p className="text-sm text-muted-foreground">Nenhuma conversa ainda.</p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          Vá para a página de chat para iniciar uma conversa.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto flex-1 scrollbar-thin">
      {conversations.map((conv) => (
        <button
          key={conv.id}
          onClick={() => onSelect(conv)}
          className="flex items-center gap-3 w-full p-3 hover:bg-muted/50 transition-colors text-left cursor-pointer"
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
                <span className="ml-2 flex items-center justify-center size-5 rounded-full bg-brand text-[10px] font-bold text-brand-foreground shrink-0">
                  {conv.unreadCount}
                </span>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
