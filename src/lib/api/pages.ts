import { cache } from "react";
import { apiFetch } from "./client";

export type CmsPageMeta = {
  id: number;
  title: string;
  slug: string;
  metaTitle: string | null;
  metaDescription: string | null;
};

export type CmsPage = CmsPageMeta & {
  content: string;
};

type PagesListResponse = {
  success: boolean;
  data: {
    id: number;
    title: string;
    slug: string;
    meta_title?: string | null;
    meta_description?: string | null;
  }[];
};

type PageResponse = {
  success: boolean;
  data: {
    id: number;
    title: string;
    slug: string;
    content?: string | null;
    meta_title?: string | null;
    meta_description?: string | null;
    is_published?: boolean;
  };
};

function mapMeta(p: PagesListResponse["data"][number]): CmsPageMeta {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    metaTitle: p.meta_title ?? null,
    metaDescription: p.meta_description ?? null,
  };
}

export const getPages = cache(async (): Promise<CmsPageMeta[]> => {
  try {
    const res = await apiFetch<PagesListResponse>("/pages", {
      cache: "no-store",
    });
    return (res.data ?? []).map(mapMeta);
  } catch {
    return [];
  }
});

export const getCmsPage = cache(
  async (slug: string): Promise<CmsPage | null> => {
    if (!/^[a-z0-9-]+$/.test(slug)) return null;
    try {
      const res = await apiFetch<PageResponse>(
        `/pages/${encodeURIComponent(slug)}`,
        { cache: "no-store" }
      );
      const p = res.data;
      if (!p || p.is_published === false) return null;
      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        content: p.content ?? "",
        metaTitle: p.meta_title ?? null,
        metaDescription: p.meta_description ?? null,
      };
    } catch {
      return null;
    }
  }
);
