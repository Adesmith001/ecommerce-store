type PlaceholderSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PlaceholderSection({
  eyebrow,
  title,
  description,
}: PlaceholderSectionProps) {
  return (
    <section className="surface p-8 sm:p-10">
      <p className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
        {eyebrow}
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
        {description}
      </p>
    </section>
  );
}
