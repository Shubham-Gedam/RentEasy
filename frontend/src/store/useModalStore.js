import { create } from 'zustand';

const useModalStore = create((set) => ({
  isPostAdOpen: false,
  openPostAd: () => set({ isPostAdOpen: true }),
  closePostAd: () => set({ isPostAdOpen: false }),
}));

export default useModalStore;