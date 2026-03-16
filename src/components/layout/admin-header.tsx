import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

export function AdminHeader() {
  return (
    <header className="card-shell flex items-center justify-between px-6 py-4">
      <div className="space-y-2">
        <Badge variant="outline">Operations</Badge>
        <div>
        <p className="text-sm text-muted-foreground">Admin workspace</p>
        <h1 className="text-xl font-semibold">Dashboard</h1>
        </div>
      </div>
      <Link className={buttonVariants({ variant: "outline" })} href={ROUTES.storefront.home}>
        View storefront
      </Link>
    </header>
  );
}
