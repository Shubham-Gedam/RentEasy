import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set) => ({
      cart: [],
      rentals: [],

      addToCart: (product) =>
        set((state) => ({
          cart: [...state.cart, product],
        })),

      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        })),

      confirmBooking: () =>
        set((state) => ({
          rentals: [...state.rentals, ...state.cart],
          cart: [],
        })),

      clearCart: () => set({ cart: [] }),

      returnProduct: (id) =>
        set((state) => ({
          rentals: state.rentals.filter((item) => item.id !== id),
        })),
    }),
    { name: "rent-ease-cart-storage" },
  ),
);

export default useCartStore;
