import { useState, useCallback, useMemo } from "react";
import {
  getReviews,
  respondToReview as respondApi,
} from "@/services/review.service";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Review {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatar: string;
  nutritionistId: string;
  rating: number;
  comment: string;
  createdAt: string;
  response: string | null;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Review retrieval and response operations.
 */
export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getReviews();
      setReviews(data as unknown as Review[]);
    } catch {
      setError("Failed to fetch reviews");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const respondToReview = useCallback(
    async (reviewId: string, response: string) => {
      setIsLoading(true);
      setError(null);
      try {
        await respondApi(reviewId, response);
        setReviews((prev) =>
          prev.map((r) => (r.id === reviewId ? { ...r, response } : r)),
        );
      } catch {
        setError("Failed to respond to review");
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return Math.round((total / reviews.length) * 10) / 10;
  }, [reviews]);

  const unansweredReviews = useMemo(
    () => reviews.filter((r) => r.response === null),
    [reviews],
  );

  return {
    reviews,
    averageRating,
    unansweredReviews,
    isLoading,
    error,
    fetchReviews,
    respondToReview,
  };
}
