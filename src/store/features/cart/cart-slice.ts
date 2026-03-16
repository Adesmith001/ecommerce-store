import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import type { AddToCartPayload, CartItem } from "@/types/cart";

type CartState = {
  hydrated: boolean;
  items: CartItem[];
};

const initialState: CartState = {
  hydrated: false,
  items: [],
};

function clampQuantity(quantity: number, stock: number) {
  if (stock <= 0) {
    return 0;
  }

  return Math.min(Math.max(quantity, 1), stock);
}

function mapProductToCartItem(payload: AddToCartPayload): CartItem {
  const { product, quantity } = payload;

  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    sku: product.sku,
    image: product.images[0] ?? null,
    price: product.price,
    salePrice: product.salePrice,
    quantity: clampQuantity(quantity, product.stock),
    stock: product.stock,
    category: product.category,
  };
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrateCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload.filter((item) => item.quantity > 0);
      state.hydrated = true;
    },
    addToCart: (state, action: PayloadAction<AddToCartPayload>) => {
      const nextItem = mapProductToCartItem(action.payload);

      if (nextItem.quantity <= 0) {
        return;
      }

      const existingItem = state.items.find(
        (item) => item.productId === nextItem.productId,
      );

      if (existingItem) {
        existingItem.quantity = clampQuantity(
          existingItem.quantity + nextItem.quantity,
          existingItem.stock,
        );
        existingItem.price = nextItem.price;
        existingItem.salePrice = nextItem.salePrice;
        existingItem.image = nextItem.image;
        existingItem.stock = nextItem.stock;
        existingItem.category = nextItem.category;
        return;
      }

      state.items.push(nextItem);
    },
    updateCartItemQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>,
    ) => {
      const item = state.items.find(
        (entry) => entry.productId === action.payload.productId,
      );

      if (!item) {
        return;
      }

      const nextQuantity = clampQuantity(action.payload.quantity, item.stock);

      if (nextQuantity <= 0) {
        state.items = state.items.filter(
          (entry) => entry.productId !== action.payload.productId,
        );
        return;
      }

      item.quantity = nextQuantity;
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload,
      );
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  clearCart,
  hydrateCart,
  removeFromCart,
  updateCartItemQuantity,
} = cartSlice.actions;

export const cartReducer = cartSlice.reducer;

export const selectCart = (state: RootState) => state.cart;
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartHydrated = (state: RootState) => state.cart.hydrated;
export const selectCartLineItemCount = (state: RootState) => state.cart.items.length;
export const selectCartTotalQuantity = (state: RootState) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartSubtotal = (state: RootState) =>
  state.cart.items.reduce(
    (total, item) => total + (item.salePrice ?? item.price) * item.quantity,
    0,
  );
export const selectCartEstimatedTotal = selectCartSubtotal;
