import { cache } from "react";
import { apiFetch } from "./client";

export type NavigationMenuItem = {
  label: string;
  href: string;
  highlight: boolean;
};

export type StoreSettings = {
  store_name: string;
  store_tagline: string;
  store_logo: string;
  store_favicon: string;
  currency_symbol: string;
  currency_code: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  social_facebook: string | null;
  social_instagram: string | null;
  social_twitter: string | null;
  social_youtube: string | null;
  free_shipping_threshold: number;
  default_shipping_fee: number;
  announcement_bar: string;
  navigation_menu: NavigationMenuItem[];
};

export type SettingsResponse = {
  success: boolean;
  data: StoreSettings;
};

const DEFAULT_SETTINGS: StoreSettings = {
  store_name: "Loomora",
  store_tagline: "Lifestyle Ltd",
  store_logo: "",
  store_favicon: "",
  currency_symbol: "৳",
  currency_code: "BDT",
  contact_email: "support@loomora.com",
  contact_phone: "+880-1700-000000",
  contact_address: "House 12, Road 5, Dhanmondi, Dhaka-1205, Bangladesh",
  social_facebook: null,
  social_instagram: null,
  social_twitter: null,
  social_youtube: null,
  free_shipping_threshold: 1000,
  default_shipping_fee: 12.5,
  announcement_bar:
    "Free nationwide express shipping on all orders over ৳1,000!",
  navigation_menu: [],
};

export const getSettings = cache(async (): Promise<StoreSettings> => {
  try {
    const res = await apiFetch<SettingsResponse>("/settings", {
      cache: "no-store",
    });
    return { ...DEFAULT_SETTINGS, ...res.data };
  } catch {
    return DEFAULT_SETTINGS;
  }
});
