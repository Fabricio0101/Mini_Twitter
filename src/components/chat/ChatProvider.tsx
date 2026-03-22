"use client";

import { usePathname } from "next/navigation";
import { useChatWebSocket } from "@/lib/hooks/useChat";
import { ChatFloatingBar } from "@/components/chat/ChatFloatingBar";
import { ChatPopup } from "@/components/chat/ChatPopup";

export function ChatProvider() {
  useChatWebSocket();
  const pathname = usePathname();
  const isTimeline = pathname === "/";

  return (
    <>
      {isTimeline && <ChatFloatingBar />}
      {isTimeline && <ChatPopup />}
    </>
  );
}
