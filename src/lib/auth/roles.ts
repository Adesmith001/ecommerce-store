import type { UserRole } from "@/types/auth";

export function isUserRole(value: unknown): value is UserRole {
  return value === "admin" || value === "customer";
}

export function getRoleFromMetadata(value: unknown): UserRole {
  return isUserRole(value) ? value : "customer";
}

export function isAdminRole(role: UserRole) {
  return role === "admin";
}
