import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/lib/types/user";

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  updateUser: (partial: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        document.cookie = `mini-twitter-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        set({ user, token });
      },
      clearAuth: () => {
        document.cookie = "mini-twitter-token=; path=/; max-age=0";
        set({ user: null, token: null });
      },
      updateUser: (partial) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
        })),
    }),
    {
      name: "mini-twitter-auth",
    }
  )
);

