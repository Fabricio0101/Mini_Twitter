import { Suspense } from "react";
import { ChatContent } from "@/components/chat/ChatContent";

export default function ChatPage() {
  return (
    <Suspense>
      <ChatContent />
    </Suspense>
  );
}
