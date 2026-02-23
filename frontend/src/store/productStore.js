import { create } from 'zustand';

const useProductStore = create((set) => ({
  products: [
    { id: 1, name: 'Luxury Sofa', category: 'Furniture', rent: 899, deposit: 2000, imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800' },
  ],
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  addProduct: (product) => set((state) => ({ products: [...state.products, { ...product, id: Date.now() }] })),
}));

export default useProductStore;