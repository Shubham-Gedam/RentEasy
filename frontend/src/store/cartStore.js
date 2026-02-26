import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set) => ({
      cart: [],
      rentals: [],

      // Product pura object lega jisme _id, monthlyRent wagera sab hoga
      addToCart: (product) =>
        set((state) => {
          // Check karo agar item pehle se cart mein hai (optional par acha hai)
          const exists = state.cart.find((item) => item._id === product._id);
          if (exists) return state; 
          return { cart: [...state.cart, product] };
        }),

      // ❌ item.id ko badal kar item._id kiya
      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item._id !== id),
        })),

      confirmBooking: () =>
        set((state) => ({
          // Yahan bhi data backend format mein hi jayega
          rentals: [...state.rentals, ...state.cart],
          cart: [],
        })),

      clearCart: () => set({ cart: [] }),

      // ❌ item.id ko badal kar item._id kiya
      returnProduct: (id) =>
        set((state) => ({
          rentals: state.rentals.filter((item) => item._id !== id),
        })),
    }),
    { name: "rent-ease-cart-storage" } // LocalStorage mein ab sahi data save hoga
  )
);

export default useCartStore;