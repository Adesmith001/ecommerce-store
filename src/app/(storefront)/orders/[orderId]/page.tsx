import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";

type OrdersDetailRedirectPageProps = {
  params: Promise<{ orderId: string }>;
};

export default async function OrdersDetailRedirectPage({
  params,
}: OrdersDetailRedirectPageProps) {
  const { orderId } = await params;

  redirect(ROUTES.storefront.accountOrder(orderId));
}
