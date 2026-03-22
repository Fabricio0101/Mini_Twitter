

export interface Post {
  id: number;
  title: string;
  content: string;
  image: string | null;
  authorId: number;
  isOwner: boolean;
  createdAt: string;
  authorName: string;
  authorAvatarUrl: string | null;
  likesCount: number;
  likedByMe: number;
  commentsCount: number;
  repostsCount: number;
  repostedByMe: number;
  favoritedByMe: number;
  viewsCount: number;
}

export interface Comment {
  id: number;
  content: string;
  postId: number;
  userId: number;
  parentId: number | null;
  createdAt: string;
  authorName: string;
  authorAvatarUrl: string | null;
  likesCount: number;
  likedByMe: boolean;
  repliesCount: number;
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

export interface CreateCommentPayload {
  content: string;
}

export interface RepostResponse {
  reposted: boolean;
}

export interface FollowResponse {
  following: boolean;
}

export interface FavoriteResponse {
  favorited: boolean;
}

export interface PublicProfile {
  id: number;
  name: string;
  bio: string | null;
  location: string | null;
  avatarUrl: string | null;
  createdAt: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
  isOwnProfile: boolean;
}
