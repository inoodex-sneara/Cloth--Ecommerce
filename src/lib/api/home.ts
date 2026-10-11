import { cache } from "react";
import { apiFetch } from "./client";

export type HomeBanner = {
  id: number;
  title: string;
  subtitle: string;
  image_url: string;
  mobile_image_url: string | null;
  link_url: string;
  badge_text?: string | null;
  button_text?: string | null;
  placement: "hero" | "hero_slider" | "home_banner" | "category_banner" | "home_video" | string;
};

export type HomeCategory = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  image: string;
  products_count?: number;
};

export type HomeProduct = {
  id: number;
  name: string;
  slug: string;
  price: number;
  compare_price?: number | null;
  primary_image: string;
  rating_avg?: number;
  rating_count?: number;
  badge_label?: string | null;
  stock_quantity?: number;
};

export type CampaignItem = {
  id: number;
  flash_sale_id: number;
  product_id: number;
  flash_price: number;
  discount_percentage?: number | null;
  quantity_limit?: number | null;
  sold_count?: number | null;
  product: HomeProduct;
};

export type HomeCampaign = {
  id: number;
  title: string;
  slug: string;
  banner_image?: string | null;
  description?: string | null;
  starts_at?: string | null;
  ends_at?: string | null;
  items: CampaignItem[];
};

export type HomeBlog = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  cover_image?: string | null;
  category?: string | null;
  author_name?: string | null;
  read_time_minutes?: number | null;
  published_at?: string | null;
};

export type HomeData = {
  banners: HomeBanner[];
  categories: HomeCategory[];
  active_campaigns: HomeCampaign[];
  hot_products: HomeProduct[];
  trending_products: HomeProduct[];
  new_arrivals: HomeProduct[];
  featured_products: HomeProduct[];
  recent_blogs: HomeBlog[];
};

export type HomeResponse = {
  success: boolean;
  data: HomeData;
};

export const EMPTY_HOME: HomeData = {
  banners: [],
  categories: [],
  active_campaigns: [],
  hot_products: [],
  trending_products: [],
  new_arrivals: [],
  featured_products: [],
  recent_blogs: [],
};

export const getHome = cache(async (): Promise<HomeData> => {
  try {
    const res = await apiFetch<HomeResponse>("/home", { cache: "no-store" });
    return { ...EMPTY_HOME, ...res.data };
  } catch {
    return EMPTY_HOME;
  }
});
