"use client";

import { Suspense, type ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { ROUTES } from "@/constants/routes";
import { ReduxProvider } from "@/components/providers/redux-provider";
import { WishlistProvider } from "@/components/providers/wishlist-provider";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ClerkProvider
      afterSignOutUrl={ROUTES.storefront.home}
      signInUrl={ROUTES.auth.signIn}
      signUpUrl={ROUTES.auth.signUp}
    >
      <ReduxProvider>
        <Suspense fallback={children}>
          <WishlistProvider>{children}</WishlistProvider>
        </Suspense>
      </ReduxProvider>
    </ClerkProvider>
  );
}
