import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { getAdminCustomerByClerkId } from "@/lib/admin/admin-customer-service";
import {
  formatOrderCurrency,
  formatOrderDate,
  getOrderStatusLabel,
  getOrderStatusVariant,
  getPaymentStatusLabel,
  getPaymentStatusVariant,
} from "@/lib/orders/order-presentation";

type AdminCustomerDetailPageProps = {
  params: Promise<{ clerkId: string }>;
};

export default async function AdminCustomerDetailPage({
  params,
}: AdminCustomerDetailPageProps) {
  const { clerkId } = await params;
  const customer = await getAdminCustomerByClerkId(clerkId);

  if (!customer) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-5 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Customer details
              </p>
              <h1 className="font-display mt-3 text-4xl font-semibold tracking-[-0.06em]">
                {customer.profile.fullName || "Unnamed customer"}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {customer.profile.email || "No email"} · {customer.profile.phone || "No phone"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{customer.profile.role}</Badge>
              {customer.addresses.some((address) => address.isDefault) ? (
                <Badge variant="secondary">Has default address</Badge>
              ) : null}
            </div>
          </div>

          <Link
            className="rounded-full border border-white/80 bg-white/75 px-4 py-2 text-sm font-medium text-foreground shadow-[0_10px_24px_rgba(20,21,26,0.04)] hover:bg-white"
            href={ROUTES.admin.customers}
          >
            Back to customers
          </Link>
        </div>

        <div className="grid gap-4 text-sm sm:grid-cols-3">
          <div className="rounded-[1.3rem] border border-white/80 bg-white/72 p-4">
            <p className="text-muted-foreground">Total orders</p>
            <p className="mt-1 font-medium">{customer.summary.totalOrders}</p>
          </div>
          <div className="rounded-[1.3rem] border border-white/80 bg-white/72 p-4">
            <p className="text-muted-foreground">Total spend</p>
            <p className="mt-1 font-medium">
              {formatOrderCurrency(customer.summary.totalSpend, customer.summary.currency)}
            </p>
          </div>
          <div className="rounded-[1.3rem] border border-white/80 bg-white/72 p-4">
            <p className="text-muted-foreground">Most recent order</p>
            <p className="mt-1 font-medium">
              {customer.summary.mostRecentOrderDate
                ? formatOrderDate(customer.summary.mostRecentOrderDate)
                : "No orders yet"}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <Card className="space-y-5 p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Recent orders
              </p>
              <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
                Order activity
              </h2>
            </div>

            {customer.recentOrders.length === 0 ? (
              <p className="text-sm leading-7 text-muted-foreground">
                This customer has not placed any orders yet.
              </p>
            ) : (
              <div className="space-y-4">
                {customer.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="space-y-3 rounded-[1.5rem] border border-white/80 bg-white/72 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-medium">{order.orderNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatOrderDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant={getPaymentStatusVariant(order.paymentStatus)}>
                          {getPaymentStatusLabel(order.paymentStatus)}
                        </Badge>
                        <Badge variant={getOrderStatusVariant(order.orderStatus)}>
                          {getOrderStatusLabel(order.orderStatus)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                      <span className="text-muted-foreground">
                        {order.items.length} item{order.items.length === 1 ? "" : "s"}
                      </span>
                      <span className="font-medium">
                        {formatOrderCurrency(order.pricing.estimatedTotal, order.currency)}
                      </span>
                    </div>
                    <Link
                      className="inline-flex rounded-full border border-white/80 bg-white/75 px-4 py-2 text-sm font-medium text-foreground shadow-[0_10px_24px_rgba(20,21,26,0.04)] hover:bg-white"
                      href={`${ROUTES.admin.orders}/${order.id}`}
                    >
                      View order
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="space-y-5 p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Profile
              </p>
              <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
                Contact information
              </h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Full name</span>
                <span className="font-medium">{customer.profile.fullName || "Not set"}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">{customer.profile.email || "Not set"}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Phone</span>
                <span className="font-medium">{customer.profile.phone || "Not set"}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Clerk id</span>
                <span className="font-medium break-all">{customer.profile.clerkId}</span>
              </div>
            </div>
          </Card>

          <Card className="space-y-5 p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Addresses
              </p>
              <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
                Saved addresses
              </h2>
            </div>

            {customer.addresses.length === 0 ? (
              <p className="text-sm leading-7 text-muted-foreground">
                No saved addresses found for this customer.
              </p>
            ) : (
              <div className="space-y-4">
                {customer.addresses.map((address) => (
                  <div
                    key={address.id}
                    className="space-y-2 rounded-[1.5rem] border border-white/80 bg-white/72 p-4 text-sm"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{address.label}</span>
                      {address.isDefault ? <Badge variant="secondary">Default</Badge> : null}
                    </div>
                    <p className="text-muted-foreground">{address.fullName}</p>
                    <p className="text-muted-foreground">{address.phoneNumber}</p>
                    <p className="text-muted-foreground">{address.addressLine}</p>
                    {address.landmark ? (
                      <p className="text-muted-foreground">{address.landmark}</p>
                    ) : null}
                    <p className="text-muted-foreground">
                      {address.city}, {address.state}, {address.country}
                    </p>
                    {address.postalCode ? (
                      <p className="text-muted-foreground">{address.postalCode}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
