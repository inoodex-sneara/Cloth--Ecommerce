import { apiFetch } from "./client";
import { loadToken } from "./auth";

export async function getWishlistIds(): Promise<string[]> {
  const token = loadToken();
  if (!token) return [];
  const res = await apiFetch<{ success: boolean; data: string[] }>(
    "/wishlist",
    { token, cache: "no-store" }
  );
  return (res.data ?? []).map(String);
}

export type ToggleWishlistResult = {
  inWishlist: boolean;
  /** Full updated wishlist ids when the API returns them. */
  ids: string[] | null;
};

export async function toggleWishlistItem(
  productId: string
): Promise<ToggleWishlistResult | null> {
  const token = loadToken();
  if (!token) return null;
  const res = await apiFetch<{
    success: boolean;
    in_wishlist?: boolean;
    action?: string;
    message?: string;
    data?: string[];
  }>("/wishlist/toggle", {
    method: "POST",
    token,
    body: { product_id: productId },
  });
  const inWishlist =
    res.in_wishlist ?? (res.action ? res.action === "added" : null);
  if (inWishlist === null) return null;
  return {
    inWishlist,
    ids: Array.isArray(res.data) ? res.data.map(String) : null,
  };
}

export async function syncWishlist(productIds: string[]): Promise<string[]> {
  const token = loadToken();
  if (!token) return [];
  const res = await apiFetch<{ success: boolean; data: string[] }>(
    "/wishlist/sync",
    {
      method: "POST",
      token,
      body: { product_ids: productIds },
    }
  );
  return (res.data ?? []).map(String);
}
