export const USER_ROLES = ["customer", "admin"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export type AppwriteUserProfile = {
  clerkId: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone: string;
  createdAt: string;
};
