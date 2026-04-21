import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "../types/user-types";
import * as authApi from "../api/auth-api";
import type { LoginDto, RegisterDto } from "../types/auth-api-types";

interface IAuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  login: (dto: LoginDto) => Promise<void>;
  register: (dto: RegisterDto) => Promise<void>;
  fetchMe: () => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setInitialized: (value: boolean) => void;
}

export const useAuthStore = create<IAuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isLoading: false,
      isInitialized: false,
      error: null,

      login: async (dto) => {
        try {
          set({ isLoading: true, error: null });

          const data = await authApi.login(dto);

          set({
            token: data.token,
            user: data.user,
            isLoading: false,
            isInitialized: true,
            error: null,
          });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Login error";
          set({
            token: null,
            user: null,
            isLoading: false,
            isInitialized: true,
            error: message,
          });
        }
      },

      register: async (dto) => {
        try {
          set({ isLoading: true, error: null });

          const data = await authApi.register(dto);
          set({
            token: data.token,
            user: data.user,
            isLoading: false,
            isInitialized: true,
            error: null,
          });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Register error";

          set({
            token: null,
            user: null,
            isLoading: false,
            isInitialized: true,
            error: message,
          });
        }
      },

      fetchMe: async () => {
        const token = get().token;
        if (!token) {
          set({
            user: null,
            isLoading: false,
            isInitialized: true,
            error: null,
          });
          return;
        }

        try {
          set({ isLoading: true, error: null });
          const data = await authApi.getCurrentUser();
          console.log("data getCurrentUser", data);

          set({
            user: data.user,
            isLoading: false,
            isInitialized: true,
            error: null,
          });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "fetchMe error";

          set({
            token: null,
            user: null,
            isLoading: false,
            isInitialized: true,
            error: message,
          });
        }
      },

      logout: () => {
        set({
          token: null,
          user: null,
          isLoading: false,
          isInitialized: true,
          error: null,
        });
      },

      clearError: () => set({ error: null }),
      setInitialized: (value) => set({ isInitialized: value }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        token: state.token,
      }),
      skipHydration: true,
    },
  ),
);
