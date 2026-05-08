import { create } from 'zustand';

interface AuthState {
  user: null | any;
  profile: null | any;
  isLoading: boolean;
  loadUser: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isLoading: false,
  loadUser: async () => {
    console.log('Loading user...');
    set({ isLoading: false });
  },
  signIn: async (email, password) => {
    console.log('Sign in:', email);
  },
  signUp: async (email, password, username) => {
    console.log('Sign up:', email, username);
  },
  signOut: async () => {
    console.log('Sign out');
    set({ user: null, profile: null });
  },
}));
