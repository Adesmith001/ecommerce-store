"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux";
import {
  hydrateCart,
  selectCartAppliedCoupon,
  selectCartHydrated,
  selectCartItems,
} from "@/store/features/cart/cart-slice";
import type { AppliedCoupon } from "@/types/coupon";
import type { CartItem } from "@/types/cart";

const CART_STORAGE_KEY = "aster-store-cart";

function isCartItemArray(value: unknown): value is CartItem[] {
  return Array.isArray(value);
}

function isPersistedCartValue(
  value: unknown,
): value is { appliedCoupon: AppliedCoupon | null; items: CartItem[] } {
  return Boolean(
    value &&
      typeof value === "object" &&
      Array.isArray((value as { items?: unknown }).items),
  );
}

export function CartPersistence() {
  const dispatch = useAppDispatch();
  const hydrated = useAppSelector(selectCartHydrated);
  const appliedCoupon = useAppSelector(selectCartAppliedCoupon);
  const items = useAppSelector(selectCartItems);

  useEffect(() => {
    try {
      const storedValue = window.localStorage.getItem(CART_STORAGE_KEY);

      if (!storedValue) {
        dispatch(hydrateCart({ appliedCoupon: null, items: [] }));
        return;
      }

      const parsedValue = JSON.parse(storedValue) as unknown;

      if (isPersistedCartValue(parsedValue)) {
        dispatch(
          hydrateCart({
            appliedCoupon: parsedValue.appliedCoupon ?? null,
            items: parsedValue.items,
          }),
        );
        return;
      }

      dispatch(
        hydrateCart({
          appliedCoupon: null,
          items: isCartItemArray(parsedValue) ? parsedValue : [],
        }),
      );
    } catch {
      dispatch(hydrateCart({ appliedCoupon: null, items: [] }));
    }
  }, [dispatch]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({ appliedCoupon, items }),
    );
  }, [appliedCoupon, hydrated, items]);

  return null;
}
