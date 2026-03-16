import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function SignInPage() {
  return (
    <main className="app-shell flex min-h-[calc(100vh-4rem)] items-center justify-center py-16">
      <section className="surface w-full max-w-md p-8">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
          Authentication
        </p>
        <h1 className="mt-3 text-3xl font-semibold">Sign in placeholder</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Replace this page with Clerk UI components once your auth flow is ready.
        </p>
        <Link
          className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
          href={ROUTES.auth.signUp}
        >
          Go to sign up
        </Link>
      </section>
    </main>
  );
}
