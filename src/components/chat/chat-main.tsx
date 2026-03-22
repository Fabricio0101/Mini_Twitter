"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Send, MessageCircle, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMessages, useSendMessage } from "@/lib/hooks/useChat";
import { useChatStore } from "@/lib/store/chatStore";
import { useAuthStore } from "@/lib/store/authStore";
import Link from "next/link";

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface ChatMainProps {
  conversationId: number | null;
  otherUserId?: number;
  otherUserName?: string;
  otherUserAvatarUrl?: string | null;
  onBack?: () => void;
}

const EMPTY_MESSAGES: never[] = [];

export function ChatMain({ conversationId, otherUserId, otherUserName, otherUserAvatarUrl, onBack }: ChatMainProps) {
  const [message, setMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const userId = useAuthStore((s) => s.user?.id);
  const allMessages = useChatStore((s) => s.messages);
  const storeMessages = useMemo(
    () => (conversationId ? allMessages[conversationId] ?? EMPTY_MESSAGES : EMPTY_MESSAGES),
    [allMessages, conversationId]
  );
  const { isLoading } = useMessages(conversationId);
  const sendMessage = useSendMessage();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [storeMessages]);

  const handleSend = async () => {
    if (!message.trim() || !conversationId) return;
    const content = message.trim();
    setMessage("");
    await sendMessage(conversationId, content);
  };

  if (!conversationId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
        <MessageCircle className="size-16 text-muted-foreground/20 mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-1">Suas mensagens</h3>
        <p className="text-sm text-muted-foreground">
          Selecione uma conversa para começar.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <div className="flex items-center gap-3 p-4 border-b border-border">
        {onBack && (
          <Button variant="ghost" size="icon" className="size-9 md:hidden" onClick={onBack}>
            <ArrowLeft className="size-4" />
          </Button>
        )}
        <Link
          href={otherUserId ? `/user/${otherUserId}` : "#"}
          className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity"
        >
          <Avatar className="size-10">
            <AvatarImage src={otherUserAvatarUrl ?? undefined} />
            <AvatarFallback className="text-xs bg-brand/10 text-brand">
              {otherUserName?.charAt(0) ?? "?"}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-sm font-semibold text-foreground">{otherUserName}</h2>
        </Link>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 scrollbar-thin min-h-0">
        <div className="mx-auto max-w-3xl space-y-3">
        {isLoading &&
          [...Array(3)].map((_, i) => (
            <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
              <Skeleton className={`h-10 ${i % 2 === 0 ? "w-48" : "w-36"} rounded-2xl`} />
            </div>
          ))}

        {!isLoading && storeMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MessageCircle className="size-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">Nenhuma mensagem ainda.</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Envie a primeira mensagem!</p>
          </div>
        )}

        {storeMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.senderId === userId ? "justify-end" : "justify-start"}`}
          >
            <div className={`flex items-end gap-2 max-w-[70%] ${msg.senderId === userId ? "flex-row-reverse" : ""}`}>
              {msg.senderId !== userId && (
                <Avatar className="size-7 shrink-0">
                  <AvatarImage src={msg.senderAvatarUrl ?? undefined} />
                  <AvatarFallback className="text-[10px] bg-brand/10 text-brand">
                    {msg.senderName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              )}
              <div>
                <div
                  className={cn(
                    "rounded-2xl px-4 py-2.5",
                    msg.senderId === userId
                      ? "bg-brand text-brand-foreground rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  )}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
                <p className={cn(
                  "text-[10px] text-muted-foreground mt-0.5",
                  msg.senderId === userId ? "text-right" : "text-left"
                )}>
                  {formatTime(msg.createdAt)}
                </p>
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>

      <div className="p-4 border-t border-border flex items-center gap-3">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Digite uma mensagem..."
          className="flex-1 h-10 text-sm"
        />
        <Button
          size="icon"
          onClick={handleSend}
          disabled={!message.trim()}
          className="size-10 shrink-0 rounded-full bg-brand hover:bg-brand-hover text-brand-foreground"
        >
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  );
}