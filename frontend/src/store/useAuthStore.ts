import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  isAuthChecked: boolean;
  login: () => void;
  logout: () => void;
  setAuthChecked: (status: boolean) => void;
  setLoggedIn: (status: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  isAuthChecked: false,
  login: () => set({ isLoggedIn: true }),
  logout: () => set({ isLoggedIn: false }),
  setAuthChecked: (status) => set({ isAuthChecked: status }),
  setLoggedIn: (status) => set({ isLoggedIn: status }),
}));
