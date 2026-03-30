import api from "@/lib/axios";

import type { Review } from "@/types/review";
export type { Review };

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  distribution: Record<number, number>;
}

interface ApiReviewResponse {
  reviews?: Review[];
}

export async function getReviews(dietitianId?: string): Promise<Review[]> {
  const url = dietitianId ? `/reviews/dietitian/${dietitianId}` : "/reviews/dietitian/me";
  const { data } = await api.get(url);
  const result = data as ApiReviewResponse;
  return result.reviews ?? (Array.isArray(data) ? (data as Review[]) : []);
}

export async function getReviewStats(dietitianId?: string): Promise<ReviewStats> {
  const reviews = await getReviews(dietitianId);
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? reviews.reduce((sum, r) => sum + (r.overallRating ?? 0), 0) / totalReviews
    : 0;
  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach((r) => {
    const rating = r.overallRating ?? 0;
    if (rating >= 1 && rating <= 5) distribution[rating]++;
  });
  return { totalReviews, averageRating: Math.round(averageRating * 10) / 10, distribution };
}

export async function respondToReview(reviewId: string, response: string): Promise<Review> {
  const { data } = await api.post(`/reviews/${reviewId}/respond`, { response });
  return data as Review;
}

