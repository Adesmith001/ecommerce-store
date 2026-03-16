"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux";
import {
  hydrateCart,
  selectCartHydrated,
  selectCartItems,
} from "@/store/features/cart/cart-slice";
import type { CartItem } from "@/types/cart";

const CART_STORAGE_KEY = "aster-store-cart";

function isCartItemArray(value: unknown): value is CartItem[] {
  return Array.isArray(value);
}

export function CartPersistence() {
  const dispatch = useAppDispatch();
  const hydrated = useAppSelector(selectCartHydrated);
  const items = useAppSelector(selectCartItems);

  useEffect(() => {
    try {
      const storedValue = window.localStorage.getItem(CART_STORAGE_KEY);

      if (!storedValue) {
        dispatch(hydrateCart([]));
        return;
      }

      const parsedValue = JSON.parse(storedValue) as unknown;

      dispatch(hydrateCart(isCartItemArray(parsedValue) ? parsedValue : []));
    } catch {
      dispatch(hydrateCart([]));
    }
  }, [dispatch]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  return null;
}
