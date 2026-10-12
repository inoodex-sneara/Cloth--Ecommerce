import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getBlog } from "@/lib/api/blogs";

type Props = { params: Promise<{ slug: string }> };

function formatDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const result = await getBlog(slug);
  if (!result) return {};
  return {
    title: result.post.metaTitle ?? result.post.title,
    description: result.post.metaDescription ?? result.post.excerpt ?? undefined,
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const result = await getBlog(slug);
  if (!result) notFound();
  const { post, related } = result;

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <nav className="flex items-center gap-1.5 text-sm text-zinc-500">
        <Link href="/" className="transition-colors hover:text-[#12509b]">Home</Link>
        <span>/</span>
        <Link href="/blogs" className="transition-colors hover:text-[#12509b]">Blogs</Link>
        <span>/</span>
        <span className="line-clamp-1 font-semibold text-zinc-800">{post.title}</span>
      </nav>

      <article className="mx-auto mt-8 max-w-3xl">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm font-semibold text-[#12509b]">
          {post.category ? <span>{post.category}</span> : null}
          {post.readTimeMinutes ? (
            <span className="font-normal text-zinc-400">· {post.readTimeMinutes} min read</span>
          ) : null}
        </div>
        <h1 className="text-3xl font-black leading-tight tracking-tight text-zinc-900 sm:text-4xl">
          {post.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-zinc-500">
          {post.authorName ? <span>{post.authorName}</span> : null}
          {post.publishedAt ? <span>· {formatDate(post.publishedAt)}</span> : null}
        </div>

        {post.coverImage ? (
          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-zinc-100">
            <Image src={post.coverImage} alt={post.title} fill unoptimized className="object-cover" priority />
          </div>
        ) : null}

        {post.excerpt ? (
          <p className="mt-8 text-lg leading-relaxed text-zinc-600">{post.excerpt}</p>
        ) : null}

        {post.content ? (
          <div
            className="mt-6 space-y-4 text-[15px] leading-7 text-gray-700 [&_a]:text-[#12509b] [&_a]:underline [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-gray-900 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-gray-900 [&_li]:ml-5 [&_li]:list-disc [&_p]:leading-7 [&_ul]:space-y-1"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        ) : null}

        <div className="mt-12 border-t border-gray-200 pt-6">
          <Link href="/blogs" className="text-sm font-semibold text-[#12509b] hover:underline">
            ← All Blogs
          </Link>
        </div>
      </article>

      {related.length > 0 ? (
        <section className="mx-auto mt-16 max-w-5xl">
          <h2 className="text-xl font-black text-zinc-900">Related Articles</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/blogs/${r.slug}`}
                className="group overflow-hidden rounded-2xl border border-zinc-200 transition-shadow hover:shadow-lg"
              >
                {r.coverImage ? (
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-100">
                    <Image src={r.coverImage} alt={r.title} fill unoptimized className="object-cover transition-transform duration-300 group-hover:scale-105" />
                  </div>
                ) : null}
                <div className="p-4">
                  {r.category ? (
                    <p className="text-xs font-semibold text-[#12509b]">{r.category}</p>
                  ) : null}
                  <h3 className="mt-1 text-sm font-bold leading-snug text-zinc-900 group-hover:text-[#12509b]">
                    {r.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
