import type { CatalogProduct } from "@/components/CatalogPageLayout";
import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/lib/api/products";
import type { Metadata } from "next";
import { PackageSearch } from "lucide-react";
import Link from "next/link";

function titleize(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const title = titleize(slug);
  return {
    title: `${title} — Loomora`,
    description: `Shop ${title} at Loomora — curated styles, honest prices, delivery across Bangladesh.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const title = titleize(slug);
  const api = await getProducts({ category: slug, per_page: 100 });
  const products: CatalogProduct[] = api?.products ?? [];

  return (
    <div className="w-full bg-white">
      <nav className="flex items-center gap-1.5 px-4 py-4 text-sm text-zinc-500">
        <Link href="/" className="transition-colors hover:text-[#12509b]">
          Home
        </Link>
        <span>/</span>
        <span className="font-semibold text-zinc-800">{title}</span>
      </nav>

      <div className="px-4 pb-12">
        <div className="rounded-2xl bg-gradient-to-r from-[#12509b] to-[#0c3a75] px-6 py-8 text-white sm:px-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
            Category
          </p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-white/85">
            {products.length} product{products.length === 1 ? "" : "s"} ready
          </p>
        </div>

        {products.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-zinc-200 bg-[#f7f8fc] p-8 text-center">
            <PackageSearch className="mx-auto h-10 w-10 text-zinc-400" />
            <h2 className="mt-4 text-lg font-bold text-zinc-900">
              &quot;{title}&quot; ei category-te akhon product nei
            </h2>
            <p className="mt-1.5 text-sm text-zinc-500">
              Notun stock elo-i ekhane chole ashbe. Tab somoy ei collections
              dekhe nen:
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {[
                { label: "Mens", href: "/men" },
                { label: "Womens", href: "/women" },
                { label: "Kids", href: "/kids" },
                { label: "New In", href: "/new-in" },
              ].map((category) => (
                <Link
                  key={category.href}
                  href={category.href}
                  className="rounded-full border border-[#12509b]/30 bg-white px-4 py-1.5 text-sm font-semibold text-[#12509b] transition-colors hover:bg-[#12509b] hover:text-white"
                >
                  {category.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
