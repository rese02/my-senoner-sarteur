
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem } from '@/lib/types';

interface CartState {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (newItem) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.productId === newItem.productId
          );
          if (existingItemIndex !== -1) {
            // Update quantity if item exists
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += newItem.quantity;
            return { items: updatedItems };
          } else {
            // Add new item
            return { items: [...state.items, newItem] };
          }
        });
      },
      removeFromCart: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'senoner-sarteur-cart', // Unique and descriptive name
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          try {
            const str = localStorage.getItem(name);
            // If the stored value is null or an empty string, it's not valid JSON.
            // Return a valid initial state to prevent a parsing error.
            if (!str) {
              return JSON.stringify({ state: { items: [] }, version: 0 });
            }
            // If there's content, proceed to parse it. 
            // The library will handle parsing internally.
            return str;
          } catch (e) {
            // If any other error occurs during reading (e.g., security restrictions),
            // fall back to a safe initial state.
             console.error("Failed to read from localStorage for cart:", e);
             return JSON.stringify({ state: { items: [] }, version: 0 });
          }
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, value);
          } catch (e) {
            console.error("Failed to write to localStorage for cart:", e);
          }
        },
        removeItem: (name) => localStorage.removeItem(name),
      })),
    }
  )
);
