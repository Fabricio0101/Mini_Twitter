"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { ChatMain } from "@/components/chat/chat-main";
import { useChatStore } from "@/lib/store/chatStore";

export function ChatContent() {
  const searchParams = useSearchParams();
  const urlConversationId = searchParams.get("id");
  const [activeId, setActiveId] = useState<number | null>(null);
  const conversations = useChatStore((s) => s.conversations);
  const activeConv = conversations.find((c) => c.id === activeId);

  useEffect(() => {
    if (urlConversationId) {
      setActiveId(Number(urlConversationId));
    }
  }, [urlConversationId]);

  return (
    <div data-tour="chat-area" className="flex h-[calc(100vh-64px)] bg-background">
      <div className={`${activeId ? "hidden md:flex" : "flex"} w-full md:w-auto`}>
        <ChatSidebar
          onSelectConversation={setActiveId}
          activeConversationId={activeId}
        />
      </div>
      <div className={`${activeId ? "flex" : "hidden md:flex"} flex-1 min-w-0`}>
        <ChatMain
          conversationId={activeId}
          otherUserId={activeConv?.otherUserId}
          otherUserName={activeConv?.otherUserName}
          otherUserAvatarUrl={activeConv?.otherUserAvatarUrl}
          onBack={() => setActiveId(null)}
        />
      </div>
    </div>
  );
}
