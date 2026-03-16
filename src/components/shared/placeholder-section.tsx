import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";

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
    <Card>
      <SectionHeading
        description={description}
        eyebrow={eyebrow}
        title={title}
      />
    </Card>
  );
}
