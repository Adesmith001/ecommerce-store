import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { buildCartPricing } from "@/lib/checkout/checkout-pricing";
import type { RootState } from "@/store";
import type { AppliedCoupon } from "@/types/coupon";
import type { AddToCartPayload, CartItem } from "@/types/cart";

type CartState = {
  appliedCoupon: AppliedCoupon | null;
  hydrated: boolean;
  items: CartItem[];
};

const initialState: CartState = {
  appliedCoupon: null,
  hydrated: false,
  items: [],
};

function reconcileCouponState(state: CartState) {
  if (!state.appliedCoupon || state.items.length === 0) {
    state.appliedCoupon = state.items.length === 0 ? null : state.appliedCoupon;
    return;
  }

  const pricing = buildCartPricing({
    appliedCoupon: state.appliedCoupon,
    items: state.items,
  });

  state.appliedCoupon = pricing.appliedCoupon;
}

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
    hydrateCart: (
      state,
      action: PayloadAction<{ appliedCoupon: AppliedCoupon | null; items: CartItem[] }>,
    ) => {
      state.items = action.payload.items.filter((item) => item.quantity > 0);
      state.appliedCoupon = action.payload.appliedCoupon;
      reconcileCouponState(state);
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
        reconcileCouponState(state);
        return;
      }

      state.items.push(nextItem);
      reconcileCouponState(state);
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
        reconcileCouponState(state);
        return;
      }

      item.quantity = nextQuantity;
      reconcileCouponState(state);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload,
      );
      reconcileCouponState(state);
    },
    clearCart: (state) => {
      state.appliedCoupon = null;
      state.items = [];
    },
    setAppliedCoupon: (state, action: PayloadAction<AppliedCoupon>) => {
      state.appliedCoupon = action.payload;
      reconcileCouponState(state);
    },
    clearAppliedCoupon: (state) => {
      state.appliedCoupon = null;
    },
  },
});

export const {
  addToCart,
  clearAppliedCoupon,
  clearCart,
  hydrateCart,
  removeFromCart,
  setAppliedCoupon,
  updateCartItemQuantity,
} = cartSlice.actions;

export const cartReducer = cartSlice.reducer;

export const selectCart = (state: RootState) => state.cart;
export const selectCartAppliedCoupon = (state: RootState) => state.cart.appliedCoupon;
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
export const selectCartDiscountAmount = (state: RootState) =>
  buildCartPricing({
    appliedCoupon: state.cart.appliedCoupon,
    items: state.cart.items,
  }).discountAmount;
export const selectCartPricing = (state: RootState) =>
  buildCartPricing({
    appliedCoupon: state.cart.appliedCoupon,
    items: state.cart.items,
  });
export const selectCartEstimatedTotal = (state: RootState) =>
  buildCartPricing({
    appliedCoupon: state.cart.appliedCoupon,
    items: state.cart.items,
  }).estimatedTotal;
