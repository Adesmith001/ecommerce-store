"use client";

import { useEffect } from "react";
import { clearCart } from "@/store/features/cart/cart-slice";
import { useAppDispatch } from "@/hooks/use-redux";

export function PaymentSuccessClient() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  return null;
}
