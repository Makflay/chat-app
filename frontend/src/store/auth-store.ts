import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "../types/user-types";
import * as authApi from "../api/auth-api";
import type { LoginDto, RegisterDto } from "../types/auth-api-types";

interface IAuthState {
  token: string | null;
  user: User | null;
  isAuth: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  login: (dto: LoginDto) => Promise<void>;
  register: (dto: RegisterDto) => Promise<void>;
  fetchMe: () => Promise<void>;
  initAuth: () => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setInitialized: (value: boolean) => void;
}

export const useAuthStore = create<IAuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuth: false,
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
            isAuth: true,
            isLoading: false,
            isInitialized: true,
          });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Login error";
          set({
            error: message,
            token: null,
            isLoading: false,
            isAuth: false,
            user: null,
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
            isAuth: true,
            isLoading: false,
            isInitialized: true,
          });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Register error";

          set({
            error: message,
            token: null,
            isLoading: false,
            isAuth: false,
            user: null,
          });
        }
      },

      fetchMe: async () => {
        const token = get().token;
        if (!token) {
          set({
            user: null,
            isAuth: false,
            isLoading: false,
            isInitialized: true,
          });
          return;
        }

        try {
          set({ isLoading: true, error: null });
          const data = await authApi.getCurrentUser();

          set({
            token: data.token,
            user: data.user,
            isAuth: true,
            isLoading: false,
            isInitialized: true,
          });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "fetchMe error";

          set({
            token: null,
            user: null,
            isAuth: false,
            isLoading: false,
            isInitialized: true,
            error: message,
          });
        }
      },

      initAuth: async () => {
        const token = localStorage.getItem("token");

        if (!token) {
          set({
            user: null,
            isAuth: false,
            isLoading: false,
            isInitialized: true,
          });
          return;
        }
        set({ token });
        await get().fetchMe();
      },

      logout: () => {
        set({
          token: null,
          user: null,
          isAuth: false,
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
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          state?.setInitialized(true);
          return;
        }
        state?.fetchMe();
      },
    },
  ),
);
