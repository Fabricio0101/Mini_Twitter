"use client";

import { useState } from "react";
import { X, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/lib/store/chatStore";
import { ConversationList } from "./ConversationList";
import { InlineChat } from "./InlineChat";
import type { Conversation } from "@/lib/types/chat";
import Link from "next/link";

export function ChatPopup() {
  const isPopupOpen = useChatStore((s) => s.isPopupOpen);
  const setPopupOpen = useChatStore((s) => s.setPopupOpen);
  const unreadTotal = useChatStore((s) => s.unreadTotal);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);

  if (!isPopupOpen) return null;

  return (
    <div className="fixed bottom-20 right-6 z-50 w-[360px] h-[480px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 duration-200">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-foreground">Mensagens</h3>
          {unreadTotal > 0 && (
            <span className="flex items-center justify-center px-1.5 py-0.5 rounded-full bg-brand text-[11px] font-bold text-brand-foreground min-w-[20px]">
              {unreadTotal}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Link href="/chat">
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => setPopupOpen(false)}
            >
              <Maximize2 className="size-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => setPopupOpen(false)}
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        {activeConv ? (
          <InlineChat conversation={activeConv} onBack={() => setActiveConv(null)} />
        ) : (
          <ConversationList onSelect={setActiveConv} />
        )}
      </div>
    </div>
  );
}
