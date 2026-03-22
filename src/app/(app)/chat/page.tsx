"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { ChatMain } from "@/components/chat/chat-main";
import { useChatStore } from "@/lib/store/chatStore";

function ChatContent() {
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
    <div className="flex h-[calc(100vh-64px)] bg-background">
      <ChatSidebar
        onSelectConversation={setActiveId}
        activeConversationId={activeId}
      />
      <ChatMain
        conversationId={activeId}
        otherUserName={activeConv?.otherUserName}
        otherUserAvatarUrl={activeConv?.otherUserAvatarUrl}
      />
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense>
      <ChatContent />
    </Suspense>
  );
}
