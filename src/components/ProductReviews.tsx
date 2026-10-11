"use client";

import {
  getProductReviews,
  submitProductReview,
  type ProductReviewsResult,
  type ProductReview,
} from "@/lib/api/reviews";
import { BadgeCheck, PenLine, Star } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

function Stars({ value, size = "h-3.5 w-3.5" }: { value: number; size?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`${size} ${
            n <= Math.round(value)
              ? "fill-amber-400 text-amber-400"
              : "fill-zinc-200 text-zinc-200"
          }`}
        />
      ))}
    </span>
  );
}

function ReviewCard({ review }: { review: ProductReview }) {
  const date = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <li className="rounded-xl border border-zinc-200 bg-white p-4 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#12509b]/10 text-xs font-bold text-[#12509b]">
            {review.reviewerName.charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="flex items-center gap-1 text-sm font-bold text-zinc-900">
              {review.reviewerName}
              {review.isVerifiedPurchase && (
                <BadgeCheck className="h-3.5 w-3.5 text-emerald-500" />
              )}
            </p>
            {date && <p className="text-[11px] text-zinc-400">{date}</p>}
          </div>
        </div>
        <Stars value={review.rating} />
      </div>
      {review.title && (
        <p className="mt-3 text-sm font-bold text-zinc-900">{review.title}</p>
      )}
      {review.comment && (
        <p className="mt-1 text-sm leading-relaxed text-zinc-600">
          {review.comment}
        </p>
      )}
    </li>
  );
}

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3.5 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#12509b] focus:ring-2 focus:ring-[#12509b]/10";
const labelClass =
  "block text-xs font-bold uppercase tracking-wider text-zinc-700";

export default function ProductReviews({ productId }: { productId: string }) {
  const [result, setResult] = useState<ProductReviewsResult | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const [formOpen, setFormOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    let cancelled = false;
    getProductReviews(productId, page).then((data) => {
      if (cancelled) return;
      setResult(data);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [productId, page, refreshKey]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting || rating < 1) return;
    setSubmitting(true);
    setErrMsg("");
    setSuccessMsg("");
    try {
      const res = await submitProductReview(productId, {
        rating,
        title: title.trim() || undefined,
        comment: comment.trim(),
        reviewer_name: name.trim(),
        reviewer_email: email.trim(),
      });
      setSuccessMsg(res.message);
      setRating(0);
      setTitle("");
      setComment("");
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setErrMsg(
        err instanceof Error && err.message
          ? err.message
          : "Review submit korte parini. Abar try koren."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-zinc-900 sm:text-xl">
          Customer Reviews
        </h2>
        <button
          type="button"
          onClick={() => setFormOpen((o) => !o)}
          className="flex items-center gap-1.5 rounded-md border border-[#12509b]/30 bg-[#12509b]/5 px-3.5 py-2 text-xs font-bold text-[#12509b] transition-colors hover:bg-[#12509b] hover:text-white"
        >
          <PenLine className="h-3.5 w-3.5" />
          {formOpen ? "Close" : "Write a Review"}
        </button>
      </div>

      {formOpen && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-2xs"
        >
          <div className="flex items-center gap-3">
            <span className={labelClass}>Your Rating</span>
            <span className="inline-flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  onClick={() => setRating(n)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-6 w-6 ${
                      n <= rating
                        ? "fill-amber-400 text-amber-400"
                        : "fill-zinc-200 text-zinc-200"
                    }`}
                  />
                </button>
              ))}
            </span>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={labelClass}>Title (optional)</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={150}
                placeholder="e.g. Excellent Quality"
                className={fieldClass}
              />
            </label>
            <label className="block">
              <span className={labelClass}>Your Name</span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                placeholder="Full name"
                className={fieldClass}
              />
            </label>
            <label className="block sm:col-span-2">
              <span className={labelClass}>Review</span>
              <textarea
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={2000}
                rows={3}
                placeholder="Product kemon laglo? Share koren..."
                className={`${fieldClass} resize-y`}
              />
            </label>
            <label className="block sm:col-span-2">
              <span className={labelClass}>Email</span>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={150}
                placeholder="you@example.com"
                className={fieldClass}
              />
            </label>
          </div>

          {errMsg && (
            <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
              {errMsg}
            </p>
          )}
          {successMsg && (
            <p className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
              {successMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || rating < 1}
            className="mt-4 rounded-md bg-[#12509b] px-6 py-2.5 text-sm font-bold tracking-wide text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}

      {loading && (
        <div className="mt-4 animate-pulse space-y-3">
          <div className="h-20 rounded-xl bg-zinc-100" />
          <div className="h-24 rounded-xl bg-zinc-100" />
          <div className="h-24 rounded-xl bg-zinc-100" />
        </div>
      )}

      {!loading && result && (
        <div className="mt-4 grid gap-6 lg:grid-cols-[280px_1fr]">
          <div className="h-fit rounded-xl border border-zinc-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center gap-4">
              <p className="text-4xl font-black tracking-tight text-zinc-900">
                {result.averageRating.toFixed(1)}
              </p>
              <div>
                <Stars value={result.averageRating} size="h-4 w-4" />
                <p className="mt-1 text-xs text-zinc-500">
                  {result.reviewsCount}{" "}
                  {result.reviewsCount === 1 ? "review" : "reviews"}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-1.5">
              {([5, 4, 3, 2, 1] as const).map((star) => {
                const count = result.distribution[star];
                const pct =
                  result.reviewsCount > 0
                    ? Math.round((count / result.reviewsCount) * 100)
                    : 0;
                return (
                  <div key={star} className="flex items-center gap-2 text-xs">
                    <span className="w-3 text-right font-semibold text-zinc-600">
                      {star}
                    </span>
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100">
                      <div
                        className="h-full rounded-full bg-amber-400 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-6 text-right text-zinc-400">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            {result.reviews.length === 0 ? (
              <p className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center text-sm text-zinc-500">
                Ekhon kono review nei. Prothomo review ta apnar-i hote pare!
              </p>
            ) : (
              <ul className="space-y-3">
                {result.reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </ul>
            )}

            {result.lastPage > 1 && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1 || loading}
                  onClick={() => {
                    setLoading(true);
                    setPage((p) => p - 1);
                  }}
                  className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-bold text-zinc-700 transition-colors hover:border-[#12509b] hover:text-[#12509b] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-xs text-zinc-500">
                  Page {result.page} of {result.lastPage}
                </span>
                <button
                  type="button"
                  disabled={page >= result.lastPage || loading}
                  onClick={() => {
                    setLoading(true);
                    setPage((p) => p + 1);
                  }}
                  className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-bold text-zinc-700 transition-colors hover:border-[#12509b] hover:text-[#12509b] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
