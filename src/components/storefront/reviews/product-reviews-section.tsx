"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ROUTES } from "@/constants/routes";
import { ReviewStars } from "@/components/storefront/reviews/review-stars";
import type { ReviewEligibility, ReviewRecord, ReviewSummary } from "@/types/review";

type ProductReviewsSectionProps = {
  initialEligibility: ReviewEligibility;
  initialLoadError?: string | null;
  initialReviews: ReviewRecord[];
  initialSummary: ReviewSummary;
  productId: string;
};

function formatReviewDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export function ProductReviewsSection({
  initialEligibility,
  initialLoadError = null,
  initialReviews,
  initialSummary,
  productId,
}: ProductReviewsSectionProps) {
  const { isLoaded, userId } = useAuth();
  const [reviews, setReviews] = useState(initialReviews);
  const [summary, setSummary] = useState(initialSummary);
  const [eligibility, setEligibility] = useState(initialEligibility);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const handleSubmit = async () => {
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!message.trim()) {
      setSubmitError("Please share your review message.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/reviews", {
        body: JSON.stringify({
          message,
          productId,
          rating,
          title,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const payload = (await response.json()) as {
        eligibility?: ReviewEligibility;
        message?: string;
        reviews?: ReviewRecord[];
        summary?: ReviewSummary;
      };

      if (!response.ok) {
        throw new Error(payload.message ?? "Failed to submit review.");
      }

      setReviews(payload.reviews ?? reviews);
      setSummary(payload.summary ?? summary);
      setEligibility(payload.eligibility ?? eligibility);
      setTitle("");
      setMessage("");
      setRating(5);
      setSubmitSuccess("Thank you. Your review has been published.");
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to submit review.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-6">
        {initialLoadError ? (
          <Card className="space-y-3 border-danger/20 p-6">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-danger">
              Reviews unavailable
            </p>
            <p className="text-sm text-muted-foreground">{initialLoadError}</p>
          </Card>
        ) : null}

        <Card className="space-y-6 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Ratings
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                Customer feedback
              </h2>
            </div>

            <div className="rounded-3xl bg-surface px-5 py-4">
              <div className="flex items-center gap-3">
                <p className="text-3xl font-semibold tracking-tight">
                  {summary.averageRating.toFixed(1)}
                </p>
                <div>
                  <ReviewStars rating={summary.averageRating} />
                  <p className="mt-1 text-sm text-muted-foreground">
                    {summary.totalReviews} review{summary.totalReviews === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {summary.breakdown.map((item) => (
              <div key={item.rating} className="grid grid-cols-[72px_minmax(0,1fr)_52px] items-center gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.rating}</span>
                  <ReviewStars rating={item.rating} size="sm" />
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface">
                  <div
                    className="h-full rounded-full bg-accent transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="text-right text-muted-foreground">{item.count}</span>
              </div>
            ))}
          </div>
        </Card>

        {reviews.length === 0 ? (
          <EmptyState
            description="Be the first customer to share how this product looks, feels, and performs."
            title="No reviews yet"
          />
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id} className="space-y-4 p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <ReviewStars rating={review.rating} />
                      <p className="font-medium">{review.fullName}</p>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {formatReviewDate(review.createdAt)}
                    </p>
                  </div>
                  <span className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
                    Verified purchase
                  </span>
                </div>

                {review.title ? (
                  <h3 className="text-lg font-semibold tracking-tight">
                    {review.title}
                  </h3>
                ) : null}

                <p className="text-sm leading-7 text-muted-foreground">
                  {review.message}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <Card className="space-y-5 p-6">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Write a review
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Share your experience
            </h2>
          </div>

          {!isLoaded ? (
            <p className="text-sm text-muted-foreground">
              Checking your review eligibility...
            </p>
          ) : null}

          {isLoaded && !userId ? (
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>You need to sign in before you can review this product.</p>
              <Link href={ROUTES.auth.signIn}>
                <Button variant="outline">Sign in to review</Button>
              </Link>
            </div>
          ) : null}

          {isLoaded && userId && !eligibility.canSubmit ? (
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                {eligibility.reason === "already-reviewed"
                  ? "You have already submitted a review for this product."
                  : "Only customers who purchased this product can leave a review."}
              </p>
            </div>
          ) : null}

          {isLoaded && userId && eligibility.canSubmit ? (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Your rating</label>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 5 }, (_, index) => {
                    const starValue = index + 1;
                    const active = starValue <= rating;

                    return (
                      <button
                        key={starValue}
                        className="rounded-full border border-border px-3 py-2 transition hover:border-accent hover:bg-accent/5"
                        onClick={() => setRating(starValue)}
                        type="button"
                      >
                        <ReviewStars
                          filledClassName={active ? "text-accent" : undefined}
                          rating={starValue}
                          size="sm"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="reviewTitle">
                  Review title
                </label>
                <Input
                  id="reviewTitle"
                  maxLength={120}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Summarize your experience"
                  value={title}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="reviewMessage">
                  Review message
                </label>
                <Textarea
                  id="reviewMessage"
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="What stood out to you about this product?"
                  rows={6}
                  value={message}
                />
              </div>

              {submitError ? (
                <p className="text-sm text-danger">{submitError}</p>
              ) : null}
              {submitSuccess ? (
                <p className="text-sm text-success">{submitSuccess}</p>
              ) : null}

              <Button disabled={isSubmitting} onClick={handleSubmit} size="lg">
                {isSubmitting ? "Submitting review..." : "Submit review"}
              </Button>
            </div>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
