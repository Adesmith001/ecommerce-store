import { cn } from "@/helpers/cn";

type ReviewStarsProps = {
  className?: string;
  filledClassName?: string;
  rating: number;
  size?: "sm" | "md";
};

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
} as const;

export function ReviewStars({
  className,
  filledClassName,
  rating,
  size = "md",
}: ReviewStarsProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: 5 }, (_, index) => {
        const active = index < Math.round(rating);

        return (
          <svg
            key={index}
            aria-hidden="true"
            className={cn(
              sizeClasses[size],
              active ? cn("fill-accent text-accent", filledClassName) : "fill-transparent text-border",
            )}
            viewBox="0 0 24 24"
          >
            <path
              d="M12 3.5 14.7 9l6 .9-4.3 4.2 1 6-5.4-2.9-5.4 2.9 1-6L3.3 9.9l6-.9L12 3.5Z"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
          </svg>
        );
      })}
    </div>
  );
}
