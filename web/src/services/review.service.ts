import api from "@/lib/axios";

import type { Review } from "@/types/review";
export type { Review };

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  distribution: Record<number, number>;
}

export async function getReviews(dietitianId?: string): Promise<Review[]> {
  const url = dietitianId ? `/reviews/dietitian/${dietitianId}` : "/reviews/dietitian/me";
  const { data } = await api.get(url);
  const result = data as any;
  return (result.reviews ?? (Array.isArray(result) ? result : [])) as Review[];
}

export async function getReviewStats(dietitianId?: string): Promise<ReviewStats> {
  const reviews = await getReviews(dietitianId);
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? reviews.reduce((sum, r) => sum + ((r as any).rating ?? 0), 0) / totalReviews
    : 0;
  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach((r) => {
    const rating = (r as any).rating ?? 0;
    if (rating >= 1 && rating <= 5) distribution[rating]++;
  });
  return { totalReviews, averageRating: Math.round(averageRating * 10) / 10, distribution };
}

export async function respondToReview(_reviewId: string, _response: string): Promise<Review> {
  // TODO: Review responses not yet a backend feature
  return {} as Review;
}
