import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function NotFound() {
  return (
    <main className="app-shell flex min-h-screen items-center justify-center py-16">
      <div className="surface w-full max-w-lg p-8 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
          404
        </p>
        <h1 className="mt-3 text-3xl font-semibold">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The route exists in neither the storefront nor the admin dashboard.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            className="rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
            href={ROUTES.storefront.home}
          >
            Go to storefront
          </Link>
          <Link
            className="rounded-full border border-border px-5 py-3 text-sm font-medium"
            href={ROUTES.admin.dashboard}
          >
            Go to admin
          </Link>
        </div>
      </div>
    </main>
  );
}
