"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@clerk/nextjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import type { Product } from "@/types/catalog";
import type { WishlistItem } from "@/types/wishlist";

type WishlistContextValue = {
  addItem: (product: Product) => Promise<void>;
  error: string | null;
  isLoading: boolean;
  isMutating: boolean;
  items: WishlistItem[];
  isWishlisted: (productId: string) => boolean;
  removeItem: (productId: string) => Promise<void>;
  toggleItem: (product: Product) => Promise<void>;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

type WishlistProviderProps = {
  children: ReactNode;
};

export function WishlistProvider({ children }: WishlistProviderProps) {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!userId) {
      setItems([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function loadWishlist() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/wishlist", { cache: "no-store" });
        const payload = (await response.json()) as {
          items?: WishlistItem[];
          message?: string;
        };

        if (!response.ok) {
          throw new Error(payload.message ?? "Failed to load wishlist.");
        }

        if (!cancelled) {
          setItems(payload.items ?? []);
          setError(null);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error ? loadError.message : "Failed to load wishlist.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadWishlist();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, userId]);

  const redirectToSignIn = () => {
    const nextPath = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    router.push(`${ROUTES.auth.signIn}?redirect_url=${encodeURIComponent(nextPath)}`);
  };

  const addItem = async (product: Product) => {
    if (!userId) {
      redirectToSignIn();
      return;
    }

    setIsMutating(true);
    setError(null);

    try {
      const response = await fetch("/api/wishlist", {
        body: JSON.stringify({
          productId: product.id,
          productSlug: product.slug,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const payload = (await response.json()) as {
        item?: WishlistItem | null;
        message?: string;
      };

      if (!response.ok) {
        throw new Error(payload.message ?? "Failed to save wishlist item.");
      }

      if (payload.item) {
        setItems((current) => {
          const next = current.filter((entry) => entry.product.id !== product.id);
          next.unshift(payload.item as WishlistItem);
          return next;
        });
      }
    } catch (mutationError) {
      setError(
        mutationError instanceof Error
          ? mutationError.message
          : "Failed to save wishlist item.",
      );
    } finally {
      setIsMutating(false);
    }
  };

  const removeItem = async (productId: string) => {
    if (!userId) {
      redirectToSignIn();
      return;
    }

    setIsMutating(true);
    setError(null);

    try {
      const response = await fetch(`/api/wishlist/${productId}`, {
        method: "DELETE",
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message ?? "Failed to remove wishlist item.");
      }

      setItems((current) => current.filter((item) => item.product.id !== productId));
    } catch (mutationError) {
      setError(
        mutationError instanceof Error
          ? mutationError.message
          : "Failed to remove wishlist item.",
      );
    } finally {
      setIsMutating(false);
    }
  };

  const isWishlisted = (productId: string) =>
    items.some((item) => item.product.id === productId);

  const toggleItem = async (product: Product) => {
    if (isWishlisted(product.id)) {
      await removeItem(product.id);
      return;
    }

    await addItem(product);
  };

  const value: WishlistContextValue = {
    addItem,
    error,
    isLoading,
    isMutating,
    items,
    isWishlisted,
    removeItem,
    toggleItem,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider.");
  }

  return context;
}
