"use client";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: ErrorProps) {
  return (
    <main className="app-shell flex min-h-screen items-center justify-center py-16">
      <div className="surface w-full max-w-lg p-8">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-danger">
          Something went wrong
        </p>
        <h1 className="mt-3 text-2xl font-semibold">The app shell hit an error</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {error.message || "An unexpected error occurred while rendering this page."}
        </p>
        <button
          className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
          onClick={reset}
          type="button"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
