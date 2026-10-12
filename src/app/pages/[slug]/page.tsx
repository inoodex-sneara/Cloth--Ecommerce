import { notFound } from "next/navigation";
import Link from "next/link";
import { getCmsPage } from "@/lib/api/pages";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const page = await getCmsPage(slug);
  if (!page) return {};
  return {
    title: page.metaTitle ?? page.title,
    description: page.metaDescription ?? undefined,
  };
}

export default async function CmsPage({ params }: Props) {
  const { slug } = await params;
  const page = await getCmsPage(slug);
  if (!page) notFound();

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <nav className="flex items-center gap-1.5 text-sm text-zinc-500">
        <Link href="/" className="transition-colors hover:text-[#12509b]">
          Home
        </Link>
        <span>/</span>
        <span className="font-semibold text-zinc-800">{page.title}</span>
      </nav>
      <article className="mx-auto mt-6 max-w-3xl">
        <h1 className="mb-8 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {page.title}
        </h1>
        {page.content ? (
          <div
            className="cms-content space-y-4 text-[15px] leading-7 text-gray-700 [&_a]:text-[#12509b] [&_a]:underline [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-gray-900 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-gray-900 [&_li]:ml-5 [&_li]:list-disc [&_p]:leading-7 [&_ul]:space-y-1"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        ) : (
          <p className="text-gray-500">This page has no content yet.</p>
        )}
        <div className="mt-12 border-t border-gray-200 pt-6">
          <Link
            href="/"
            className="text-sm font-semibold text-[#12509b] hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </article>
    </div>
  );
}
