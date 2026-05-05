import { persist } from "zustand/middleware";
import type { User } from "./types";
import { create } from "zustand";
import { tokenStorage } from "../../shared/lib/tokenStorage";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setAuth: (user, accessToken, refreshToken) => {
        tokenStorage.setAccess(accessToken);
        tokenStorage.setRefresh(refreshToken);
        set({ user, isAuthenticated: true });
      },

      logout: () => {
        tokenStorage.clear();
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
      // Only user persists, token is already in localstorage
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
