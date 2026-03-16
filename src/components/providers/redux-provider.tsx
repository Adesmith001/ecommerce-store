"use client";

import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { CartPersistence } from "@/components/providers/cart-persistence";
import { store } from "@/store";

type ReduxProviderProps = {
  children: ReactNode;
};

export function ReduxProvider({ children }: ReduxProviderProps) {
  return (
    <Provider store={store}>
      <CartPersistence />
      {children}
    </Provider>
  );
}
