import { Card } from "@/components/ui/card";
import type { OrderRecord } from "@/types/order";

type OrderAddressCardProps = {
  order: OrderRecord;
};

export function OrderAddressCard({ order }: OrderAddressCardProps) {
  const { customer } = order;

  return (
    <Card className="space-y-5 p-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Delivery details
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          Shipping address
        </h2>
      </div>

      <div className="space-y-2 text-sm leading-6 text-muted-foreground">
        <p className="font-medium text-foreground">{customer.fullName}</p>
        <p>{customer.email}</p>
        <p>{customer.phoneNumber}</p>
        <p>{customer.addressLine}</p>
        {customer.landmark ? <p>{customer.landmark}</p> : null}
        <p>
          {customer.city}, {customer.state}
        </p>
        <p>{customer.country}</p>
        {customer.postalCode ? <p>{customer.postalCode}</p> : null}
      </div>
    </Card>
  );
}
