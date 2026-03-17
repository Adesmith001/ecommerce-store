import type { AccountAddress, AccountProfile } from "@/types/account";
import type { OrderRecord } from "@/types/order";

export type AdminCustomerListItem = {
  clerkId: string;
  currency: string;
  fullName: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpend: number;
  mostRecentOrderDate: string | null;
};

export type AdminCustomerDetail = {
  addresses: AccountAddress[];
  profile: AccountProfile;
  recentOrders: OrderRecord[];
  summary: {
    currency: string;
    mostRecentOrderDate: string | null;
    totalOrders: number;
    totalSpend: number;
  };
};
