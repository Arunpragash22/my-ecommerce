import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  category: string;
};

type CartItem = Product & {
  quantity: number;
};

type CartStore = {
  cartItems: CartItem[];

  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;

  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
};

export const useCartStore = create<CartStore>()(
persist(
    (set) => ({
  cartItems: [],

  addToCart: (product) =>
    set((state) => {
      const existingItem = state.cartItems.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        return {
          cartItems: state.cartItems.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }

      return {
        cartItems: [
          ...state.cartItems,
          {
            ...product,
            quantity: 1,
          },
        ],
      };
    }),

  removeFromCart: (productId) =>
    set((state) => ({
      cartItems: state.cartItems.filter(
        (item) => item.id !== productId
      ),
    })),

  increaseQuantity: (productId) =>
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ),
    })),

  decreaseQuantity: (productId) =>
    set((state) => ({
      cartItems: state.cartItems
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0),
    })),

  clearCart: () => set({ cartItems: [] }),
}),
    {
      name: "shopping-cart",
    }
  )
);