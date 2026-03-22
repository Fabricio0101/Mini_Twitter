export interface Conversation {
  id: number;
  otherUserId: number;
  otherUserName: string;
  otherUserAvatarUrl: string | null;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
}

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  senderName: string;
  senderAvatarUrl: string | null;
  content: string;
  createdAt: string;
  readAt: string | null;
}

export interface ChatUser {
  id: number;
  name: string;
  avatarUrl: string | null;
}
