// ---------------------------------------------------------------------------
// Review / Rating Types
// ---------------------------------------------------------------------------

import type { PaginationParams, Timestamps } from "./common";

/** Review status (moderation). */
export type ReviewStatus = "pending" | "approved" | "rejected" | "flagged";

/** What entity is being reviewed. */
export type ReviewTarget = "dietitian" | "recipe" | "plan_template" | "platform";

// ── Core entities ──────────────────────────────────────────────────────────

/** A user review. */
export interface Review extends Timestamps {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatarUrl?: string | null;
  targetType: ReviewTarget;
  targetId: string;
  targetName?: string | null;
  status: ReviewStatus;

  /** 1-5 overall rating. */
  overallRating: number;
  /** Category-specific ratings. */
  categoryRatings?: CategoryRating[];

  title?: string | null;
  comment: string;

  /** Pros & cons. */
  pros?: string[];
  cons?: string[];

  /** Would recommend? */
  wouldRecommend?: boolean | null;

  /** Images attached to the review. */
  imageUrls?: string[];

  /** Helpfulness votes. */
  helpfulCount: number;
  unhelpfulCount: number;

  /** Dietitian response. */
  response?: ReviewResponse | null;

  isVerified: boolean;
  isAnonymous: boolean;
}

/** Sub-rating for a specific category. */
export interface CategoryRating {
  category: string;
  label: string;
  rating: number;
}

/** Response from the reviewed entity (e.g. dietitian). */
export interface ReviewResponse {
  id: string;
  reviewId: string;
  responderId: string;
  responderName: string;
  content: string;
  createdAt: string;
  updatedAt?: string | null;
}

/** Aggregate rating stats for an entity. */
export interface RatingSummary {
  targetType: ReviewTarget;
  targetId: string;
  averageRating: number;
  totalReviews: number;
  /** Distribution: index 0 = 1-star, index 4 = 5-star. */
  distribution: [number, number, number, number, number];
  categoryAverages?: CategoryRating[];
  recommendPercent?: number;
}

/** Lightweight review for widgets. */
export interface ReviewSummary {
  id: string;
  reviewerName: string;
  reviewerAvatarUrl?: string | null;
  overallRating: number;
  title?: string | null;
  commentPreview: string;
  createdAt: string;
  isVerified: boolean;
  helpfulCount: number;
}

// ── Requests ───────────────────────────────────────────────────────────────

/** Submit a new review. */
export interface CreateReviewRequest {
  targetType: ReviewTarget;
  targetId: string;
  overallRating: number;
  categoryRatings?: Omit<CategoryRating, "label">[];
  title?: string;
  comment: string;
  pros?: string[];
  cons?: string[];
  wouldRecommend?: boolean;
  imageUrls?: string[];
  isAnonymous?: boolean;
}

/** Update an existing review. */
export interface UpdateReviewRequest extends Partial<CreateReviewRequest> {
  id: string;
}

/** Respond to a review. */
export interface CreateReviewResponseRequest {
  reviewId: string;
  content: string;
}

/** Vote on a review's helpfulness. */
export interface ReviewVoteRequest {
  reviewId: string;
  isHelpful: boolean;
}

/** Review list filters. */
export interface ReviewFilters {
  targetType?: ReviewTarget;
  targetId?: string;
  status?: ReviewStatus[];
  minRating?: number;
  maxRating?: number;
  hasResponse?: boolean;
  isVerified?: boolean;
  search?: string;
  sortBy?: "newest" | "oldest" | "highest" | "lowest" | "most_helpful";
  pagination: PaginationParams;
}

/** Review moderation action. */
export interface ModerateReviewRequest {
  reviewId: string;
  action: "approve" | "reject" | "flag";
  reason?: string;
}
