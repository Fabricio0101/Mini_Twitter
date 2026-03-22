import { useEffect, useCallback, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";
import { useAuthStore } from "@/lib/store/authStore";
import { useChatStore } from "@/lib/store/chatStore";
import type { Conversation, Message, ChatUser } from "@/lib/types/chat";

export function useConversations() {
  const setConversations = useChatStore((s) => s.setConversations);

  return useQuery<Conversation[]>({
    queryKey: ["conversations"],
    queryFn: async () => {
      const { data } = await api.get("/conversations");
      setConversations(data);
      return data;
    },
    refetchInterval: 10000,
  });
}

export function useMessages(conversationId: number | null) {
  const setMessages = useChatStore((s) => s.setMessages);

  return useQuery<Message[]>({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      if (!conversationId) return [];
      const { data } = await api.get(`/conversations/${conversationId}/messages`);
      setMessages(conversationId, data);
      return data;
    },
    enabled: !!conversationId,
  });
}

export function useSendMessage() {
  const addMessage = useChatStore((s) => s.addMessage);
  const queryClient = useQueryClient();

  return useCallback(
    async (conversationId: number, content: string) => {
      try {
        const { data } = await api.post(`/conversations/${conversationId}/messages`, { content });
        addMessage(data);
        queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      } catch {
        queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      }
    },
    [addMessage, queryClient]
  );
}

export function useStartConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (otherUserId: number) => {
      const { data } = await api.post("/conversations", { otherUserId });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useAllUsers() {
  return useQuery<ChatUser[]>({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const { data } = await api.get("/users/all");
      return data;
    },
  });
}

export function useChatWebSocket() {
  const token = useAuthStore((s) => s.token);
  const setWs = useChatStore((s) => s.setWs);
  const addMessage = useChatStore((s) => s.addMessage);
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!token) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
    let wsUrl: string;

    if (apiUrl) {
      const url = new URL(apiUrl);
      const wsProtocol = url.protocol === "https:" ? "wss:" : "ws:";
      wsUrl = `${wsProtocol}//${url.host}/ws/chat?token=${token}`;
    } else {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      wsUrl = `${protocol}//${window.location.host}/api/ws/chat?token=${token}`;
    }

    const connect = () => {
      const socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        wsRef.current = socket;
        setWs(socket);
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "message_received" && data.message) {
            addMessage(data.message);
            queryClient.invalidateQueries({ queryKey: ["conversations"] });
          }
        } catch {
          
        }
      };

      socket.onclose = () => {
        setWs(null);
        setTimeout(connect, 3000);
      };

      socket.onerror = () => {
        socket.close();
      };
    };

    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
        setWs(null);
      }
    };
  }, [token, setWs, addMessage, queryClient]);
}
