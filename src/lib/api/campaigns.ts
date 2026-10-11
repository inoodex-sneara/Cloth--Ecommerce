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
