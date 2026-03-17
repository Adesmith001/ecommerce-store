import { AdminShippingSettingsManager } from "@/components/admin";
import { listAdminShippingMethods } from "@/lib/shipping/shipping-service";

export default async function AdminShippingPage() {
  const shippingMethods = await listAdminShippingMethods();

  return <AdminShippingSettingsManager shippingMethods={shippingMethods} />;
}
