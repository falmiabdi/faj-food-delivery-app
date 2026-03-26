import { getCurrentUser, signOut as signOutAppwrite } from "@/lib/appwrite";
import { User } from "@/types";
import { create } from "zustand";

let isFetchingAuth = false;

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  setIsAuthenticated: (value: boolean) => void;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  fetchAuthenticatedUser: () => Promise<void>;
  signOut: () => Promise<void>;
  reset: () => void;
}

const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true,

  setIsAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
  setUser: (user: User | null) => set({ user }),
  setLoading: (isLoading: boolean) => set({ isLoading }),

  fetchAuthenticatedUser: async () => {
    // Prevent fetching if already fetching or already authenticated
    const { isAuthenticated } = get();
    if (isAuthenticated || isFetchingAuth) return;

    isFetchingAuth = true;
    set({ isLoading: true });

    try {
      const user = await getCurrentUser();

      if (user) {
        set({
          isAuthenticated: true,
          user: user,
          isLoading: false,
        });
      } else {
        set({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
      }
    } catch (error) {
      console.log("fetchAuthenticatedUser error", error);
      set({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    } finally {
      isFetchingAuth = false;
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    try {
      await signOutAppwrite();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error signing out:", error);
      set({ isLoading: false });
    }
  },

  reset: () => {
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },
}));

export default useAuthStore;
