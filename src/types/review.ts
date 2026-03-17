export type ReviewStatus = "published" | "pending" | "rejected";

export type ReviewRecord = {
  id: string;
  clerkId: string;
  productId: string;
  orderId: string | null;
  entryKey: string;
  rating: number;
  title: string;
  message: string;
  fullName: string;
  status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
};

export type ReviewSummary = {
  averageRating: number;
  breakdown: Array<{
    count: number;
    percentage: number;
    rating: number;
  }>;
  totalReviews: number;
};

export type ReviewEligibility = {
  alreadyReviewed: boolean;
  canSubmit: boolean;
  reason:
    | "already-reviewed"
    | "not-authenticated"
    | "not-purchased"
    | "eligible";
};
