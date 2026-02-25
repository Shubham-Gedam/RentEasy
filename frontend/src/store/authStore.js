// src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// src/store/authStore.js
const useAuthStore = create(
  persist(
    (set) => ({
      user: null, 
      isAuthenticated: false,
      // 'login' ki jagah 'setUser' kar do
      setUser: (userData) => set({ user: userData, isAuthenticated: true }), 
      setRole: (role) => set((state) => ({ user: { ...state.user, role } })),
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, isAuthenticated: false });
      },
    }),
    { name: 'auth-storage' }
  )
);
export default useAuthStore;