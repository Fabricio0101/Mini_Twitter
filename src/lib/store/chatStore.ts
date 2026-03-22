import { create } from "zustand";
import type { Conversation, Message } from "@/lib/types/chat";

interface ChatState {
  conversations: Conversation[];
  activeConversationId: number | null;
  messages: Record<number, Message[]>;
  isPopupOpen: boolean;
  isInChat: boolean;
  ws: WebSocket | null;
  unreadTotal: number;

  setConversations: (conversations: Conversation[]) => void;
  setActiveConversation: (id: number | null) => void;
  addMessage: (message: Message) => void;
  setMessages: (conversationId: number, messages: Message[]) => void;
  togglePopup: () => void;
  setPopupOpen: (open: boolean) => void;
  setInChat: (inChat: boolean) => void;
  setWs: (ws: WebSocket | null) => void;
  computeUnreadTotal: () => void;
}

export const useChatStore = create<ChatState>()((set, get) => ({
  conversations: [],
  activeConversationId: null,
  messages: {},
  isPopupOpen: false,
  isInChat: false,
  ws: null,
  unreadTotal: 0,

  setConversations: (conversations) => {
    set({ conversations });
    get().computeUnreadTotal();
  },

  setActiveConversation: (id) => set({ activeConversationId: id }),

  addMessage: (message) => {
    const { messages } = get();
    const convMessages = messages[message.conversationId] || [];
    const exists = convMessages.some((m) => m.id === message.id);
    if (exists) return;

    set({
      messages: {
        ...messages,
        [message.conversationId]: [...convMessages, message],
      },
    });
  },

  setMessages: (conversationId, msgs) => {
    set((state) => ({
      messages: { ...state.messages, [conversationId]: msgs },
    }));
  },

  togglePopup: () => set((state) => ({ isPopupOpen: !state.isPopupOpen })),
  setPopupOpen: (open) => set({ isPopupOpen: open }),
  setInChat: (inChat) => set({ isInChat: inChat }),
  setWs: (ws) => set({ ws }),

  computeUnreadTotal: () => {
    const total = get().conversations.reduce((sum, c) => sum + c.unreadCount, 0);
    set({ unreadTotal: total });
  },
}));
