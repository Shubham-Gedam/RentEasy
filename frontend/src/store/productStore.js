import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useProductStore = create(
  persist(
    (set) => ({
      products: [
        { id: 1, name: 'Premium Sofa', category: 'Furniture', rent: 999, deposit: 2000, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800' },
        { id: 2, name: 'Washing Machine', category: 'Appliances', rent: 1200, deposit: 3000, image: 'https://images.unsplash.com/photo-1582733772c28-44243b79af7a?w=800' },
      ],
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      addProduct: (newProduct) => set((state) => ({ products: [newProduct, ...state.products] })),
      removeProduct: (id) => set((state) => ({ products: state.products.filter(p => p.id !== id) })),
    }),
    { name: 'rent-ease-products' }
  )
);
export default useProductStore;