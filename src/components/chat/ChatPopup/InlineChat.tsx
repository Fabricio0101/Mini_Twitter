"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/lib/store/chatStore";
import { useMessages, useSendMessage } from "@/lib/hooks/useChat";
import { useAuthStore } from "@/lib/store/authStore";
import type { Conversation } from "@/lib/types/chat";

interface InlineChatProps {
  conversation: Conversation;
  onBack: () => void;
}

export function InlineChat({ conversation, onBack }: InlineChatProps) {
  const [message, setMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const userId = useAuthStore((s) => s.user?.id);
  const allMessages = useChatStore((s) => s.messages);
  const storeMessages = useMemo(
    () => allMessages[conversation.id] ?? [],
    [allMessages, conversation.id]
  );
  const { isLoading } = useMessages(conversation.id);
  const sendMessage = useSendMessage();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [storeMessages]);

  const handleSend = () => {
    if (!message.trim()) return;
    sendMessage(conversation.id, message.trim());
    setMessage("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
        <Button variant="ghost" size="icon" onClick={onBack} className="size-8">
          <ArrowLeft className="size-4" />
        </Button>
        <Avatar className="size-7">
          <AvatarImage src={conversation.otherUserAvatarUrl ?? undefined} />
          <AvatarFallback className="text-[10px] bg-brand/10 text-brand">
            {conversation.otherUserName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium truncate">{conversation.otherUserName}</span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin min-h-0">
        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          </div>
        )}
        {storeMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.senderId === userId ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                msg.senderId === userId
                  ? "bg-brand text-brand-foreground rounded-br-md"
                  : "bg-muted text-foreground rounded-bl-md"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-border flex items-center gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Mensagem..."
          className="h-9 text-sm flex-1"
        />
        <Button
          size="icon"
          onClick={handleSend}
          disabled={!message.trim()}
          className="size-9 shrink-0 bg-brand hover:bg-brand-hover text-brand-foreground rounded-lg"
        >
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  );
}
