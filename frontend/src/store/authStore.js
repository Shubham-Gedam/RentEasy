// src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: { name: 'John Doe', role: 'user' },
      isAuthenticated: true, // Shuru mein true rakho testing ke liye
      setRole: (role) => set((state) => ({ user: { ...state.user, role } })),
      login: (userData) => set({ user: userData, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'auth-storage' }
  )
);
export default useAuthStore;