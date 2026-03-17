import { AdminOrdersList } from "@/components/admin";
import { listAdminOrders } from "@/lib/admin/admin-order-service";

export default async function AdminOrdersPage() {
  const orders = await listAdminOrders();

  return <AdminOrdersList orders={orders} />;
}
