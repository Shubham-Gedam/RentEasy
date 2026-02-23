import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: { name: "Guest User", role: "user" }, // roles: 'user', 'vendor', 'admin'
  setRole: (role) => set((state) => ({ user: { ...state.user, role } })),
}));

export default useAuthStore;