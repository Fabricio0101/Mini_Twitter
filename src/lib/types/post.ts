import type { User } from "./user";

export interface Post {
  id: number;
  title: string;
  content: string;
  image: string | null;
  authorId: number;
  createdAt: string;
  authorName: string;
  authorAvatarUrl: string | null;
  likesCount: number;
  likedByMe: number;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
}

export interface LikeResponse {
  liked: boolean;
}

export interface CreatePostPayload {
  title: string;
  content: string;
  image?: string;
}

export interface UpdatePostPayload {
  title: string;
  content: string;
  image?: string;
}
