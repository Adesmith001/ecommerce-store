export default function Loading() {
  return (
    <main className="app-shell flex min-h-screen items-center justify-center py-16">
      <div className="surface w-full max-w-md p-8 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
          Loading
        </p>
        <h1 className="mt-3 text-2xl font-semibold">Preparing your workspace</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The application shell is loading.
        </p>
      </div>
    </main>
  );
}
