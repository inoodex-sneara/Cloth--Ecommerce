import { cache } from "react";
import { apiFetch } from "./client";
import { mediaUrl } from "./media";

export type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string;
  category: string | null;
  authorName: string | null;
  readTimeMinutes: number | null;
  publishedAt: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
};

export type BlogListResult = {
  posts: BlogPost[];
  categories: string[];
  currentPage: number;
  lastPage: number;
  total: number;
};

type BlogItem = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  cover_image?: string | null;
  category?: string | null;
  author_name?: string | null;
  read_time_minutes?: number | null;
  published_at?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  is_published?: boolean;
};

type BlogListResponse = {
  success: boolean;
  data: BlogItem[];
  categories?: string[];
  meta?: { current_page?: number; last_page?: number; total?: number };
};

type BlogDetailResponse = {
  success: boolean;
  data: {
    post?: BlogItem;
    related_posts?: BlogItem[];
  };
};

function mapPost(b: BlogItem): BlogPost {
  return {
    id: b.id,
    title: b.title,
    slug: b.slug,
    excerpt: b.excerpt ?? null,
    content: b.content ?? "",
    coverImage: mediaUrl(b.cover_image),
    category: b.category ?? null,
    authorName: b.author_name ?? null,
    readTimeMinutes: b.read_time_minutes ?? null,
    publishedAt: b.published_at ?? null,
    metaTitle: b.meta_title ?? null,
    metaDescription: b.meta_description ?? null,
  };
}

export async function getBlogs(
  category?: string,
  page = 1
): Promise<BlogListResult> {
  try {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    const res = await apiFetch<BlogListResponse>(
      `/blogs${qs ? `?${qs}` : ""}`,
      { cache: "no-store" }
    );
    return {
      posts: (res.data ?? []).map(mapPost),
      categories: res.categories ?? [],
      currentPage: res.meta?.current_page ?? 1,
      lastPage: res.meta?.last_page ?? 1,
      total: res.meta?.total ?? 0,
    };
  } catch {
    return { posts: [], categories: [], currentPage: 1, lastPage: 1, total: 0 };
  }
}

export const getBlog = cache(
  async (slug: string): Promise<{ post: BlogPost; related: BlogPost[] } | null> => {
    if (!/^[a-z0-9-]+$/.test(slug)) return null;
    try {
      const res = await apiFetch<BlogDetailResponse>(
        `/blogs/${encodeURIComponent(slug)}`,
        { cache: "no-store" }
      );
      const post = res.data?.post;
      if (!post || post.is_published === false) return null;
      return {
        post: mapPost(post),
        related: (res.data?.related_posts ?? []).map(mapPost),
      };
    } catch {
      return null;
    }
  }
);
