import { create } from "zustand";

interface LikedPostsState {
  likedIds: Set<number>;
  isLiked: (postId: number) => boolean;
  addLike: (postId: number) => void;
  removeLike: (postId: number) => void;
  toggleLike: (postId: number) => boolean;
  clear: () => void;
}

export const useLikedPostsStore = create<LikedPostsState>()((set, get) => ({
  likedIds: new Set<number>(),
  isLiked: (postId) => get().likedIds.has(postId),
  addLike: (postId) =>
    set((state) => {
      const next = new Set(state.likedIds);
      next.add(postId);
      return { likedIds: next };
    }),
  removeLike: (postId) =>
    set((state) => {
      const next = new Set(state.likedIds);
      next.delete(postId);
      return { likedIds: next };
    }),
  toggleLike: (postId) => {
    const wasLiked = get().isLiked(postId);
    if (wasLiked) {
      get().removeLike(postId);
    } else {
      get().addLike(postId);
    }
    return !wasLiked;
  },
  clear: () => set({ likedIds: new Set<number>() }),
}));
