"use client";

import type { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { ReduxProvider } from "@/components/providers/redux-provider";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ClerkProvider>
      <ReduxProvider>{children}</ReduxProvider>
    </ClerkProvider>
  );
}
