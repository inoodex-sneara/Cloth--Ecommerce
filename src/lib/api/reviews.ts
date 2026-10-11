import { apiFetch } from "./client";

export type ProductReview = {
  id: number;
  productId: number;
  rating: number;
  title: string | null;
  comment: string | null;
  reviewerName: string;
  isVerifiedPurchase: boolean;
  createdAt: string | null;
};

export type ReviewDistribution = {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
};

export type ProductReviewsResult = {
  reviews: ProductReview[];
  page: number;
  lastPage: number;
  total: number;
  averageRating: number;
  reviewsCount: number;
  distribution: ReviewDistribution;
};

type ReviewsResponse = {
  success: boolean;
  data: {
    id: number;
    product_id: number;
    rating: number;
    title?: string | null;
    comment?: string | null;
    reviewer_name?: string | null;
    is_verified_purchase?: boolean;
    created_at?: string | null;
  }[];
  meta?: {
    current_page?: number;
    last_page?: number;
    total?: number;
    average_rating?: number;
    reviews_count?: number;
    distribution?: Record<string, number>;
  };
};

export async function getProductReviews(
  productId: string,
  page = 1
): Promise<ProductReviewsResult | null> {
  if (!/^\d+$/.test(productId)) return null;
  try {
    const query = page > 1 ? `?page=${page}` : "";
    const res = await apiFetch<ReviewsResponse>(
      `/products/${productId}/reviews${query}`,
      { cache: "no-store" }
    );
    const dist = res.meta?.distribution ?? {};
    return {
      reviews: (res.data ?? []).map((r) => ({
        id: r.id,
        productId: r.product_id,
        rating: r.rating,
        title: r.title ?? null,
        comment: r.comment ?? null,
        reviewerName: r.reviewer_name || "Customer",
        isVerifiedPurchase: r.is_verified_purchase ?? false,
        createdAt: r.created_at ?? null,
      })),
      page: res.meta?.current_page ?? page,
      lastPage: res.meta?.last_page ?? 1,
      total: res.meta?.total ?? res.data?.length ?? 0,
      averageRating: res.meta?.average_rating ?? 0,
      reviewsCount: res.meta?.reviews_count ?? res.data?.length ?? 0,
      distribution: {
        5: dist["5"] ?? 0,
        4: dist["4"] ?? 0,
        3: dist["3"] ?? 0,
        2: dist["2"] ?? 0,
        1: dist["1"] ?? 0,
      },
    };
  } catch {
    return null;
  }
}

export type SubmitReviewParams = {
  rating: number;
  title?: string;
  comment: string;
  reviewer_name: string;
  reviewer_email: string;
};

type SubmitReviewResponse = {
  success: boolean;
  message: string;
  data: { id: number; status: string };
};

export async function submitProductReview(
  productId: string,
  params: SubmitReviewParams
): Promise<{ message: string; status: string }> {
  if (!/^\d+$/.test(productId)) throw new Error("Invalid product");
  const res = await apiFetch<SubmitReviewResponse>(
    `/products/${productId}/reviews`,
    { method: "POST", body: params }
  );
  return { message: res.message, status: res.data.status };
}
