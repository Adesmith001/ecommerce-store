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
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">
          Delivery details
        </p>
        <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
          Shipping address
        </h2>
      </div>

      <div className="space-y-2 text-sm leading-7 text-muted-foreground">
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
