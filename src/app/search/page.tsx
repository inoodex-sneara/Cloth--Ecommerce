import type { CatalogProduct } from "@/components/CatalogPageLayout";
import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/lib/api/products";
import { Search, SearchX } from "lucide-react";
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

      <div className="px-4 pb-10">
        {/* Search box */}
        <form action="/search" method="GET" className="flex max-w-xl items-center">
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="I'm shopping for ..."
            className="h-11 w-full min-w-0 rounded-l-md border-2 border-[#12509b] px-4 text-sm text-zinc-800 outline-none placeholder:text-zinc-400"
          />
          <button
            type="submit"
            aria-label="Search"
            className="flex h-11 w-12 shrink-0 items-center justify-center rounded-r-md bg-[#12509b] text-white transition-opacity hover:opacity-90 cursor-pointer"
          >
            <Search className="h-5 w-5" />
          </button>
        </form>

        {query ? (
          <p className="mt-5 text-sm text-zinc-500">
            <b className="text-zinc-900">{results.length}</b> result
            {results.length === 1 ? "" : "s"} for{" "}
            <b className="text-zinc-900">&quot;{query}&quot;</b>
          </p>
        ) : (
          <p className="mt-5 text-sm text-zinc-500">
            Search for products, categories, or colors —{" "}
            <b className="text-zinc-900">{results.length}</b> products
            available.
          </p>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {query && results.length === 0 && (
          <div className="mt-6 rounded-2xl border border-zinc-200 bg-[#f7f8fc] p-8 text-center">
            <SearchX className="mx-auto h-10 w-10 text-zinc-400" />
            <h1 className="mt-4 text-lg font-bold text-zinc-900">
              No products found for &quot;{query}&quot;
            </h1>
            <p className="mt-1.5 text-sm text-zinc-500">
              Check spelling or try these popular categories:
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {suggestions.map((term) => (
                <Link
                  key={term}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="rounded-full border border-[#12509b]/30 bg-white px-4 py-1.5 text-sm font-semibold text-[#12509b] transition-colors hover:bg-[#12509b] hover:text-white"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Browse all (no query) */}
        {!query && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
