import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User, token?: string) => void;
  clearUser: () => void;
  setIsLoading: (loading: boolean) => void;
  getToken: () => string | undefined;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user, token) => {
        if (token) {
          Cookies.set('token', token, {
            expires: 1,
            secure: true,
            sameSite: 'strict'
          });
        }
        set({ user, isAuthenticated: true, isLoading: false });
      },

      clearUser: () => {
        Cookies.remove('token');
        set({ user: null, isAuthenticated: false, isLoading: false });
      },

      setIsLoading: (loading) => set({ isLoading: loading }),

      getToken: () => Cookies.get('token')
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
);
