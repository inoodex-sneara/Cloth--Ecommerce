import type { CatalogProduct } from "@/components/CatalogPageLayout";
import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/lib/api/products";
import { SearchX } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Search — Loomora",
  description:
    "Search Loomora for panjabi, saree, kurti, polo, denim, frock and more — one search away.",
};

const suggestions = ["Saree", "Polo", "Denim", "Frock", "Jacket", "Hoodie", "Kurti", "Shirt", "Sweatshirt"];

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const api = await getProducts(
    query ? { search: query, per_page: 100 } : { per_page: 100 }
  );
  const results: CatalogProduct[] = api?.products ?? [];

  return (
    <div className="w-full bg-white">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 px-4 py-4 text-sm text-zinc-500">
        <Link href="/" className="transition-colors hover:text-[#12509b]">
          Home
        </Link>
        <span>/</span>
        <span className="font-semibold text-zinc-800">Search</span>
      </nav>

      <div className="mx-auto max-w-[1440px] px-3 pb-12 sm:px-6 lg:px-8">
        {query ? (
          <p className="text-xs text-zinc-500 sm:text-sm">
            <b className="text-zinc-900">{results.length}</b> result
            {results.length === 1 ? "" : "s"} for{" "}
            <b className="text-zinc-900">&quot;{query}&quot;</b>
          </p>
        ) : (
          <p className="text-xs text-zinc-500 sm:text-sm">
            Search for products, categories, or colors —{" "}
            <b className="text-zinc-900">{results.length}</b> products
            available.
          </p>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {query && results.length === 0 && (
          <div className="mt-6 rounded-2xl border border-zinc-200 bg-[#f7f8fc] p-6 text-center sm:p-10">
            <SearchX className="mx-auto h-10 w-10 text-zinc-400" />
            <h1 className="mt-4 text-base font-bold text-zinc-900 sm:text-lg">
              No products found for &quot;{query}&quot;
            </h1>
            <p className="mt-1.5 text-xs text-zinc-500 sm:text-sm">
              Check spelling or try these popular categories:
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {suggestions.map((term) => (
                <Link
                  key={term}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="rounded-full border border-[#12509b]/30 bg-white px-3.5 py-1 text-xs font-semibold text-[#12509b] transition-colors hover:bg-[#12509b] hover:text-white sm:px-4 sm:py-1.5 sm:text-sm"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
