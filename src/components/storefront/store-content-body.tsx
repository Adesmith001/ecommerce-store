type StoreContentBodyProps = {
  body: string;
};

export function StoreContentBody({ body }: StoreContentBodyProps) {
  const paragraphs = body
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <div className="space-y-4">
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="text-body">
          {paragraph}
        </p>
      ))}
    </div>
  );
}
