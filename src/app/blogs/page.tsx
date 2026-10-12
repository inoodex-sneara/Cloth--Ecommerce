import Link from "next/link";
import Image from "next/image";
import { getBlogs, type BlogPost } from "@/lib/api/blogs";

type Props = { searchParams: Promise<{ category?: string; page?: string }> };

export const metadata = {
  title: "Blog — Loomora",
  description: "Fashion tips, shopping guides, and the latest trends from Loomora.",
};

function formatDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blogs/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-100">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#12509b]">
          {post.category ? <span>{post.category}</span> : null}
          {post.readTimeMinutes ? (
            <span className="text-zinc-400">· {post.readTimeMinutes} min read</span>
          ) : null}
        </div>
        <h2 className="text-lg font-bold leading-snug text-zinc-900 group-hover:text-[#12509b]">
          {post.title}
        </h2>
        {post.excerpt ? (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-600">
            {post.excerpt}
          </p>
        ) : null}
        <div className="mt-auto flex items-center justify-between pt-4 text-xs text-zinc-500">
          <span>{post.authorName}</span>
          <span>{formatDate(post.publishedAt)}</span>
        </div>
      </div>
    </Link>
  );
}

export default async function BlogsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const category = sp.category?.trim() || undefined;
  const page = Math.max(1, Number(sp.page) || 1);
  const { posts, categories, currentPage, lastPage, total } = await getBlogs(category, page);

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <nav className="flex items-center gap-1.5 text-sm text-zinc-500">
        <Link href="/" className="transition-colors hover:text-[#12509b]">Home</Link>
        <span>/</span>
        <span className="font-semibold text-zinc-800">Blogs</span>
      </nav>

      <div className="mt-6">
        <h1 className="text-3xl font-black tracking-tight text-zinc-900">Blogs</h1>
        <p className="mt-2 text-sm text-zinc-600">
          {total > 0 ? `${total} article${total === 1 ? "" : "s"}` : "No articles yet"}
          {category ? ` in “${category}”` : ""}
        </p>
      </div>

      {categories.length > 0 ? (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Link
            href="/blogs"
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              !category
                ? "border-[#12509b] bg-[#12509b] text-white"
                : "border-zinc-300 text-zinc-700 hover:border-[#12509b] hover:text-[#12509b]"
            }`}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c}
              href={`/blogs?category=${encodeURIComponent(c)}`}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                category === c
                  ? "border-[#12509b] bg-[#12509b] text-white"
                  : "border-zinc-300 text-zinc-700 hover:border-[#12509b] hover:text-[#12509b]"
              }`}
            >
              {c}
            </Link>
          ))}
        </div>
      ) : null}

      {posts.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-zinc-300 py-16 text-center text-sm text-zinc-500">
          No blog posts found.
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {lastPage > 1 ? (
        <div className="mt-10 flex items-center justify-center gap-2">
          {Array.from({ length: lastPage }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={`/blogs?${new URLSearchParams({
                ...(category ? { category } : {}),
                ...(n > 1 ? { page: String(n) } : {}),
              }).toString()}`}
              className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-semibold transition-colors ${
                n === currentPage
                  ? "bg-[#12509b] text-white"
                  : "border border-zinc-300 text-zinc-700 hover:border-[#12509b] hover:text-[#12509b]"
              }`}
            >
              {n}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
