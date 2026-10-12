import { cache } from "react";
import { apiFetch } from "./client";
import type { CampaignItem, HomeCampaign } from "./home";

export type CampaignsResponse = {
  success: boolean;
  data: HomeCampaign[];
};

export const getCampaigns = cache(async (): Promise<HomeCampaign[]> => {
  try {
    const res = await apiFetch<CampaignsResponse>("/campaigns", {
      cache: "no-store",
    });
    return res.data ?? [];
  } catch {
    return [];
  }
});

export const getCampaignBySlug = cache(
  async (slug: string): Promise<HomeCampaign | null> => {
    if (!/^[a-z0-9-]+$/.test(slug)) return null;
    try {
      const res = await apiFetch<{ success: boolean; data: HomeCampaign }>(
        `/campaigns/${encodeURIComponent(slug)}`,
        { cache: "no-store" }
      );
      return res.data ?? null;
    } catch {
      return null;
    }
  }
);

export function campaignItemToDeal(item: CampaignItem): {
  id: string;
  name: string;
  price: number;
  oldPrice: number;
  src: string;
} {
  return {
    id: String(item.product_id),
    name: item.product.name,
    price: item.flash_price,
    oldPrice: item.product.compare_price ?? item.product.price,
    src: item.product.primary_image,
  };
}
