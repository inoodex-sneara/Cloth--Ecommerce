import type { CatalogProduct } from "@/components/CatalogPageLayout";
import { apiFetch } from "./client";
import { mediaUrl } from "./media";

type ApiAttributes = {
  fit?: string;
  color?: string;
  fabric?: string;
  length?: string;
  sleeve?: string;
  neck?: string;
  category?: string;
  colorName?: string;
  productType?: string;
};

type ApiVariant = {
  option_values?: { size?: string } | null;
};

type ApiProduct = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  attributes?: ApiAttributes | null;
  price: number;
  compare_price?: number | null;
  primary_image?: string | null;
  badge_label?: string | null;
  stock_quantity?: number | null;
  category?: { name?: string } | null;
  brand?: { name?: string } | null;
  variants?: ApiVariant[] | null;
};

type ApiRelatedProduct = {
  id: number;
  name: string;
  slug: string;
  price: number;
  compare_price?: number | null;
  primary_image?: string | null;
  badge_label?: string | null;
};

export type ApiProductDetail = {
  product: ApiProduct;
  flash_deal?: unknown;
  related_products: ApiRelatedProduct[];
};

type ApiProductDetailResponse = {
  success: boolean;
  data: ApiProductDetail;
};

function sizesFrom(variants?: ApiVariant[] | null): string[] {
  if (!variants?.length) return [];
  const sizes = variants
    .map((v) => v.option_values?.size)
    .filter((s): s is string => Boolean(s));
  return sizes.length > 0 ? sizes : [];
}

export function mapApiProduct(p: ApiProduct): CatalogProduct {
  const attrs = p.attributes ?? {};
  return {
    id: String(p.id),
    name: p.name,
    category: attrs.category ?? p.category?.name ?? "",
    brand: p.brand?.name ?? "Loomora",
    price: p.price,
    oldPrice: p.compare_price ?? undefined,
    color: attrs.color ?? "#a1a1aa",
    colorName: attrs.colorName,
    src: mediaUrl(p.primary_image),
    badge: p.badge_label ?? undefined,
    sizes: sizesFrom(p.variants),
    fabric: attrs.fabric,
    length: attrs.length,
    fit: attrs.fit,
    sleeve: attrs.sleeve,
    neck: attrs.neck,
    productType: attrs.productType,
  };
}

function mapRelated(p: ApiRelatedProduct): CatalogProduct {
  return {
    id: String(p.id),
    name: p.name,
    category: "",
    brand: "Loomora",
    price: p.price,
    oldPrice: p.compare_price ?? undefined,
    color: "#a1a1aa",
    src: mediaUrl(p.primary_image),
    badge: p.badge_label ?? undefined,
  };
}

export async function getApiProductDetail(
  id: string,
): Promise<{ product: CatalogProduct; related: CatalogProduct[] } | null> {
  if (!id || typeof id !== "string") return null;
  try {
    const res = await apiFetch<ApiProductDetailResponse>(`/products/${id}`, {
      cache: "no-store",
    });
    if (!res.data?.product) return null;
    return {
      product: mapApiProduct(res.data.product),
      related: (res.data.related_products ?? []).map(mapRelated),
    };
  } catch {
    return null;
  }
}

type ProductListResponse = {
  success: boolean;
  data: ApiProduct[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

export type ProductListParams = {
  search?: string;
  category?: string | number;
  brand?: string | number;
  min_price?: number;
  max_price?: number;
  badge?: "hot" | "trending" | "new_arrival";
  in_stock?: boolean;
  sort?: "latest" | "price_asc" | "price_desc" | "rating" | "name_asc";
  page?: number;
  per_page?: number;
};

export type ProductListResult = {
  products: CatalogProduct[];
  page: number;
  lastPage: number;
  perPage: number;
  total: number;
};

export async function getProducts(
  params: ProductListParams = {},
): Promise<ProductListResult | null> {
  try {
    const qs = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null || value === "") continue;
      qs.set(key, String(value));
    }
    const query = qs.size > 0 ? `?${qs.toString()}` : "";
    const res = await apiFetch<ProductListResponse>(`/products${query}`, {
      cache: "no-store",
    });
    const rawProducts = (res.data ?? []).map(mapApiProduct);
    let products = rawProducts;

    // Filter out false positive substring matches (e.g. "women" containing "men")
    if (params.search) {
      const s = params.search.trim().toLowerCase();
      const tokens = s.split(/\s+/);
      const isMenSearch = tokens.some((t) => t === "men" || t === "mens");
      const isWomenSearch = tokens.some((t) => t === "women" || t === "womens");

      if (isMenSearch && !isWomenSearch) {
        products = products.filter((p) => {
          const nameLower = p.name.toLowerCase();
          const catLower = p.category.toLowerCase();
          if (nameLower.includes("women") || catLower.includes("women")) {
            return (
              /\b(men|mens)\b/i.test(nameLower) ||
              /\b(men|mens)\b/i.test(catLower)
            );
          }
          return true;
        });
      }
    }

    return {
      products,
      page: res.meta?.current_page ?? 1,
      lastPage: res.meta?.last_page ?? 1,
      perPage: res.meta?.per_page ?? 16,
      total: res.meta?.total ?? products.length,
    };
  } catch {
    return null;
  }
}
