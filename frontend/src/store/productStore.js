import { create } from 'zustand';
import axiosInstance from '../apis/axiosInstance';

const useProductStore = create((set) => ({
  products: [],
  searchQuery: "",
  loading: false,

  setSearchQuery: (query) => set({ searchQuery: query }),

  // 🚀 Yeh function backend se saare products layega
  fetchProducts: async () => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get('/products'); 
      // Note: Check karo backend 'products' bhej raha hai ya 'data'
      const data = response.data.products || response.data;
      set({ products: data, loading: false });
    } catch (error) {
      console.error("Error fetching products:", error);
      set({ loading: false });
    }
  },
}));

export default useProductStore;