import { AdminCustomersList } from "@/components/admin";
import { listAdminCustomers } from "@/lib/admin/admin-customer-service";

export default async function AdminCustomersPage() {
  const customers = await listAdminCustomers();

  return <AdminCustomersList customers={customers} />;
}
