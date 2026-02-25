// ---------------------------------------------------------------------------
// Review Service
// ---------------------------------------------------------------------------

import { mockReviews, simulateApiCall } from "@/mock";

type Review = (typeof mockReviews)[number];

// ── Types ────────────────────────────────────────────────────────────────────

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: Record<number, number>;
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function getReviews(): Promise<Review[]> {
  return simulateApiCall([...mockReviews], 300);
}

export async function getReviewStats(): Promise<ReviewStats> {
  const total = mockReviews.length;
  const avg =
    total > 0
      ? Math.round(
          (mockReviews.reduce((sum, r) => sum + r.rating, 0) / total) * 10,
        ) / 10
      : 0;

  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const r of mockReviews) {
    distribution[r.rating] = (distribution[r.rating] ?? 0) + 1;
  }

  return simulateApiCall(
    { totalReviews: total, averageRating: avg, ratingDistribution: distribution },
    300,
  );
}

export async function respondToReview(
  reviewId: string,
  response: string,
): Promise<Review> {
  const review = mockReviews.find((r) => r.id === reviewId) ?? mockReviews[0];
  return simulateApiCall({ ...review, response }, 400);
}
