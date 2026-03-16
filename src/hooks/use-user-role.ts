"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import type { UserRole } from "@/types/auth";

type UseUserRoleState = {
  isLoading: boolean;
  role: UserRole;
};

export function useUserRole(): UseUserRoleState {
  const { isLoaded, userId } = useAuth();
  const [state, setState] = useState<UseUserRoleState>({
    isLoading: true,
    role: "customer",
  });

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!userId) {
      setState({
        isLoading: false,
        role: "customer",
      });
      return;
    }

    let cancelled = false;

    async function loadRole() {
      try {
        const response = await fetch("/api/auth/me", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load user role.");
        }

        const payload = (await response.json()) as { role?: UserRole };

        if (!cancelled) {
          setState({
            isLoading: false,
            role: payload.role === "admin" ? "admin" : "customer",
          });
        }
      } catch {
        if (!cancelled) {
          setState({
            isLoading: false,
            role: "customer",
          });
        }
      }
    }

    setState((current) => ({
      ...current,
      isLoading: true,
    }));

    void loadRole();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, userId]);

  return state;
}
